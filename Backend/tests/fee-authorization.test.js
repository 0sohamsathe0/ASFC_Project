import assert from "node:assert/strict";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import test from "node:test";

import adminFeeRouter from "../routes/admin-fee-router.js";
import playerFeeRouter from "../routes/player-fee-router.js";

const withServer = async (callback) => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use("/admin/fees", adminFeeRouter);
  app.use("/player/fees", playerFeeRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
};

test("fee routes reject unauthenticated requests", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/admin/fees/rates`)).status, 401);
    assert.equal((await fetch(`${baseUrl}/player/fees`)).status, 401);
  });
});

test("fee routes enforce admin and player roles", async () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "fee-authorization-test-secret";
  try {
    const playerToken = jwt.sign({ id: "player-id", role: "player" }, process.env.JWT_SECRET);
    const adminToken = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET);
    await withServer(async (baseUrl) => {
      const adminRouteAsPlayer = await fetch(`${baseUrl}/admin/fees/rates`, {
        headers: { Cookie: `token=${playerToken}` },
      });
      const playerRouteAsAdmin = await fetch(`${baseUrl}/player/fees`, {
        headers: { Cookie: `token=${adminToken}` },
      });
      const repeatedSearchAsAdmin = await fetch(
        `${baseUrl}/admin/fees/accounts?search=a&search=b`,
        { headers: { Cookie: `token=${adminToken}` } }
      );
      const previewAsPlayer = await fetch(
        `${baseUrl}/admin/fees/accounts/507f1f77bcf86cd799439011/coverage/preview`,
        {
          method: "POST",
          headers: {
            Cookie: `token=${playerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expectedPaidThroughMonth: null,
            expectedVersion: 0,
            numberOfMonths: 1,
          }),
        }
      );
      assert.equal(adminRouteAsPlayer.status, 403);
      assert.equal(playerRouteAsAdmin.status, 403);
      assert.equal(repeatedSearchAsAdmin.status, 400);
      assert.equal((await repeatedSearchAsAdmin.json()).code, "INVALID_FEE_SEARCH");
      assert.equal(previewAsPlayer.status, 403);
    });
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});
