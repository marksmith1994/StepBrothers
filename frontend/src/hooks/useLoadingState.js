import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingType, setLoadingType] = useState('initial'); // 'initial', 'refresh', 'background'

  const startLoading = useCallback((message = 'Loading...', type = 'initial') => {
    setLoading(true);
    setLoadingMessage(message);
    setLoadingType(type);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
    setLoadingMessage('');
    setLoadingType('initial');
  }, []);

  const setLoadingWithMessage = useCallback((isLoading, message = '', type = 'initial') => {
    setLoading(isLoading);
    setLoadingMessage(message);
    setLoadingType(type);
  }, []);

  return {
    loading,
    loadingMessage,
    loadingType,
    startLoading,
    stopLoading,
    setLoadingWithMessage
  };
};

// Hook for managing multiple loading states
export const useMultipleLoadingStates = (states = []) => {
  const [loadingStates, setLoadingStates] = useState(
    states.reduce((acc, state) => ({ ...acc, [state]: false }), {})
  );
  const [loadingMessages, setLoadingMessages] = useState(
    states.reduce((acc, state) => ({ ...acc, [state]: '' }), {})
  );

  const startLoading = useCallback((state, message = 'Loading...') => {
    setLoadingStates(prev => ({ ...prev, [state]: true }));
    setLoadingMessages(prev => ({ ...prev, [state]: message }));
  }, []);

  const stopLoading = useCallback((state) => {
    setLoadingStates(prev => ({ ...prev, [state]: false }));
    setLoadingMessages(prev => ({ ...prev, [state]: '' }));
  }, []);

  const isLoading = useCallback((state) => loadingStates[state] || false, [loadingStates]);
  const getMessage = useCallback((state) => loadingMessages[state] || '', [loadingMessages]);
  const isAnyLoading = useCallback(() => Object.values(loadingStates).some(Boolean), [loadingStates]);

  return {
    loadingStates,
    loadingMessages,
    startLoading,
    stopLoading,
    isLoading,
    getMessage,
    isAnyLoading
  };
};

// Hook for managing async operations with loading states
export const useAsyncLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    executeAsync,
    setError
  };
}; 