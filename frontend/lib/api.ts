// API Configuration for Hino Connect Frontend
import { Vehicle, VehicleStats } from '@/types/vehicle';
import { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Error del backend:", errorData); // Debug log
      console.error("Error completo:", errorData); // Debug log adicional
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE operations)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Return empty object for non-JSON responses (like DELETE)
        return {} as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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
    return this.request<Vehicle>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle),
    });
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

  // Notification API methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async getNotificationById(id: number) {
    return this.request(`/notifications/${id}`);
  }

  async createNotification(notification: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
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
    const response: any = await this.request('/notifications/unread/count');
    return response.count || 0;
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

  // Legacy file upload method (mantener para usuarios)
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.url || result.path || result.filename;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;