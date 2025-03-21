import rateLimit from 'express-rate-limit';

interface RateLimitConfig {
  windowMs: number; // The time window in milliseconds
  max: number;     // Max number of requests within the time window
}

export const rateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      success: false,
      error: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  });
}; 