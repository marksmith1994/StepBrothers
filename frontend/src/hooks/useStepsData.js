import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useStepsData = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (options.totals) {
          result = await apiService.getTotals();
        } else if (options.gamification) {
          result = await apiService.getGamificationData();
        } else if (options.person) {
          result = await apiService.getParticipantData(options.person, options.fromDate);
        } else if (options.person === null) {
          setLoading(false);
          return;
        } else {
          result = await apiService.getStepData(options.tab || 'dashboard', options.year);
        }
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [options.tab, options.totals, options.gamification, options.person, options.fromDate, options.year]);

  const refreshData = () => {
    setData(null);
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        let result;
        if (options.totals) {
          result = await apiService.getTotals();
        } else if (options.gamification) {
          result = await apiService.getGamificationData();
        } else if (options.person) {
          result = await apiService.getParticipantData(options.person, options.fromDate);
        } else if (options.person === null) {
          setLoading(false);
          return;
        } else {
          result = await apiService.getStepData(options.tab || 'dashboard', options.year);
        }
        setData(result);
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