/**
 * TMDB API service layer
 * @module services/tmdbService
 */

const axios = require('axios');
const cache = require('../utils/cache');
const { ApiError } = require('../middleware/errorHandler');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Validate TMDB API key is configured
 */
const validateApiKey = () => {
  if (!TMDB_API_KEY) {
    throw new ApiError(500, 'TMDB API key is not configured');
  }
};

/**
 * Create axios instance with default config
 */
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: TMDB_API_KEY
  }
});

/**
 * Generic TMDB API request handler with caching
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
const tmdbRequest = async (endpoint, params = {}) => {
  validateApiKey();

  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await tmdbClient.get(endpoint, { params });
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data.status_message || 'TMDB API error'
      );
    }
    throw new ApiError(503, 'Failed to connect to TMDB service');
  }
};

/**
 * Get popular movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Popular movies data
 */
const getPopularMovies = async (page = 1) => {
  return tmdbRequest('/movie/popular', { page });
};

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Search results
 */
const searchMovies = async (query, page = 1) => {
  if (!query || query.trim().length === 0) {
    throw new ApiError(400, 'Search query is required');
  }
  return tmdbRequest('/search/movie', { query, page });
};

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie details
 */
const getMovieDetails = async (movieId) => {
  if (!movieId || isNaN(movieId)) {
    throw new ApiError(400, 'Valid movie ID is required');
  }
  return tmdbRequest(`/movie/${movieId}`);
};

/**
 * Get movie credits (cast and crew)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie credits
 */
const getMovieCredits = async (movieId) => {
  if (!movieId || isNaN(movieId)) {
    throw new ApiError(400, 'Valid movie ID is required');
  }
  return tmdbRequest(`/movie/${movieId}/credits`);
};

/**
 * Get top rated movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Top rated movies data
 */
const getTopRatedMovies = async (page = 1) => {
  return tmdbRequest('/movie/top_rated', { page });
};

/**
 * Get now playing movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Now playing movies data
 */
const getNowPlayingMovies = async (page = 1) => {
  return tmdbRequest('/movie/now_playing', { page });
};

module.exports = {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getTopRatedMovies,
  getNowPlayingMovies
};
