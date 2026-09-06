import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";

import {
  getOwnPlayerIndividualResults,
  getOwnPlayerTeamResults,
} from "../controllers/result-controller.js";
import TeamResult from "../models/team-result-model.js";
import TournamentEntry from "../models/tournamentEntry-model.js";
import resultRouter from "../routes/result-router.js";

afterEach(() => mock.restoreAll());

const createResponse = () => ({
  statusCode: 200,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  },
});

const withResultServer = async (callback) => {
  const app = express();
  app.use(cookieParser());
  app.use("/result", resultRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
};

test("individual self-service results ignore a supplied player ID", async () => {
  let capturedFilter;
  mock.method(TournamentEntry, "find", (filter) => {
    capturedFilter = filter;
    return {
      select() { return this; },
      async lean() { return []; },
    };
  });

  const response = createResponse();
  await getOwnPlayerIndividualResults(
    { user: { id: "authenticated-player" }, params: { playerId: "another-player" } },
    response,
  );

  assert.deepEqual(capturedFilter, { playerId: "authenticated-player" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload.data, []);
});

test("team self-service results query only the authenticated player", async () => {
  let capturedFilter;
  mock.method(TeamResult, "find", (filter) => {
    capturedFilter = filter;
    return {
      populate() { return this; },
      async lean() { return []; },
    };
  });

  const response = createResponse();
  await getOwnPlayerTeamResults(
    { user: { id: "authenticated-player" }, params: { playerId: "another-player" } },
    response,
  );

  assert.deepEqual(capturedFilter, { "players.playerId": "authenticated-player" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload.data, []);
});

test("unauthenticated self-service result requests are rejected", async () => {
  await withResultServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/result/player/individual`);
    assert.equal(response.status, 401);
  });
});

test("a player cannot use the admin arbitrary-player result route", async () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "result-ownership-test-secret";

  try {
    const token = jwt.sign({ id: "authenticated-player", role: "player" }, process.env.JWT_SECRET);
    await withResultServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/result/player/team/another-player`, {
        headers: { Cookie: `token=${token}` },
      });
      assert.equal(response.status, 403);
    });
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});
