# Movie Op - Performance Optimized Full-Stack Application

A high-performance, minimalist movie browsing application with comprehensive performance optimizations applied.

## Performance Features

### Frontend Optimizations
- **Advanced Lazy Loading**: IntersectionObserver API with 50px rootMargin + native lazy loading fallback
- **Optimized Images**: TMDB images sized appropriately (w342 for cards, w1280 for modals)
- **Resource Hints**: DNS prefetch and preconnect for TMDB CDN
- **Critical CSS**: Inline critical CSS with async loading for non-critical styles
- **Minified Assets**: CSS reduced by 18%, JS reduced by 34%
- **Optimized DOM**: Batch updates, DocumentFragment usage, no layout thrashing
- **Deferred JavaScript**: Non-blocking script loading

### Backend Optimizations
- **HTTP Caching**: Cache-Control and ETag headers on all endpoints
- **Response Compression**: Gzip/Brotli compression (70-80% size reduction)
- **In-Memory Cache**: 5-minute TTL for TMDB API responses
- **Rate Limiting**: 100 requests per minute per IP
- **Request Timeout**: 10-second timeout for external API calls

## Quick Start

### Development Mode

**Backend:**
```bash
cd backend
npm install
# Create .env file with your TMDB_API_KEY
echo "TMDB_API_KEY=your_api_key_here" > .env
npm start
```

**Frontend:**
```bash
cd frontend
# Open index.html in browser or serve locally
python -m http.server 8000
```

### Production Mode

**Build Assets:**
```bash
cd frontend
npm install
npm run build
```

**Deploy:**
- Use `frontend/index.prod.html` as entry point
- Backend compression is pre-configured
- All cache headers are automatically applied

## Project Structure

```
movie-op/
├── backend/
│   ├── server.js                    # Express server with compression
│   ├── controllers/
│   │   └── movieController.js       # Cache headers configured
│   ├── services/
│   │   └── tmdbService.js          # TMDB API integration
│   ├── middleware/
│   │   ├── rateLimiter.js          # Rate limiting
│   │   ├── errorHandler.js         # Error handling
│   │   └── logger.js               # Request logging
│   ├── utils/
│   │   └── cache.js                # In-memory cache
│   └── package.json
│
├── frontend/
│   ├── index.html                   # Development version
│   ├── index.prod.html             # Production version (optimized)
│   ├── css/
│   │   ├── styles.css              # Source CSS
│   │   └── styles.min.css          # Minified CSS (7.5KB)
│   ├── js/
│   │   ├── app.js                  # Source JS with optimizations
│   │   └── app.min.js              # Minified JS (7.3KB)
│   └── package.json
│
├── PERFORMANCE_OPTIMIZATIONS.md     # Detailed optimization docs
├── QUICK_START.md                   # Quick reference guide
├── OPTIMIZATION_SUMMARY.txt         # Complete audit summary
└── verify-optimizations.sh          # Verification script
```

## Performance Metrics

### Expected Results (Production Build)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms

### File Sizes
- CSS: 9.2KB → 7.5KB (18% reduction)
- JS: 11KB → 7.3KB (34% reduction)
- With gzip: ~3-4KB total transfer size

## API Endpoints

All endpoints include Cache-Control and ETag headers:

- `GET /api/movies/popular` - Popular movies (5min cache)
- `GET /api/movies/search?query=` - Search movies (5min cache)
- `GET /api/movies/:id` - Movie details (1hour cache)
- `GET /api/movies/:id/credits` - Movie credits (1hour cache)
- `GET /api/movies/top-rated` - Top rated movies (10min cache)
- `GET /api/movies/now-playing` - Now playing movies (10min cache)

## Build Commands

```bash
# Build CSS only
npm run build:css

# Build JS only
npm run build:js

# Build everything
npm run build
```

## Testing Performance

### Using Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:8000/index.prod.html --view
```

### Using Chrome DevTools
1. Open DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Performance" category
4. Click "Analyze page load"

## Environment Variables

Create `backend/.env`:
```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
PORT=5000
CACHE_TTL=300000
NODE_ENV=production
CORS_ORIGIN=*
```

## Optimization Checklist

- [x] Lazy loading for images (IntersectionObserver + native)
- [x] Minified and bundled CSS/JS assets
- [x] Deferred non-critical JavaScript
- [x] Caching headers on backend responses
- [x] Optimized DOM manipulation
- [x] Removed unused CSS/JS
- [x] Optimized image sizes
- [x] Resource hints (dns-prefetch, preconnect)
- [x] Response compression (gzip/brotli)
- [x] Critical CSS inline
- [x] Content-visibility for rendering

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (IntersectionObserver available)
- IE11: Not supported (uses modern ES6+ features)


