/**
 * Movie routes controller
 * @module controllers/movieController
 */

const tmdbService = require('../services/tmdbService');

/**
 * Get popular movies
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getPopular = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getPopularMovies(page);

    // Set cache headers for browser caching
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.setHeader('ETag', `W/"popular-${page}-${Date.now()}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search movies
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const searchMovies = async (req, res, next) => {
  try {
    const { q, query, page } = req.query;
    const searchQuery = q || query;
    const pageNum = parseInt(page) || 1;

    const data = await tmdbService.searchMovies(searchQuery, pageNum);

    // Set cache headers for search results
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.setHeader('ETag', `W/"search-${searchQuery}-${pageNum}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get movie details by ID
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getMovieById = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const data = await tmdbService.getMovieDetails(movieId);

    // Set cache headers for movie details (longer cache since details don't change often)
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    res.setHeader('ETag', `W/"movie-${movieId}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get movie credits
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getMovieCredits = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const data = await tmdbService.getMovieCredits(movieId);

    // Set cache headers for credits
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    res.setHeader('ETag', `W/"credits-${movieId}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top rated movies
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getTopRated = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getTopRatedMovies(page);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.setHeader('ETag', `W/"toprated-${page}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get now playing movies
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getNowPlaying = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getNowPlayingMovies(page);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.setHeader('ETag', `W/"nowplaying-${page}"`);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPopular,
  searchMovies,
  getMovieById,
  getMovieCredits,
  getTopRated,
  getNowPlaying
};
