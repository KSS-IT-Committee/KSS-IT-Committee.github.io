/**
 * useAsyncData Hook
 *
 * Reusable hook for managing async operations with loading and error states.
 */
import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '@/lib/constants';

interface UseAsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

interface UseAsyncDataReturn<T> extends UseAsyncDataState<T> {
  execute: (asyncFn: () => Promise<T>) => Promise<T | null>;
  setData: (data: T | null) => void;
  setError: (error: string) => void;
  reset: () => void;
}

/**
 * Custom hook for managing async data fetching with loading and error states
 * @template T - The type of data being fetched
 * @returns Object containing data, loading, error states and execute function
 */
export function useAsyncData<T>(): UseAsyncDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError('');
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError,
    reset,
  };
}
