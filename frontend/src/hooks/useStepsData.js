import { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants';

// Cache instance for storing data
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useStepsData = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (url, cacheKey) => {
    try {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (e) {
      setError(e.message);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url;
        let cacheKey;

        if (options.totals) {
          // Fetch totals data
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_TOTALS}`;
          cacheKey = 'totals';
        } else if (options.gamification) {
          // Fetch gamification data
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_GAMIFICATION}`;
          cacheKey = 'gamification';
        } else if (options.person) {
          // Fetch data for specific person using the participant endpoint
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_PARTICIPANT}/${encodeURIComponent(options.person)}`;
          cacheKey = `person-${options.person}`;
        } else {
          // Fetch regular step data with optional tab parameter
          const tabParam = options.tab ? `?tab=${encodeURIComponent(options.tab)}` : '?tab=dashboard';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_DATA}${tabParam}`;
          cacheKey = `steps-${options.tab || 'dashboard'}`;
        }

        const result = await fetchData(url, cacheKey);
        
        if (result) {
          setData(result);
        } else {
          setError('Failed to fetch data');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [options.tab, options.totals, options.gamification, options.person]);

  const refreshData = () => {
    cache.clear();
    setData(null);
    setLoading(true);
    setError(null);
    
    const loadData = async () => {
      try {
        let url;
        let cacheKey;

        if (options.totals) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_TOTALS}`;
          cacheKey = 'totals';
        } else if (options.gamification) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_GAMIFICATION}`;
          cacheKey = 'gamification';
        } else if (options.person) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_PARTICIPANT}/${encodeURIComponent(options.person)}`;
          cacheKey = `person-${options.person}`;
        } else {
          const tabParam = options.tab ? `?tab=${encodeURIComponent(options.tab)}` : '?tab=dashboard';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_DATA}${tabParam}`;
          cacheKey = `steps-${options.tab || 'dashboard'}`;
        }

        const result = await fetchData(url, cacheKey);
        
        if (result) {
          setData(result);
        } else {
          setError('Failed to fetch data');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  };

  return { data, loading, error, refreshData };
};

// Export cache stats and refresh function for CacheManager
export const useCacheStats = () => {
  const [stats, setStats] = useState({
    totalSize: 0,
    memorySize: 0,
    localStorageSize: 0,
    entries: []
  });

  const updateStats = () => {
    setStats({
      totalSize: cache.size,
      memorySize: cache.size,
      localStorageSize: 0, // We're only using memory cache for now
      entries: Array.from(cache.keys())
    });
  };

  const clearCache = () => {
    cache.clear();
    updateStats();
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return { stats, updateStats, clearCache };
};

export const useRefreshData = () => {
  return () => {
    cache.clear();
  };
}; 