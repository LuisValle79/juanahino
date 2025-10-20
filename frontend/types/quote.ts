export type QuoteStatus = 'pendiente' | 'en-proceso' | 'enviada' | 'cerrada'
export type QuotePriority = 'alta' | 'media' | 'baja'

export interface Quote {
  id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  empresa: string
  tipo_vehiculo: string
  mensaje: string
  estado: QuoteStatus
  prioridad: QuotePriority
  asesor_asignado_id: number | null
  asesor_nombre?: string
  created_at: Date
  updated_at: Date
}