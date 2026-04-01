/**
 * Input validation and sanitization utilities
 * @module utils/validator
 */

/**
 * Sanitize string input to prevent injection attacks
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

/**
 * Validate and sanitize page number
 * @param {*} page - Page number input
 * @returns {number} Valid page number (1-500)
 */
const validatePage = (page) => {
  const pageNum = parseInt(page);

  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }

  return Math.min(pageNum, 500); // TMDB max page limit
};

/**
 * Validate movie ID
 * @param {*} id - Movie ID input
 * @returns {boolean} True if valid
 */
const validateMovieId = (id) => {
  const movieId = parseInt(id);
  return !isNaN(movieId) && movieId > 0;
};

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {boolean} True if valid
 */
const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return false;
  }

  const trimmed = query.trim();
  return trimmed.length > 0 && trimmed.length <= 500;
};

module.exports = {
  sanitizeString,
  validatePage,
  validateMovieId,
  validateSearchQuery
};
