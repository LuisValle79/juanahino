import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

// ===== Manejo de errores =====
const handleApiError = (error: any) => {
  if (error.message?.includes('ByteBuddyInterceptor')) {
    return 'Error temporal del servidor. Reintentando...';
  }
  if (error.message?.includes('Invalid cloud_name')) {
    return 'Error de configuración de imágenes. Contacte al administrador.';
  }
  if (error.message?.includes('could not execute statement')) {
    return 'Error de base de datos. Verifique los datos ingresados.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error desconocido';
};

// ===== Hook genérico =====
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (attempt: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      setRetryCount(0);
    } catch (err: any) {
      const errorMessage = handleApiError(err);

      if (err.message?.includes('500') && attempt < 3) {
        console.warn(`Retry attempt ${attempt + 1}/3`);
        setTimeout(() => {
          setRetryCount(attempt + 1);
          fetchData(attempt + 1);
        }, 1000 * (attempt + 1));
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [...dependencies, retryCount]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch, retryCount };
}

// ===== Hooks específicos =====
export function useVehicles() {
  return useApi(() => apiClient.getVehicles());
}

export function useVehicle(id: number) {
  return useApi(() => apiClient.getVehicleById(id), [id]);
}

export function useVehicleStats() {
  return useApi<any>(() => apiClient.getVehicleStats());
}

export function useUsers() {
  return useApi(() => apiClient.getUsers());
}

export function useUser(id: number) {
  return useApi(() => apiClient.getUserById(id), [id]);
}

export function useUserStats() {
  return useApi<any>(() => apiClient.getUserStats());
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
  return useApi<any>(() => apiClient.getQuoteStats());
}

export function useUnassignedQuotes() {
  return useApi(() => apiClient.getUnassignedQuotes());
}

// ===== Hooks para notificaciones =====
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadNotifications = async (isRetry: boolean = false) => {
    try {
      if (!isRetry) setLoading(true);
      setError(null);
      const data = await apiClient.getNotifications();
      setNotifications(data || []);
      setRetryCount(0);
    } catch (err: any) {
      const errorMessage = handleApiError(err);

      if (err.message?.includes('ByteBuddyInterceptor') && retryCount < 3) {
        console.warn(`Retry notifications, attempt ${retryCount + 1}`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadNotifications(true);
        }, 2000 * (retryCount + 1));
        return;
      }

      setError(errorMessage);
      setNotifications([]);
    } finally {
      if (!isRetry) setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      if (!error || !error.includes('ByteBuddyInterceptor')) {
        loadNotifications(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [retryCount]);

  return { 
    data: notifications, 
    loading, 
    error, 
    refetch: () => loadNotifications(false),
    retryCount
  };
}

// ===== Hooks tipados para compilación segura =====
export function useUnreadNotifications() {
  return useApi<any[]>(() =>
    apiClient.getUnreadNotifications() as Promise<any[]>
  );
}

export function useUnreadNotificationCount() {
  return useApi<number>(() =>
    apiClient.getUnreadNotificationCount() as Promise<number>
  );
}

export function useNotificationStats() {
  return useApi(() => apiClient.getNotificationStats());
}

// ===== Hook para mutaciones =====
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
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
