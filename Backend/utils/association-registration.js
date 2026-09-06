const parseMultipartBoolean = (value, defaultValue = true) => {
  if (value === undefined) {
    return { valid: true, value: defaultValue };
  }

  if (value === true || value === "true") {
    return { valid: true, value: true };
  }

  if (value === false || value === "false") {
    return { valid: true, value: false };
  }

  return { valid: false, value: null };
};

const normalizeAssociationRegistration = (body = {}) => {
  const faiStatus = parseMultipartBoolean(body.hasFaiRegistration);
  const mfaStatus = parseMultipartBoolean(body.hasMfaRegistration);

  if (!faiStatus.valid || !mfaStatus.valid) {
    return {
      error: "Association registration statuses must be true or false.",
    };
  }

  const hasFaiRegistration = faiStatus.value;
  const hasMfaRegistration = mfaStatus.value;
  const submittedFaiId = typeof body.faiId === "string" ? body.faiId.trim() : "";
  const submittedMfaId = typeof body.mfaId === "string" ? body.mfaId.trim() : "";
  const faiId = hasFaiRegistration ? submittedFaiId : "";
  const mfaId = hasMfaRegistration ? submittedMfaId : "";

  if (hasFaiRegistration && !faiId) {
    return { error: "FAI ID is required when FAI registration is confirmed." };
  }

  if (hasMfaRegistration && !mfaId) {
    return { error: "MFA ID is required when MFA registration is confirmed." };
  }

  return {
    value: {
      faiId,
      mfaId,
      hasFaiRegistration,
      hasMfaRegistration,
    },
  };
};

export { normalizeAssociationRegistration, parseMultipartBoolean };
