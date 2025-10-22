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
    try {
      return await apiClient.getQuotes() as Quote[]
    } catch (error: any) {
      console.warn('QuoteService: Error loading quotes:', error.message)
      return []
    }
  }

  // Obtener cotización por ID
  static async getById(id: number): Promise<Quote | null> {
    try {
      return await apiClient.getQuoteById(id) as Quote
    } catch (error: any) {
      console.warn(`QuoteService: Error loading quote ${id}:`, error.message)
      return null
    }
  }

  // Crear nueva cotización
  static async create(quote: Partial<Quote>): Promise<Quote | null> {
    try {
      return await apiClient.createQuote(quote) as Quote
    } catch (error: any) {
      console.error('QuoteService: Error creating quote:', error.message)
      return null
    }
  }

  // Actualizar cotización
  static async update(id: number, quote: Partial<Quote>): Promise<Quote | null> {
    try {
      return await apiClient.updateQuote(id, quote) as Quote
    } catch (error: any) {
      console.error(`QuoteService: Error updating quote ${id}:`, error.message)
      return null
    }
  }

  // Eliminar cotización
  static async delete(id: number): Promise<void> {
    try {
      await apiClient.deleteQuote(id)
    } catch (error: any) {
      console.error(`QuoteService: Error deleting quote ${id}:`, error.message)
      throw error
    }
  }

  // Asignar asesor a cotización
  static async assignAdvisor(quoteId: number, advisorId: number): Promise<Quote | null> {
    try {
      return await apiClient.assignAdvisor(quoteId, advisorId) as Quote
    } catch (error: any) {
      console.error(`QuoteService: Error assigning advisor to quote ${quoteId}:`, error.message)
      return null
    }
  }

  // Obtener estadísticas
  static async getStats(): Promise<QuoteStats | null> {
    try {
      return await apiClient.getQuoteStats() as QuoteStats
    } catch (error: any) {
      console.error('QuoteService: Error loading quote stats:', error.message)
      return null
    }
  }

  // Filtros específicos
  static async getByStatus(estado: string): Promise<Quote[]> {
    try {
      return await apiClient.getQuotesByStatus(estado) as Quote[]
    } catch (error: any) {
      console.warn(`QuoteService: Error loading quotes by status ${estado}:`, error.message)
      return []
    }
  }

  static async getByPriority(prioridad: string): Promise<Quote[]> {
    try {
      return await apiClient.getQuotesByPriority(prioridad) as Quote[]
    } catch (error: any) {
      console.warn(`QuoteService: Error loading quotes by priority ${prioridad}:`, error.message)
      return []
    }
  }

  static async getByAdvisor(advisorId: number): Promise<Quote[]> {
    try {
      return await apiClient.getQuotesByAdvisor(advisorId) as Quote[]
    } catch (error: any) {
      console.warn(`QuoteService: Error loading quotes by advisor ${advisorId}:`, error.message)
      return []
    }
  }

  static async getUnassigned(): Promise<Quote[]> {
    try {
      return await apiClient.getUnassignedQuotes() as Quote[]
    } catch (error: any) {
      console.warn('QuoteService: Error loading unassigned quotes:', error.message)
      return []
    }
  }

  static async getByVehicleType(tipo: string): Promise<Quote[]> {
    try {
      return await apiClient.getQuotesByVehicleType(tipo) as Quote[]
    } catch (error: any) {
      console.warn(`QuoteService: Error loading quotes by vehicle type ${tipo}:`, error.message)
      return []
    }
  }

  static async search(query: string): Promise<Quote[]> {
    try {
      return await apiClient.searchQuotes(query) as Quote[]
    } catch (error: any) {
      console.warn(`QuoteService: Error searching quotes with query "${query}":`, error.message)
      return []
    }
  }

  // Utilidades para UI (sin cambios)
  static getStatusText(status: string): string { /* ... */ return status }
  static getStatusColor(status: string): string { /* ... */ return 'bg-gray-100 text-gray-800' }
  static getPriorityText(priority: string): string { /* ... */ return priority }
  static getPriorityColor(priority: string): string { /* ... */ return 'bg-gray-100 text-gray-800' }
  static getVehicleTypeText(type: string): string { /* ... */ return type }
  static formatDate(dateString: string): string { return new Date(dateString).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  static getTimeAgo(dateString: string): string { /* ... */ return dateString }
}

export default QuoteService
