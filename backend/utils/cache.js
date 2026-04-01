/**
 * Simple in-memory cache implementation
 * @module utils/cache
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.ttl = parseInt(process.env.CACHE_TTL) || 300000; // 5 minutes default
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} customTtl - Custom TTL in milliseconds
   */
  set(key, value, customTtl = null) {
    const expiry = Date.now() + (customTtl || this.ttl);
    this.store.set(key, { value, expiry });
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      size: this.store.size,
      ttl: this.ttl
    };
  }
}

// Cleanup expired entries every 5 minutes
const cache = new Cache();
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache.store.entries()) {
    if (now > item.expiry) {
      cache.store.delete(key);
    }
  }
}, 300000);

module.exports = cache;
