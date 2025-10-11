import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/notifications - Get all notifications
export async function GET() {
  try {
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
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// POST /api/notifications - Mark notification as read
export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    
    const result = await db.query(
      'UPDATE notifications SET leido = true, updated_at = $1 WHERE id = $2',
      [new Date(), id]
    )
    
    if (result.rowCount !== null && result.rowCount > 0) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

// PUT /api/notifications - Mark all notifications as read
export async function PUT() {
  try {
    const result = await db.query(
      'UPDATE notifications SET leido = true, updated_at = $1',
      [new Date()]
    )
    
    return NextResponse.json({ success: true, updated: result.rowCount !== null ? result.rowCount : 0 })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}