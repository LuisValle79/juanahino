import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/quotes - Get all quotes
export async function GET() {
  try {
    const result = await db.query(
      `SELECT q.id, q.cliente_nombre, q.cliente_email, q.cliente_telefono, q.empresa, q.tipo_vehiculo, 
              q.mensaje, q.estado, q.prioridad, q.asesor_asignado_id, q.created_at, q.updated_at,
              u.nombre as asesor_nombre
       FROM quotes q
       LEFT JOIN users u ON q.asesor_asignado_id = u.id
       ORDER BY q.created_at DESC`
    )
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

// POST /api/quotes - Update quote status or assign advisor
export async function POST(request: Request) {
  try {
    const { action, quoteId, ...data } = await request.json()
    
    let result
    if (action === 'assignAdvisor') {
      result = await db.query(
        `UPDATE quotes 
         SET asesor_asignado_id = $1, estado = 'en-proceso', updated_at = $2
         WHERE id = $3
         RETURNING id, cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id, created_at, updated_at`,
        [data.advisorId, new Date(), quoteId]
      )
      
      // Create notification for assignment
      await db.query(
        `INSERT INTO notifications (tipo, prioridad, titulo, mensaje, quote_id, leido)
         VALUES ('quote', 'media', 'Cotización asignada', $1, $2, false)`,
        [`La cotización #${quoteId} ha sido asignada a un asesor`, quoteId]
      )
    } else if (action === 'updateStatus') {
      result = await db.query(
        `UPDATE quotes 
         SET estado = $1, updated_at = $2
         WHERE id = $3
         RETURNING id, cliente_nombre, cliente_email, cliente_telefono, empresa, tipo_vehiculo, mensaje, estado, prioridad, asesor_asignado_id, created_at, updated_at`,
        [data.estado, new Date(), quoteId]
      )
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    if (result.rowCount !== null && result.rowCount > 0) {
      return NextResponse.json(result.rows[0])
    } else {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}