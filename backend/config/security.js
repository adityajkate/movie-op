/**
 * Security middleware configuration
 * @module config/security
 */

/**
 * Security headers middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );

  next();
};

/**
 * API key validation middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const validateApiKey = (req, res, next) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      message: 'TMDB API key is not configured'
    });
  }
  next();
};

module.exports = {
  securityHeaders,
  validateApiKey
};
