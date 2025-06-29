/**
 * Cache utility for storing data with daily expiration
 */

class DailyCache {
  constructor() {
    this.cache = new Map();
    this.prefix = 'stepbrothers_cache_';
  }

  /**
   * Generate a cache key with prefix
   * @param {string} key - The cache key
   * @returns {string} - The full cache key
   */
  getCacheKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get today's date as a string for cache invalidation
   * @returns {string} - Today's date in YYYY-MM-DD format
   */
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Set a value in cache with daily expiration
   * @param {string} key - The cache key
   * @param {any} value - The value to cache
   * @param {number} ttl - Time to live in milliseconds (optional, defaults to 24 hours)
   */
  set(key, value, ttl = 24 * 60 * 60 * 1000) {
    const cacheKey = this.getCacheKey(key);
    const cacheData = {
      value,
      timestamp: Date.now(),
      ttl,
      date: this.getTodayString()
    };

    // Store in memory
    this.cache.set(cacheKey, cacheData);

    // Store in localStorage for persistence
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // Silently fail in production
    }
  }

  /**
   * Get a value from cache
   * @param {string} key - The cache key
   * @returns {any|null} - The cached value or null if not found/expired
   */
  get(key) {
    const cacheKey = this.getCacheKey(key);
    
    // Try memory cache first
    let cacheData = this.cache.get(cacheKey);
    
    // If not in memory, try localStorage
    if (!cacheData) {
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          cacheData = JSON.parse(stored);
          // Restore to memory cache
          this.cache.set(cacheKey, cacheData);
        }
      } catch {
        // Silently fail in production
      }
    }

    if (!cacheData) {
      return null;
    }

    // Check if cache is expired
    const now = Date.now();
    const isExpired = (now - cacheData.timestamp) > cacheData.ttl;
    const isNewDay = cacheData.date !== this.getTodayString();

    if (isExpired || isNewDay) {
      this.delete(key);
      return null;
    }

    return cacheData.value;
  }

  /**
   * Delete a value from cache
   * @param {string} key - The cache key
   */
  delete(key) {
    const cacheKey = this.getCacheKey(key);
    
    // Remove from memory
    this.cache.delete(cacheKey);
    
    // Remove from localStorage
    try {
      localStorage.removeItem(cacheKey);
    } catch {
      // Silently fail in production
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    // Clear memory cache
    this.cache.clear();
    
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Silently fail in production
    }
  }

  /**
   * Get cache statistics
   * @returns {object} - Cache statistics
   */
  getStats() {
    const memorySize = this.cache.size;
    let localStorageSize = 0;
    
    try {
      const keys = Object.keys(localStorage);
      localStorageSize = keys.filter(key => key.startsWith(this.prefix)).length;
    } catch {
      // Silently fail in production
    }

    return {
      memorySize,
      localStorageSize,
      totalSize: memorySize + localStorageSize
    };
  }

  /**
   * Check if cache has a key (without retrieving the value)
   * @param {string} key - The cache key
   * @returns {boolean} - True if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get cache keys for analysis
   * @returns {string[]} - Array of cache keys
   */
  getKeys() {
    const keys = [];
    
    // Memory cache keys
    this.cache.forEach((value, key) => {
      keys.push(key.replace(this.prefix, ''));
    });
    
    // localStorage cache keys
    try {
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      });
    } catch {
      // Silently fail in production
    }

    return [...new Set(keys)]; // Remove duplicates
  }
}

// Create singleton instance
const dailyCache = new DailyCache();

export default dailyCache; 