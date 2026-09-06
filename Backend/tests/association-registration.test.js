import assert from "node:assert/strict";
import test from "node:test";

import Player from "../models/player-model.js";
import { normalizeAssociationRegistration } from "../utils/association-registration.js";

const validPlayerData = {
  fullName: "Test Player",
  gender: "Male",
  dob: new Date("2005-01-01"),
  aadharCard: "123456789012",
  event: "Epee",
  email: "test@example.com",
  phone: "9876543210",
  address: { addressLine1: "Test address", pincode: "413001" },
  institute: "Test Institute",
  photoURL: "https://example.com/photo.jpg",
  aadharCardURL: "https://example.com/aadhaar.jpg",
};

const cases = [
  {
    name: "stores both IDs when both registrations are confirmed",
    input: {
      hasFaiRegistration: "true",
      hasMfaRegistration: "true",
      faiId: " FAI-123 ",
      mfaId: " MFA-456 ",
    },
    expected: {
      hasFaiRegistration: true,
      hasMfaRegistration: true,
      faiId: "FAI-123",
      mfaId: "MFA-456",
    },
  },
  {
    name: "allows MFA registration without FAI registration",
    input: {
      hasFaiRegistration: "false",
      hasMfaRegistration: "true",
      faiId: "ignored",
      mfaId: "MFA-456",
    },
    expected: {
      hasFaiRegistration: false,
      hasMfaRegistration: true,
      faiId: "",
      mfaId: "MFA-456",
    },
  },
  {
    name: "allows FAI registration without MFA registration",
    input: {
      hasFaiRegistration: "true",
      hasMfaRegistration: "false",
      faiId: "FAI-123",
      mfaId: "ignored",
    },
    expected: {
      hasFaiRegistration: true,
      hasMfaRegistration: false,
      faiId: "FAI-123",
      mfaId: "",
    },
  },
  {
    name: "allows neither association registration",
    input: {
      hasFaiRegistration: "false",
      hasMfaRegistration: "false",
      faiId: "ignored",
      mfaId: "ignored",
    },
    expected: {
      hasFaiRegistration: false,
      hasMfaRegistration: false,
      faiId: "",
      mfaId: "",
    },
  },
];

cases.forEach(({ name, input, expected }) => {
  test(name, () => {
    assert.deepEqual(normalizeAssociationRegistration(input), { value: expected });
  });
});

test("defaults omitted statuses to registered for older clients", () => {
  assert.deepEqual(
    normalizeAssociationRegistration({ faiId: "FAI-1", mfaId: "MFA-1" }),
    {
      value: {
        hasFaiRegistration: true,
        hasMfaRegistration: true,
        faiId: "FAI-1",
        mfaId: "MFA-1",
      },
    }
  );
});

test("rejects malformed multipart boolean values", () => {
  assert.deepEqual(
    normalizeAssociationRegistration({
      hasFaiRegistration: "yes",
      hasMfaRegistration: "false",
    }),
    { error: "Association registration statuses must be true or false." }
  );
});

test("requires a non-whitespace FAI ID when FAI registration is confirmed", () => {
  assert.deepEqual(
    normalizeAssociationRegistration({
      hasFaiRegistration: "true",
      hasMfaRegistration: "false",
      faiId: "   ",
    }),
    { error: "FAI ID is required when FAI registration is confirmed." }
  );
});

test("requires a non-whitespace MFA ID when MFA registration is confirmed", () => {
  assert.deepEqual(
    normalizeAssociationRegistration({
      hasFaiRegistration: "false",
      hasMfaRegistration: "true",
      mfaId: "   ",
    }),
    { error: "MFA ID is required when MFA registration is confirmed." }
  );
});

test("player model clears contradictory IDs when registration is false", async () => {
  const player = new Player({
    ...validPlayerData,
    hasFaiRegistration: false,
    hasMfaRegistration: false,
    faiId: "SHOULD-BE-CLEARED",
    mfaId: "SHOULD-BE-CLEARED",
  });

  await player.validate();

  assert.equal(player.faiId, "");
  assert.equal(player.mfaId, "");
});

test("player model requires IDs when registration is true", async () => {
  const player = new Player({
    ...validPlayerData,
    hasFaiRegistration: true,
    hasMfaRegistration: true,
    faiId: "",
    mfaId: "",
  });

  await assert.rejects(player.validate(), (error) => {
    assert.ok(error.errors.faiId);
    assert.ok(error.errors.mfaId);
    return true;
  });
});
