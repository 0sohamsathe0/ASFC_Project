import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, mock, test } from "node:test";

import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import Contact from "../models/contact-us-model.js";
import IndividualResult from "../models/individual-result-model.js";
import Player from "../models/player-model.js";
import TeamResult from "../models/team-result-model.js";
import { addPlayer, getPlayerProfile, loginPlayer, registrationServices } from "../controllers/player-controller.js";
import contactRouter from "../routes/contact-router.js";
import resultRouter from "../routes/result-router.js";
import playerRouter from "../routes/player-router.js";
import adminRouter from "../routes/admin-router.js";

const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "security-hardening-test-secret";
cloudinary.config({ cloud_name: "test-cloud", api_key: "test-key", api_secret: "test-secret" });

afterEach(() => mock.restoreAll());

process.on("exit", () => {
  if (previousSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previousSecret;
});

const createResponse = () => ({
  statusCode: 200,
  payload: null,
  cookieValue: null,
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.payload = payload; return this; },
  cookie(name, value) { this.cookieValue = { name, value }; return this; },
});

const queryResult = (value) => ({
  select() { return this; },
  sort() { return this; },
  populate() { return this; },
  async lean() { return value; },
});

const withServer = async (routerSetup, callback) => {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  routerSetup(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
};

const tokenFor = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET);

test("contact listing rejects public and player requests but permits an admin", async () => {
  mock.method(Contact, "find", () => queryResult([{
    _id: "contact-id",
    fullName: "Contact Name",
    email: "contact@example.test",
    phone: "9999999999",
    subject: "Subject",
    message: "Message",
    isRead: false,
    createdAt: new Date("2026-09-01T00:00:00.000Z"),
    updatedAt: new Date("2026-09-01T00:00:00.000Z"),
    internalValue: "must-not-leak",
  }]));
  await withServer((app) => app.use(contactRouter), async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/contacts`)).status, 401);
    assert.equal((await fetch(`${baseUrl}/contacts`, {
      headers: { Cookie: `token=${tokenFor("player-id", "player")}` },
    })).status, 403);
    const adminResponse = await fetch(`${baseUrl}/contacts`, {
      headers: { Cookie: `token=${tokenFor("admin", "admin")}` },
    });
    assert.equal(adminResponse.status, 200);
    const body = await adminResponse.json();
    assert.deepEqual(Object.keys(body.data[0]).sort(), [
      "_id", "createdAt", "email", "fullName", "isRead", "message", "phone", "subject", "updatedAt",
    ]);
    assert.equal(JSON.stringify(body).includes("must-not-leak"), false);
  });
});

test("raw individual and team result routes are admin-only", async () => {
  mock.method(IndividualResult, "find", () => queryResult([]));
  mock.method(TeamResult, "find", () => queryResult([]));
  await withServer((app) => app.use("/result", resultRouter), async (baseUrl) => {
    for (const kind of ["individual", "team"]) {
      assert.equal((await fetch(`${baseUrl}/result/${kind}/507f1f77bcf86cd799439011`)).status, 401);
      assert.equal((await fetch(`${baseUrl}/result/${kind}/507f1f77bcf86cd799439011`, {
        headers: { Cookie: `token=${tokenFor("player-id", "player")}` },
      })).status, 403);
      assert.equal((await fetch(`${baseUrl}/result/${kind}/507f1f77bcf86cd799439011`, {
        headers: { Cookie: `token=${tokenFor("admin", "admin")}` },
      })).status, 200);
    }
  });
});

test("individual result DTO strips sensitive populated Player fields", async () => {
  mock.method(IndividualResult, "find", () => queryResult([{
    _id: "result-id",
    tournamentId: "tournament-id",
    category: "Male_Epee",
    place: "First",
    tournamentEntryId: {
      _id: "entry-id",
      playerId: {
        _id: "player-id",
        fullName: "Safe Name",
        gender: "Male",
        event: "Epee",
        photoURL: "https://example.test/photo.jpg",
        aadharCard: "123456789012",
        aadharCardURL: "https://example.test/document.jpg",
        email: "private@example.test",
      },
    },
  }]));
  await withServer((app) => app.use("/result", resultRouter), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/result/individual/507f1f77bcf86cd799439011`, {
      headers: { Cookie: `token=${tokenFor("admin", "admin")}` },
    });
    const body = await response.json();
    const player = body.data[0].tournamentEntryId.playerId;
    assert.deepEqual(Object.keys(player).sort(), ["_id", "event", "fullName", "gender", "photoURL"]);
    assert.equal(JSON.stringify(body).includes("123456789012"), false);
    assert.equal(JSON.stringify(body).includes("private@example.test"), false);
  });
});

test("the intentionally public club-results DTO remains reachable without a session", async () => {
  mock.method(Player, "countDocuments", async () => 0);
  mock.method(IndividualResult, "find", () => queryResult([]));
  mock.method(TeamResult, "find", () => queryResult([]));
  await withServer((app) => app.use("/result", resultRouter), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/result/club`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.deepEqual(body.data, []);
  });
});

test("player login validates Aadhaar and DOB before querying", async () => {
  let queryCount = 0;
  mock.method(Player, "findOne", () => { queryCount += 1; return null; });
  const invalidBodies = [
    { aadharCard: "123", dob: "2000-01-01" },
    { aadharCard: "1234567890123", dob: "2000-01-01" },
    { aadharCard: { $ne: null }, dob: "2000-01-01" },
    { aadharCard: { $gt: "" }, dob: "2000-01-01" },
    { aadharCard: ["123456789012"], dob: "2000-01-01" },
    { aadharCard: null, dob: "2000-01-01" },
    { aadharCard: "123456789012", dob: "01-01-2000" },
    { aadharCard: "123456789012", dob: "2025-02-30" },
  ];
  for (const body of invalidBodies) {
    const response = createResponse();
    await loginPlayer({ body }, response);
    assert.equal(response.statusCode, 400);
  }
  assert.equal(queryCount, 0);
});

test("unknown Aadhaar and wrong DOB return indistinguishable authentication failures", async () => {
  mock.method(Player, "findOne", ({ aadharCard }) => aadharCard === "111122223333"
    ? { _id: "player-id", dob: new Date("2000-01-01T00:00:00.000Z") }
    : null);
  const unknown = createResponse();
  await loginPlayer({ body: { aadharCard: "999988887777", dob: "2000-01-01" } }, unknown);
  const wrongDob = createResponse();
  await loginPlayer({ body: { aadharCard: "111122223333", dob: "2001-01-01" } }, wrongDob);
  assert.equal(unknown.statusCode, 401);
  assert.equal(wrongDob.statusCode, 401);
  assert.deepEqual(unknown.payload, wrongDob.payload);
});

test("valid player credentials issue a player session", async () => {
  mock.method(Player, "findOne", () => ({
    _id: "player-id",
    dob: new Date("2000-01-01T00:00:00.000Z"),
    fullName: "Player",
    event: "Epee",
    requestStatus: "Accepted",
    rejectionReason: "",
  }));
  const response = createResponse();
  await loginPlayer({ body: { aadharCard: "111122223333", dob: "2000-01-01" } }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.user.role, "player");
  assert.equal(response.cookieValue.name, "token");
});

test("player and admin login endpoints enforce attempt limits", async () => {
  await withServer((app) => {
    app.use("/player", playerRouter);
    app.use("/admin", adminRouter);
  }, async (baseUrl) => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const playerResponse = await fetch(`${baseUrl}/player/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadharCard: null, dob: null }),
      });
      assert.equal(playerResponse.status, 400);
      const adminResponse = await fetch(`${baseUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "invalid", password: "invalid" }),
      });
      assert.equal(adminResponse.status, 401);
    }
    assert.equal((await fetch(`${baseUrl}/player/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadharCard: null, dob: null }),
    })).status, 429);
    assert.equal((await fetch(`${baseUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "invalid", password: "invalid" }),
    })).status, 429);
  });
});

const validRegistrationBody = () => ({
  fullName: "Registration Test",
  gender: "Male",
  dob: "2000-01-01",
  aadharCard: "123456789012",
  event: "Epee",
  email: "player@example.test",
  phone: "9999999999",
  addressLine1: "Address",
  addressLine2: "",
  pincode: "400001",
  institute: "Institute",
  hasFaiRegistration: "false",
  hasMfaRegistration: "false",
});

const tempUploads = async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "asfc-security-"));
  const photo = path.join(directory, "photo.jpg");
  const aadhaar = path.join(directory, "aadhaar.jpg");
  await Promise.all([fs.writeFile(photo, "photo"), fs.writeFile(aadhaar, "aadhaar")]);
  return {
    directory,
    paths: [photo, aadhaar],
    files: { photo: [{ path: photo }], aadharCardPhoto: [{ path: aadhaar }] },
  };
};

const assertUploadsRemoved = async ({ directory, paths }) => {
  for (const filePath of paths) {
    await assert.rejects(fs.access(filePath), { code: "ENOENT" });
  }
  await fs.rm(directory, { recursive: true, force: true });
};

test("malformed and duplicate registration clean temporary uploads", async () => {
  const malformed = await tempUploads();
  await addPlayer({ body: {}, files: malformed.files }, createResponse());
  await assertUploadsRemoved(malformed);

  const malformedAadhaar = await tempUploads();
  let lookupCount = 0;
  mock.method(Player, "findOne", async () => { lookupCount += 1; return null; });
  const malformedBody = validRegistrationBody();
  malformedBody.aadharCard = "1234";
  const malformedResponse = createResponse();
  await addPlayer({ body: malformedBody, files: malformedAadhaar.files }, malformedResponse);
  assert.equal(malformedResponse.statusCode, 400);
  assert.equal(lookupCount, 0);
  await assertUploadsRemoved(malformedAadhaar);
  mock.restoreAll();

  const duplicate = await tempUploads();
  mock.method(Player, "findOne", async () => ({ _id: "existing" }));
  const response = createResponse();
  await addPlayer({ body: validRegistrationBody(), files: duplicate.files }, response);
  assert.equal(response.statusCode, 409);
  await assertUploadsRemoved(duplicate);
});

test("Cloudinary and database registration failures clean temporary uploads", async () => {
  mock.method(Player, "findOne", async () => null);
  const uploadFailure = await tempUploads();
  mock.method(registrationServices, "uploadPhoto", async () => ({ public_id: "photo-id", resource_type: "image" }));
  mock.method(registrationServices, "uploadAadhaar", async () => { throw new Error("upload failed"); });
  mock.method(registrationServices, "deleteAsset", async () => undefined);
  await addPlayer({ body: validRegistrationBody(), files: uploadFailure.files }, createResponse());
  await assertUploadsRemoved(uploadFailure);
  mock.restoreAll();

  mock.method(Player, "findOne", async () => null);
  mock.method(Player, "create", async () => { throw new Error("database failed"); });
  mock.method(registrationServices, "uploadPhoto", async () => ({ public_id: "photo-id", secure_url: "photo", resource_type: "image" }));
  mock.method(registrationServices, "uploadAadhaar", async () => ({ public_id: "aadhaar-id", resource_type: "image", format: "jpg" }));
  mock.method(registrationServices, "deleteAsset", async () => undefined);
  const databaseFailure = await tempUploads();
  await addPlayer({ body: validRegistrationBody(), files: databaseFailure.files }, createResponse());
  await assertUploadsRemoved(databaseFailure);
});

test("Multer rejection removes files already written for the registration request", async () => {
  const uploadDirectory = path.resolve("temp");
  const before = new Set(await fs.readdir(uploadDirectory));

  await withServer((app) => app.use("/player", playerRouter), async (baseUrl) => {
    const form = new FormData();
    form.append("photo", new Blob(["valid image placeholder"], { type: "image/jpeg" }), "photo.jpg");
    form.append("aadharCardPhoto", new Blob(["invalid document placeholder"], { type: "text/plain" }), "aadhaar.txt");
    const response = await fetch(`${baseUrl}/player/add`, {
      method: "POST",
      headers: { "X-Forwarded-For": "198.51.100.1" },
      body: form,
    });
    assert.equal(response.status, 400);
  });

  const after = new Set(await fs.readdir(uploadDirectory));
  assert.deepEqual(after, before);
});

test("registration endpoint enforces its stricter attempt limit", async () => {
  await withServer((app) => app.use("/player", playerRouter), async (baseUrl) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(`${baseUrl}/player/add`, {
        method: "POST",
        headers: { "X-Forwarded-For": "198.51.100.2" },
      });
      assert.equal(response.status, 400);
    }
    assert.equal((await fetch(`${baseUrl}/player/add`, {
      method: "POST",
      headers: { "X-Forwarded-For": "198.51.100.2" },
    })).status, 429);
  });
});

test("ordinary profile DTO omits Aadhaar storage locations", async () => {
  mock.method(Player, "findById", () => queryResult({
    _id: "player-id",
    fullName: "Player",
    aadharCardURL: "https://legacy.example.test/document.jpg",
    aadharCardPublicId: "protected-id",
    aadharCardResourceType: "image",
    aadharCardFormat: "jpg",
  }));
  const response = createResponse();
  await getPlayerProfile({ user: { id: "player-id" } }, response);
  assert.equal(response.payload.player.hasAadhaarDocument, true);
  assert.equal("aadharCardURL" in response.payload.player, false);
  assert.equal("aadharCardPublicId" in response.payload.player, false);
  assert.equal(JSON.stringify(response.payload).includes("legacy.example.test"), false);
});

test("protected Aadhaar access enforces ownership and returns expiring access", async () => {
  let queriedPlayerId;
  mock.method(Player, "findById", (playerId) => {
    queriedPlayerId = playerId;
    return queryResult({
      _id: playerId,
      aadharCardPublicId: "asfc/aadhaar/document-id",
      aadharCardResourceType: "image",
      aadharCardFormat: "jpg",
    });
  });
  await withServer((app) => {
    app.use("/player", playerRouter);
    app.use("/admin", adminRouter);
  }, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/player/profile/aadhaar-document`)).status, 401);
    assert.equal((await fetch(`${baseUrl}/admin/player/other-id/aadhaar-document`, {
      headers: { Cookie: `token=${tokenFor("own-player-id", "player")}` },
    })).status, 403);

    const ownResponse = await fetch(`${baseUrl}/player/profile/aadhaar-document?playerId=other-id`, {
      headers: { Cookie: `token=${tokenFor("own-player-id", "player")}` },
    });
    assert.equal(ownResponse.status, 200);
    assert.equal(ownResponse.headers.get("cache-control"), "no-store, private");
    assert.equal(queriedPlayerId, "own-player-id");
    const ownBody = await ownResponse.json();
    assert.match(ownBody.data.url, /expires_at/);
    assert.ok(new Date(ownBody.data.expiresAt).getTime() <= Date.now() + 5 * 60 * 1000 + 1000);

    const adminResponse = await fetch(`${baseUrl}/admin/player/other-player-id/aadhaar-document`, {
      headers: { Cookie: `token=${tokenFor("admin", "admin")}` },
    });
    assert.equal(adminResponse.status, 200);
    assert.equal(queriedPlayerId, "other-player-id");
  });
});

test("legacy public Aadhaar URLs are never returned by protected access", async () => {
  mock.method(Player, "findById", () => queryResult({
    _id: "player-id",
    aadharCardURL: "https://legacy.example.test/document.jpg",
    aadharCardPublicId: "",
  }));
  await withServer((app) => app.use("/player", playerRouter), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/player/profile/aadhaar-document`, {
      headers: { Cookie: `token=${tokenFor("player-id", "player")}` },
    });
    assert.equal(response.status, 409);
    assert.equal(JSON.stringify(await response.json()).includes("legacy.example.test"), false);
  });
});
