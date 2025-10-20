import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Specific hooks for each entity
export function useVehicles() {
  return useApi(() => apiClient.getVehicles());
}

export function useVehicle(id: number) {
  return useApi(() => apiClient.getVehicleById(id), [id]);
}

export function useVehicleStats() {
  return useApi(() => apiClient.getVehicleStats());
}

export function useUsers() {
  return useApi(() => apiClient.getUsers());
}

export function useUser(id: number) {
  return useApi(() => apiClient.getUserById(id), [id]);
}

export function useUserStats() {
  return useApi(() => apiClient.getUserStats());
}

export function useActiveAdvisors() {
  return useApi(() => apiClient.getActiveAdvisors());
}

export function useQuotes() {
  return useApi(() => apiClient.getQuotes());
}

export function useQuote(id: number) {
  return useApi(() => apiClient.getQuoteById(id), [id]);
}

export function useQuoteStats() {
  return useApi(() => apiClient.getQuoteStats());
}

export function useUnassignedQuotes() {
  return useApi(() => apiClient.getUnassignedQuotes());
}

export function useNotifications() {
  return useApi(() => apiClient.getNotifications());
}

export function useUnreadNotifications() {
  return useApi(() => apiClient.getUnreadNotifications());
}

export function useUnreadNotificationCount() {
  return useApi(() => apiClient.getUnreadNotificationCount());
}

export function useNotificationStats() {
  return useApi(() => apiClient.getNotificationStats());
}

// Hook for mutations (create, update, delete)
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}