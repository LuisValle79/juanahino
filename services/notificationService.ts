// This service should only be used on the server side
// For client-side usage, use the API routes directly

import { db } from '@/lib/db'
import { Notification } from '@/types/notification'

export class NotificationService {
  // Server-side method only
  static async getAllNotificationsServer(): Promise<Notification[]> {
    const result = await db.query(
      `SELECT n.id, n.tipo, n.prioridad, n.titulo, n.mensaje, n.vehiculo_id, n.quote_id, n.user_id, n.leido, n.created_at, n.updated_at,
              v.modelo as vehiculo_modelo,
              q.cliente_nombre as quote_cliente,
              u.nombre as user_nombre
       FROM notifications n
       LEFT JOIN vehicles v ON n.vehiculo_id = v.id
       LEFT JOIN quotes q ON n.quote_id = q.id
       LEFT JOIN users u ON n.user_id = u.id
       ORDER BY n.created_at DESC`
    )
    return result.rows
  }

  // Server-side method only
  static async getNotificationByIdServer(id: number): Promise<Notification | null> {
    const result = await db.query(
      `SELECT n.id, n.tipo, n.prioridad, n.titulo, n.mensaje, n.vehiculo_id, n.quote_id, n.user_id, n.leido, n.created_at, n.updated_at,
              v.modelo as vehiculo_modelo,
              q.cliente_nombre as quote_cliente,
              u.nombre as user_nombre
       FROM notifications n
       LEFT JOIN vehicles v ON n.vehiculo_id = v.id
       LEFT JOIN quotes q ON n.quote_id = q.id
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  // Server-side method only
  static async getUnreadNotificationsServer(): Promise<Notification[]> {
    const result = await db.query(
      `SELECT n.id, n.tipo, n.prioridad, n.titulo, n.mensaje, n.vehiculo_id, n.quote_id, n.user_id, n.leido, n.created_at, n.updated_at,
              v.modelo as vehiculo_modelo,
              q.cliente_nombre as quote_cliente,
              u.nombre as user_nombre
       FROM notifications n
       LEFT JOIN vehicles v ON n.vehiculo_id = v.id
       LEFT JOIN quotes q ON n.quote_id = q.id
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.leido = false
       ORDER BY n.created_at DESC`
    )
    return result.rows
  }

  // Server-side method only - Create a new notification
  static async createNotificationServer(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<Notification> {
    const result = await db.query(
      `INSERT INTO notifications (tipo, prioridad, titulo, mensaje, vehiculo_id, quote_id, user_id, leido)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, tipo, prioridad, titulo, mensaje, vehiculo_id, quote_id, user_id, leido, created_at, updated_at`,
      [
        notification.tipo,
        notification.prioridad,
        notification.titulo,
        notification.mensaje,
        notification.vehiculo_id,
        notification.quote_id,
        notification.user_id,
        notification.leido
      ]
    )
    return result.rows[0]
  }

  // Server-side method only - Create user-related notification
  static async createUserNotification(message: string, userId?: number, priority: 'alta' | 'media' | 'baja' = 'media'): Promise<Notification> {
    return this.createNotificationServer({
      tipo: 'user',
      prioridad: priority,
      titulo: 'Actualización de usuario',
      mensaje: message,
      user_id: userId || null,
      vehiculo_id: null,
      quote_id: null,
      leido: false
    })
  }

  // Server-side method only - Create vehicle-related notification
  static async createVehicleNotification(message: string, vehicleId?: number, priority: 'alta' | 'media' | 'baja' = 'media'): Promise<Notification> {
    return this.createNotificationServer({
      tipo: 'vehicle',
      prioridad: priority,
      titulo: 'Actualización de vehículo',
      mensaje: message,
      vehiculo_id: vehicleId || null,
      user_id: null,
      quote_id: null,
      leido: false
    })
  }

  // Server-side method only - Create sale-related notification
  static async createSaleNotification(message: string, vehicleId?: number, priority: 'alta' | 'media' | 'baja' = 'alta'): Promise<Notification> {
    return this.createNotificationServer({
      tipo: 'sale',
      prioridad: priority,
      titulo: 'Venta realizada',
      mensaje: message,
      vehiculo_id: vehicleId || null,
      user_id: null,
      quote_id: null,
      leido: false
    })
  }

  // Server-side method only - Create quote-related notification
  static async createQuoteNotification(message: string, quoteId?: number, priority: 'alta' | 'media' | 'baja' = 'media'): Promise<Notification> {
    return this.createNotificationServer({
      tipo: 'quote',
      prioridad: priority,
      titulo: 'Nueva cotización',
      mensaje: message,
      quote_id: quoteId || null,
      vehiculo_id: null,
      user_id: null,
      leido: false
    })
  }

  // Server-side method only
  static async getNotificationStatsServer(): Promise<{ total: number; unread: number; alerts: number; maintenance: number; quotes: number }> {
    const result = await db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN leido = false THEN 1 END) as unread,
         COUNT(CASE WHEN tipo = 'alert' THEN 1 END) as alerts,
         COUNT(CASE WHEN tipo = 'maintenance' THEN 1 END) as maintenance,
         COUNT(CASE WHEN tipo = 'quote' THEN 1 END) as quotes
       FROM notifications`
    )
    
    return result.rows[0]
  }
}