/**
 * Rate limiting middleware to prevent API abuse
 * @module middleware/rateLimiter
 */

const rateLimitStore = new Map();

/**
 * Simple in-memory rate limiter
 * @param {Object} options - Rate limiter configuration
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum requests per window
 * @returns {Function} Express middleware
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60000; // 1 minute default
  const maxRequests = options.maxRequests || 100;

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(clientId)) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const clientData = rateLimitStore.get(clientId);

    if (now > clientData.resetTime) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    clientData.count++;
    next();
  };
};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [clientId, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(clientId);
    }
  }
}, 600000);

module.exports = rateLimiter;
