import { db } from '@/lib/db'
import { Quote } from '@/types/quote'

export class QuoteService {
  // Get all quotes
  static async getAllQuotes(): Promise<Quote[]> {
    const result = await db.query(
      `SELECT q.id, q.cliente_nombre, q.cliente_email, q.cliente_telefono, q.empresa, q.tipo_vehiculo, 
              q.mensaje, q.estado, q.prioridad, q.asesor_asignado_id, q.created_at, q.updated_at,
              u.nombre as asesor_nombre
       FROM quotes q
       LEFT JOIN users u ON q.asesor_asignado_id = u.id
       ORDER BY q.created_at DESC`
    )
    return result.rows
  }

  // Get quote by ID
  static async getQuoteById(id: number): Promise<Quote | null> {
    const result = await db.query(
      `SELECT q.id, q.cliente_nombre, q.cliente_email, q.cliente_telefono, q.empresa, q.tipo_vehiculo, 
              q.mensaje, q.estado, q.prioridad, q.asesor_asignado_id, q.created_at, q.updated_at,
              u.nombre as asesor_nombre
       FROM quotes q
       LEFT JOIN users u ON q.asesor_asignado_id = u.id
       WHERE q.id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  // Get quotes by status
  static async getQuotesByStatus(status: string): Promise<Quote[]> {
    const result = await db.query(
      `SELECT q.id, q.cliente_nombre, q.cliente_email, q.cliente_telefono, q.empresa, q.tipo_vehiculo, 
              q.mensaje, q.estado, q.prioridad, q.asesor_asignado_id, q.created_at, q.updated_at,
              u.nombre as asesor_nombre
       FROM quotes q
       LEFT JOIN users u ON q.asesor_asignado_id = u.id
       WHERE q.estado = $1
       ORDER BY q.created_at DESC`,
      [status]
    )
    return result.rows
  }

  // Get quotes by priority
  static async getQuotesByPriority(priority: string): Promise<Quote[]> {
    const result = await db.query(
      `SELECT q.id, q.cliente_nombre, q.cliente_email, q.cliente_telefono, q.empresa, q.tipo_vehiculo, 
              q.mensaje, q.estado, q.prioridad, q.asesor_asignado_id, q.created_at, q.updated_at,
              u.nombre as asesor_nombre
       FROM quotes q
       LEFT JOIN users u ON q.asesor_asignado_id = u.id
       WHERE q.prioridad = $1
       ORDER BY q.created_at DESC`,
      [priority]
    )
    return result.rows
  }

  // Create a new quote
  static async createQuote(quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<Quote> {
    const result = await db.query(
      `INSERT INTO quotes (cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id, created_at, updated_at`,
      [
        quote.cliente_nombre,
        quote.cliente_email,
        quote.cliente_telefono,
        quote.empresa,
        quote.tipo_vehiculo,
        quote.mensaje,
        quote.estado,
        quote.prioridad,
        quote.asesor_asignado_id
      ]
    )
    
    // Create notification for new quote
    await db.query(
      `INSERT INTO notifications (tipo, prioridad, titulo, mensaje, quote_id, leido)
       VALUES ('quote', $1, 'Nueva cotización recibida', $2, $3, false)`,
      [quote.prioridad, `Nueva cotización de ${quote.cliente_nombre} para ${quote.tipo_vehiculo}`, result.rows[0].id]
    )
    
    return result.rows[0]
  }

  // Update a quote
  static async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote | null> {
    const fields = []
    const values = []
    let index = 1

    // Build dynamic query based on provided fields
    Object.keys(quote).forEach(key => {
      if (key !== 'id' && key !== 'created_at' && quote[key as keyof Quote] !== undefined) {
        fields.push(`${key} = $${index}`)
        values.push(quote[key as keyof Quote])
        index++
      }
    })

    if (fields.length === 0) {
      throw new Error('No fields to update')
    }

    // Add updated_at timestamp
    fields.push(`updated_at = $${index}`)
    values.push(new Date())
    values.push(id) // for WHERE clause

    const result = await db.query(
      `UPDATE quotes 
       SET ${fields.join(', ')}
       WHERE id = $${index + 1}
       RETURNING id, cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id, created_at, updated_at`,
      values
    )

    return result.rows[0] || null
  }

  // Delete a quote
  static async deleteQuote(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM quotes WHERE id = $1', [id])
    return result.rowCount !== null && result.rowCount > 0
  }

  // Assign advisor to quote
  static async assignAdvisor(quoteId: number, advisorId: number): Promise<Quote | null> {
    const result = await db.query(
      `UPDATE quotes 
       SET asesor_asignado_id = $1, estado = 'en-proceso', updated_at = $2
       WHERE id = $3
       RETURNING id, cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id, created_at, updated_at`,
      [advisorId, new Date(), quoteId]
    )
    
    // Create notification for assignment
    await db.query(
      `INSERT INTO notifications (tipo, prioridad, titulo, mensaje, quote_id, leido)
       VALUES ('quote', 'media', 'Cotización asignada', $1, $2, false)`,
      [`La cotización #${quoteId} ha sido asignada a un asesor`, quoteId]
    )
    
    return result.rows[0] || null
  }

  // Get quote statistics
  static async getQuoteStats(): Promise<{ total: number; pendientes: number; enProceso: number; enviadas: number; cerradas: number }> {
    const result = await db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
         COUNT(CASE WHEN estado = 'en-proceso' THEN 1 END) as enProceso,
         COUNT(CASE WHEN estado = 'enviada' THEN 1 END) as enviadas,
         COUNT(CASE WHEN estado = 'cerrada' THEN 1 END) as cerradas
       FROM quotes`
    )
    
    return result.rows[0]
  }
}