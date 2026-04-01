/**
 * Request logging middleware
 * @module middleware/logger
 */

/**
 * Simple request logger
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
