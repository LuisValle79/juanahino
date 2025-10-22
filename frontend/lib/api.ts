// API Configuration for Hino Connect Frontend
import { Vehicle, VehicleStats } from '@/types/vehicle';
import { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Error handler utility
const handleApiError = (error: any) => {
  console.error('API Error:', error);

  // Error específico de Hibernate/JPA
  if (error.message?.includes('ByteBuddyInterceptor')) {
    return 'Error temporal del servidor. Reintentando...';
  }

  // Error de Cloudinary
  if (error.message?.includes('Invalid cloud_name')) {
    return 'Error de configuración de imágenes. Contacte al administrador.';
  }

  // Error de base de datos
  if (error.message?.includes('could not execute statement')) {
    return 'Error de base de datos. Verifique los datos ingresados.';
  }

  return error.message || 'Error inesperado';
};

// API Client class with retry functionality
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          // Try to get error details from response
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            console.error("Error del backend:", errorData);
            console.error("Error completo:", errorData);

            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else {
              errorMessage = JSON.stringify(errorData);
            }
          } catch (e) {
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }

          // Retry automático para errores 500
          if (response.status === 500 && i < retries - 1) {
            console.warn(`Retry ${i + 1}/${retries} for ${endpoint}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }

          throw new Error(errorMessage);
        }

        // Handle empty responses (like DELETE operations)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return {} as T;
        }
      } catch (error) {
        if (i === retries - 1) {
          console.error('API request failed:', error);
          throw new Error(handleApiError(error));
        }
      }
    }

    throw new Error('Request failed after all retries');
  }

  // Vehicle API methods
  async getVehicles(): Promise<Vehicle[]> {
    return this.request<Vehicle[]>('/vehicles');
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return this.request<Vehicle>(`/vehicles/${id}`);
  }

  async createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return this.request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  }

  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    try {
      // Primero verificar que el vehículo existe
      await this.getVehicleById(id);

      // Luego intentar actualizar
      return await this.request<Vehicle>(`/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(vehicle),
      });
    } catch (error: any) {
      if (error.message.includes('404')) {
        throw new Error('Vehículo no encontrado. Puede haber sido eliminado.');
      }
      throw error;
    }
  }

  async deleteVehicle(id: number): Promise<void> {
    return this.request<void>(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  async getVehicleStats(): Promise<VehicleStats> {
    return this.request<VehicleStats>('/vehicles/stats');
  }

  // User API methods
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async getActiveAdvisors(): Promise<User[]> {
    return this.request<User[]>('/users/advisors/active');
  }

  // Alternative advisor endpoints
  async getAdvisors() {
    return this.request('/advisors');
  }

  async getActiveAdvisorsAlt(): Promise<User[]> {
    return this.request<User[]>('/advisors/active');
  }

  // Quote API methods
  async getQuotes() {
    return this.request('/quotes');
  }

  async getQuoteById(id: number) {
    return this.request(`/quotes/${id}`);
  }

  async createQuote(quote: any) {
    return this.request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quote),
    });
  }

  async updateQuote(id: number, quote: any) {
    return this.request(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quote),
    });
  }

  async deleteQuote(id: number) {
    return this.request(`/quotes/${id}`, {
      method: 'DELETE',
    });
  }

  async assignAdvisor(quoteId: number, advisorId: number) {
    return this.request(`/quotes/${quoteId}/assign/${advisorId}`, {
      method: 'PUT',
    });
  }

  async getQuoteStats() {
    return this.request('/quotes/stats');
  }

  async getUnassignedQuotes() {
    return this.request('/quotes/unassigned');
  }

  async getQuotesByStatus(status: string) {
    return this.request(`/quotes/status/${status}`);
  }

  async getQuotesByPriority(priority: string) {
    return this.request(`/quotes/priority/${priority}`);
  }

  async getQuotesByAdvisor(advisorId: number) {
    return this.request(`/quotes/advisor/${advisorId}`);
  }

  async searchQuotes(query: string) {
    return this.request(`/quotes/search?q=${encodeURIComponent(query)}`);
  }

  async getQuotesByVehicleType(tipo: string) {
    return this.request(`/quotes/vehicle-type?tipo=${encodeURIComponent(tipo)}`);
  }

  // Notification API methods with fallback
  async getNotifications() {
    try {
      const result = await this.request('/notifications');
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.warn('Error loading notifications, using fallback:', error.message);
      // Si es error de Hibernate, esperar un poco antes del siguiente intento
      if (error.message?.includes('ByteBuddyInterceptor')) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return []; // Retornar array vacío como fallback
    }
  }

  async getNotificationById(id: number) {
    return this.request(`/notifications/${id}`);
  }

  async createNotification(notification: any) {
    // Sanitizar datos de notificación
    const prioridadLower = notification.prioridad?.toLowerCase();
    const tipoLower = notification.tipo?.toLowerCase();

    const sanitizedData = {
      ...notification,
      // Validar que sean valores permitidos
      prioridad: ['alta', 'media', 'baja'].includes(prioridadLower)
        ? prioridadLower
        : 'media',
      tipo: ['alert', 'maintenance', 'fuel', 'system', 'quote', 'user', 'vehicle', 'sale'].includes(tipoLower)
        ? tipoLower
        : 'system'
    };

    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async deleteNotification(id: number) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async markNotificationAsRead(id: number) {
    return this.request(`/notifications/${id}/mark-read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  async getUnreadNotifications() {
    return this.request('/notifications/unread');
  }

  async getUnreadNotificationCount() {
    try {
      const response: any = await this.request('/notifications/unread/count');
      return response.count || 0;
    } catch (error: any) {
      console.warn('Error loading unread notification count, using fallback:', error.message);
      return 0; // Fallback to 0
    }
  }

  async getNotificationStats() {
    return this.request('/notifications/stats');
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Vehicle image methods
  async uploadVehicleImage(vehicleId: number, file: File, esPrincipal: boolean = false): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('esPrincipal', esPrincipal.toString());

    const url = `${this.baseURL}/vehicles/${vehicleId}/images`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Vehicle image upload failed:', error);
      throw error;
    }
  }

  async getVehicleImages(vehicleId: number): Promise<any[]> {
    return this.request(`/vehicles/${vehicleId}/images`);
  }

  async deleteVehicleImage(imageId: number): Promise<any> {
    return this.request(`/vehicles/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  // Cloudinary Image Upload Methods with validation
  async uploadImageToCloudinary(file: File, type: 'vehicle' | 'avatar' | 'user' | 'document' | 'general' = 'general'): Promise<any> {
    // Validar configuración de Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName || cloudName === 'dqkdflqyp') {
      throw new Error('Cloudinary no está configurado correctamente');
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/upload?type=${type}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary image upload failed:', error);
      throw error;
    }
  }

  async deleteImageFromCloudinary(imageUrl: string): Promise<any> {
    const url = `${this.baseURL}/upload?imageUrl=${encodeURIComponent(imageUrl)}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary image delete failed:', error);
      throw error;
    }
  }

  async getOptimizedImageUrls(imageUrl: string): Promise<any> {
    const url = `${this.baseURL}/upload/optimize?imageUrl=${encodeURIComponent(imageUrl)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get optimized URLs failed:', error);
      throw error;
    }
  }

  // User Avatar Methods with validation
  async uploadUserAvatar(userId: number, file: File): Promise<any> {
    // Validar configuración de Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName || cloudName === 'dqkdflqyp') {
      throw new Error('Error al subir avatar: Invalid cloud_name ' + cloudName);
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/users/${userId}/avatar`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(`Error al subir avatar: ${errorMessage}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('User avatar upload failed:', error);
      throw error;
    }
  }

  async deleteUserAvatar(userId: number): Promise<any> {
    const url = `${this.baseURL}/users/${userId}/avatar`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('User avatar delete failed:', error);
      throw error;
    }
  }

  async getUserAvatarInfo(userId: number): Promise<any> {
    const url = `${this.baseURL}/users/${userId}/avatar/info`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get user avatar info failed:', error);
      throw error;
    }
  }

  async getUserAvatarOptimizedUrls(userId: number): Promise<any> {
    const url = `${this.baseURL}/users/${userId}/avatar/optimize`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get user avatar optimized URLs failed:', error);
      throw error;
    }
  }

  // Legacy file upload method (mantener para compatibilidad)
  async uploadImage(file: File): Promise<string> {
    const result = await this.uploadImageToCloudinary(file, 'general');
    return result.url;
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;