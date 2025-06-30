import { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants';

export const useStepsData = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (url, retryAttempt = 0) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (e) {
      // Retry up to 2 times with exponential backoff
      if (retryAttempt < 2) {
        const delay = Math.pow(2, retryAttempt) * 1000; // 1s, 2s
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchData(url, retryAttempt + 1);
      }
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
        if (options.totals) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_TOTALS}`;
        } else if (options.gamification) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_GAMIFICATION}`;
        } else if (options.person) {
          const dateParam = options.fromDate ? `?fromDate=${options.fromDate.toISOString().split('T')[0]}` : '';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_PARTICIPANT}/${encodeURIComponent(options.person)}${dateParam}`;
        } else if (options.person === null) {
          setLoading(false);
          return;
        } else {
          const tabParam = options.tab ? `?tab=${encodeURIComponent(options.tab)}` : '?tab=dashboard';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_DATA}${tabParam}`;
        }
        const result = await fetchData(url);
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
  }, [options.tab, options.totals, options.gamification, options.person, options.fromDate]);

  const refreshData = () => {
    setData(null);
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        let url;
        if (options.totals) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_TOTALS}`;
        } else if (options.gamification) {
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_GAMIFICATION}`;
        } else if (options.person) {
          const dateParam = options.fromDate ? `?fromDate=${options.fromDate.toISOString().split('T')[0]}` : '';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_PARTICIPANT}/${encodeURIComponent(options.person)}${dateParam}`;
        } else if (options.person === null) {
          setLoading(false);
          return;
        } else {
          const tabParam = options.tab ? `?tab=${encodeURIComponent(options.tab)}` : '?tab=dashboard';
          url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHEETS_DATA}${tabParam}`;
        }
        const result = await fetchData(url);
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