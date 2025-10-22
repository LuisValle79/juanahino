import { apiClient } from '@/lib/api'

export interface Notification {
  id: number
  titulo: string
  mensaje: string
  tipo: string
  prioridad: string
  leido: boolean
  createdAt: string
  vehiculo?: {
    id: number
    modelo: string
  }
  quote?: {
    id: number
    clienteNombre: string
  }
  user?: {
    id: number
    nombre: string
  }
}

class NotificationService {
  // Obtener todas las notificaciones con manejo de errores
  async getAll(): Promise<Notification[]> {
    try {
      return await apiClient.getNotifications() as Notification[]
    } catch (error: any) {
      console.warn('NotificationService: Error loading notifications:', error.message)
      return []
    }
  }

  // Obtener notificaciones no leídas
  async getUnread(): Promise<Notification[]> {
    try {
      return await apiClient.getUnreadNotifications() as Notification[]
    } catch (error: any) {
      console.warn('NotificationService: Error loading unread notifications:', error.message)
      return []
    }
  }

  // Obtener contador de no leídas
  async getUnreadCount(): Promise<number> {
    try {
      return await apiClient.getUnreadNotificationCount() as number
    } catch (error: any) {
      console.warn('NotificationService: Error loading unread count:', error.message)
      return 0
    }
  }

  // Marcar como leída
  async markAsRead(id: number): Promise<void> {
    try {
      await apiClient.markNotificationAsRead(id)
    } catch (error: any) {
      console.error('NotificationService: Error marking as read:', error.message)
      throw error
    }
  }

  // Marcar todas como leídas
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.markAllNotificationsAsRead()
    } catch (error: any) {
      console.error('NotificationService: Error marking all as read:', error.message)
      throw error
    }
  }

  // Eliminar notificación
  async delete(id: number): Promise<void> {
    try {
      await apiClient.deleteNotification(id)
    } catch (error: any) {
      console.error('NotificationService: Error deleting notification:', error.message)
      throw error
    }
  }

  // Crear notificación
  async create(notification: Partial<Notification>): Promise<Notification> {
    try {
      return await apiClient.createNotification(notification) as Notification
    } catch (error: any) {
      console.error('NotificationService: Error creating notification:', error.message)
      throw error
    }
  }

  // Utilidades para UI
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      alert: '⚠️',
      maintenance: '🔧',
      fuel: '⛽',
      system: '⚙️',
      quote: '💰',
      user: '👤',
      vehicle: '🚛',
      sale: '💼'
    }
    return icons[type] || '📢'
  }

  getTypeText(type: string): string {
    const texts: Record<string, string> = {
      alert: 'Alerta',
      maintenance: 'Mantenimiento',
      fuel: 'Combustible',
      system: 'Sistema',
      quote: 'Cotización',
      user: 'Usuario',
      vehicle: 'Vehículo',
      sale: 'Venta'
    }
    return texts[type] || 'General'
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      alert: 'bg-red-100 text-red-800',
      maintenance: 'bg-orange-100 text-orange-800',
      fuel: 'bg-blue-100 text-blue-800',
      system: 'bg-gray-100 text-gray-800',
      quote: 'bg-green-100 text-green-800',
      user: 'bg-purple-100 text-purple-800',
      vehicle: 'bg-indigo-100 text-indigo-800',
      sale: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  getPriorityText(priority: string): string {
    const texts: Record<string, string> = {
      alta: 'Alta',
      media: 'Media',
      baja: 'Baja'
    }
    return texts[priority] || 'Media'
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      alta: 'bg-red-500 text-white',
      media: 'bg-yellow-500 text-white',
      baja: 'bg-green-500 text-white'
    }
    return colors[priority] || 'bg-gray-500 text-white'
  }

  getTimeAgo(dateString: string): string {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) {
        return 'Hace unos segundos'
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      } else {
        const days = Math.floor(diffInSeconds / 86400)
        return `Hace ${days} día${days > 1 ? 's' : ''}`
      }
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  validateNotification(notification: Partial<Notification>): string[] {
    const errors: string[] = []

    if (!notification.titulo || notification.titulo.trim().length === 0) {
      errors.push('El título es requerido')
    }

    if (!notification.mensaje || notification.mensaje.trim().length === 0) {
      errors.push('El mensaje es requerido')
    }

    const validTypes = ['alert', 'maintenance', 'fuel', 'system', 'quote', 'user', 'vehicle', 'sale']
    if (!notification.tipo || !validTypes.includes(notification.tipo)) {
      errors.push('El tipo de notificación no es válido')
    }

    const validPriorities = ['alta', 'media', 'baja']
    if (!notification.prioridad || !validPriorities.includes(notification.prioridad)) {
      errors.push('La prioridad no es válida')
    }

    return errors
  }
}

export default new NotificationService()
