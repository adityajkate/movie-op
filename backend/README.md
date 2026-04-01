# Movie Rating App - Backend

Production-grade Node.js REST API for TMDB movie data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your TMDB API key to `.env`:
```
TMDB_API_KEY=your_actual_api_key_here
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Movies
- `GET /api/movies/popular?page=1` - Get popular movies
- `GET /api/movies/top-rated?page=1` - Get top rated movies
- `GET /api/movies/now-playing?page=1` - Get now playing movies
- `GET /api/movies/search?q=query&page=1` - Search movies
- `GET /api/movies/:id` - Get movie details by ID
- `GET /api/movies/:id/credits` - Get movie credits (cast/crew)

## Features

- TMDB API proxy with secure key management
- In-memory response caching (5 min TTL)
- Rate limiting (100 req/min per IP)
- CORS configuration
- Comprehensive error handling
- Request logging
- Input validation and sanitization
- Consistent JSON response format

## Response Format

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `TMDB_API_KEY` - Your TMDB API key (required)
- `TMDB_BASE_URL` - TMDB API base URL
- `CACHE_TTL` - Cache TTL in milliseconds (default: 300000)
- `CORS_ORIGIN` - Allowed CORS origin (default: *)
