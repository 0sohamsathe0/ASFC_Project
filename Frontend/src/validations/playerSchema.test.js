import assert from "node:assert/strict";
import test from "node:test";

import { playerSchema } from "./playerSchema.js";

const validPlayer = {
  fullName: "Test Player",
  gender: "Male",
  dob: "2005-01-01",
  event: "Epee",
  email: "test@example.com",
  phone: "9876543210",
  aadharCard: "123456789012",
  institute: "Test Institute",
  addressLine1: "Test address",
  addressLine2: "",
  pincode: "413001",
};

const combinations = [
  [true, "FAI-1", true, "MFA-1"],
  [false, "", true, "MFA-1"],
  [true, "FAI-1", false, ""],
  [false, "", false, ""],
];

combinations.forEach(([hasFaiRegistration, faiId, hasMfaRegistration, mfaId]) => {
  test(`accepts FAI=${hasFaiRegistration} and MFA=${hasMfaRegistration}`, () => {
    const result = playerSchema.safeParse({
      ...validPlayer,
      hasFaiRegistration,
      hasMfaRegistration,
      faiId,
      mfaId,
    });

    assert.equal(result.success, true);
  });
});

test("rejects an empty FAI ID when FAI registration is true", () => {
  const result = playerSchema.safeParse({
    ...validPlayer,
    hasFaiRegistration: true,
    hasMfaRegistration: false,
    faiId: "   ",
    mfaId: "",
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].path[0], "faiId");
});

test("rejects an empty MFA ID when MFA registration is true", () => {
  const result = playerSchema.safeParse({
    ...validPlayer,
    hasFaiRegistration: false,
    hasMfaRegistration: true,
    faiId: "",
    mfaId: "   ",
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].path[0], "mfaId");
});
