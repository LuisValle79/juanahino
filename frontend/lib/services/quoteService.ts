import { apiClient } from '@/lib/api'

export interface Quote {
  id: number
  clienteNombre: string
  clienteEmail: string
  clienteTelefono: string
  tipoVehiculo: string
  mensaje: string
  prioridad: 'alta' | 'media' | 'baja'
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada'
  asesorId?: number
  asesor?: {
    id: number
    nombre: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface QuoteStats {
  total: number
  pendiente: number
  en_proceso: number
  completada: number
  cancelada: number
  byPriority?: Record<string, number>
  byStatus?: Record<string, number>
  byVehicleType?: Record<string, number>
}

export class QuoteService {
  // Obtener todas las cotizaciones
  static async getAll(): Promise<Quote[]> {
    return apiClient.getQuotes()
  }

  // Obtener cotización por ID
  static async getById(id: number): Promise<Quote> {
    return apiClient.getQuoteById(id)
  }

  // Crear nueva cotización
  static async create(quote: Partial<Quote>): Promise<Quote> {
    return apiClient.createQuote(quote)
  }

  // Actualizar cotización
  static async update(id: number, quote: Partial<Quote>): Promise<Quote> {
    return apiClient.updateQuote(id, quote)
  }

  // Eliminar cotización
  static async delete(id: number): Promise<void> {
    return apiClient.deleteQuote(id)
  }

  // Asignar asesor a cotización
  static async assignAdvisor(quoteId: number, advisorId: number): Promise<Quote> {
    return apiClient.assignAdvisor(quoteId, advisorId)
  }

  // Obtener estadísticas
  static async getStats(): Promise<QuoteStats> {
    return apiClient.getQuoteStats()
  }

  // Filtros específicos
  static async getByStatus(estado: string): Promise<Quote[]> {
    return apiClient.getQuotesByStatus(estado)
  }

  static async getByPriority(prioridad: string): Promise<Quote[]> {
    return apiClient.getQuotesByPriority(prioridad)
  }

  static async getByAdvisor(advisorId: number): Promise<Quote[]> {
    return apiClient.getQuotesByAdvisor(advisorId)
  }

  static async getUnassigned(): Promise<Quote[]> {
    return apiClient.getUnassignedQuotes()
  }

  static async getByVehicleType(tipo: string): Promise<Quote[]> {
    return apiClient.getQuotesByVehicleType(tipo)
  }

  static async search(query: string): Promise<Quote[]> {
    return apiClient.searchQuotes(query)
  }

  // Utilidades
  static getStatusText(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_proceso':
        return 'En Proceso'
      case 'completada':
        return 'Completada'
      case 'cancelada':
        return 'Cancelada'
      default:
        return status
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800'
      case 'completada':
        return 'bg-green-100 text-green-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  static getPriorityText(priority: string): string {
    switch (priority) {
      case 'alta':
        return 'Alta'
      case 'media':
        return 'Media'
      case 'baja':
        return 'Baja'
      default:
        return priority
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'baja':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  static getVehicleTypeText(type: string): string {
    switch (type) {
      case 'camion':
        return 'Camión'
      case 'bus':
        return 'Bus'
      default:
        return type
    }
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  static getTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return 'Hace menos de 1 hora'
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    } else {
      return this.formatDate(dateString)
    }
  }
}

export default QuoteService