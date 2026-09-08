import { rateLimit } from "express-rate-limit";

const jsonRateLimitHandler = (message) => (req, res) => res.status(429).json({
  success: false,
  message,
});

const playerLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: jsonRateLimitHandler("Too many login attempts. Please try again later."),
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: jsonRateLimitHandler("Too many login attempts. Please try again later."),
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: jsonRateLimitHandler("Too many registration attempts. Please try again later."),
});

export { adminLoginLimiter, playerLoginLimiter, registrationLimiter };
