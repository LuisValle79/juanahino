// Tipos para cotizaciones del cliente (legacy)
export interface Quote {
  id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono?: string
  empresa?: string
  tipo_vehiculo: string
  mensaje: string
  prioridad: 'alta' | 'media' | 'baja'
  estado: 'pendiente' | 'en-proceso' | 'enviada' | 'cerrada'
  asesor_asignado_id?: number
  asesor_nombre?: string
  created_at: string
  updated_at: string
}

// Tipos para las nuevas cotizaciones de la API
export interface ApiQuote {
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
  pendiente?: number
  pendientes?: number
  en_proceso?: number
  enProceso?: number
  completada?: number
  completadas?: number
  cancelada?: number
  canceladas?: number
  enviada?: number
  enviadas?: number
  cerrada?: number
  cerradas?: number
  unassigned?: number
  byPriority?: Record<string, number>
  byStatus?: Record<string, number>
  byVehicleType?: Record<string, number>
}