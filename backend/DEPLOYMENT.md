# Production Deployment Guide

## Pre-deployment Checklist

1. Set environment variables in production:
   - `TMDB_API_KEY` - Your TMDB API key (REQUIRED)
   - `NODE_ENV=production`
   - `PORT` - Server port
   - `CORS_ORIGIN` - Specific frontend URL (not *)
   - `CACHE_TTL` - Cache duration in ms

2. Security considerations:
   - Never commit .env file
   - Use specific CORS_ORIGIN in production
   - Enable HTTPS/TLS
   - Consider using helmet.js for additional security headers
   - Implement API authentication if needed

3. Performance optimizations:
   - Rate limiting is configured (100 req/min)
   - Response caching enabled (5 min default)
   - Consider Redis for distributed caching
   - Monitor memory usage for cache cleanup

## Deployment Options

### Option 1: Traditional Server
```bash
npm install --production
NODE_ENV=production npm start
```

### Option 2: Process Manager (PM2)
```bash
npm install -g pm2
pm2 start server.js --name movie-api
pm2 save
pm2 startup
```

### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Option 4: Cloud Platforms
- Heroku: Add Procfile with `web: node server.js`
- Vercel/Netlify: Configure as serverless functions
- AWS/GCP/Azure: Use container services or App Service

## Monitoring

Monitor these metrics:
- Response times
- Cache hit/miss ratio
- Rate limit violations
- TMDB API quota usage
- Memory usage (cache size)

## Troubleshooting

Common issues:
- 500 error on startup: Check TMDB_API_KEY is set
- 429 errors: Rate limit exceeded, adjust limits
- Slow responses: Check cache configuration
- CORS errors: Verify CORS_ORIGIN setting
