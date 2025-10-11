export type NotificationType = 'alert' | 'maintenance' | 'fuel' | 'system' | 'quote' | 'user' | 'vehicle' | 'sale'
export type NotificationPriority = 'alta' | 'media' | 'baja'

export interface Notification {
  id: number
  tipo: NotificationType
  prioridad: NotificationPriority
  titulo: string
  mensaje: string
  vehiculo_id: number | null
  quote_id: number | null
  user_id: number | null
  vehiculo_modelo?: string
  quote_cliente?: string
  user_nombre?: string
  leido: boolean
  created_at: Date
  updated_at: Date
}