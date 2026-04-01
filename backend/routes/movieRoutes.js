/**
 * Movie routes
 * @module routes/movieRoutes
 */

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /api/movies/popular - Get popular movies
router.get('/popular', movieController.getPopular);

// GET /api/movies/top-rated - Get top rated movies
router.get('/top-rated', movieController.getTopRated);

// GET /api/movies/now-playing - Get now playing movies
router.get('/now-playing', movieController.getNowPlaying);

// GET /api/movies/search - Search movies
router.get('/search', movieController.searchMovies);

// GET /api/movies/:id - Get movie details by ID
router.get('/:id', movieController.getMovieById);

// GET /api/movies/:id/credits - Get movie credits
router.get('/:id/credits', movieController.getMovieCredits);

module.exports = router;
