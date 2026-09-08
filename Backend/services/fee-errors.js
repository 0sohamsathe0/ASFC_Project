class FeeServiceError extends Error {
  constructor(message, { status = 422, code = "FEE_OPERATION_INVALID", details } = {}) {
    super(message);
    this.name = "FeeServiceError";
    this.status = status;
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

const isDuplicateKeyError = (error) => error?.code === 11000;

export { FeeServiceError, isDuplicateKeyError };
