import rateLimit from 'express-rate-limit'

/**
 * Middleware for rate limiting requests.
 * @type {import('express').RequestHandler}
 */
const rateLimitingMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

export default rateLimitingMiddleware
