import { db } from '@/lib/db'
import { User } from '@/types/user'
import { NotificationService } from '@/services/notificationService'

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       ORDER BY created_at DESC`
    )
    return result.rows
  }

  // Get user by ID
  static async getUserById(id: number): Promise<User | null> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       WHERE email = $1`,
      [email]
    )
    return result.rows[0] || null
  }

  // Get users by role
  static async getUsersByRole(role: string): Promise<User[]> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       WHERE rol = $1
       ORDER BY created_at DESC`,
      [role]
    )
    return result.rows
  }

  // Get users by status
  static async getUsersByStatus(status: string): Promise<User[]> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       WHERE estado = $1
       ORDER BY created_at DESC`,
      [status]
    )
    return result.rows
  }

  // Create a new user
  static async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const result = await db.query(
      `INSERT INTO users (nombre, email, telefono, rol, especialidad, estado, avatar_url, password_hash, ventas, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at`,
      [
        user.nombre,
        user.email,
        user.telefono,
        user.rol,
        user.especialidad,
        user.estado,
        user.avatar_url || null,
        user.password_hash,
        user.ventas || 0,
        user.fecha_ingreso || new Date()
      ]
    )
    
    const newUser = result.rows[0]
    
    // Create notification for new user
    await NotificationService.createUserNotification(
      `Se ha registrado un nuevo usuario: ${newUser.nombre} (${newUser.rol})`,
      newUser.id,
      'media'
    )
    
    return newUser
  }

  // Update a user
  static async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    const fields = []
    const values = []
    let index = 1

    // Build dynamic query based on provided fields
    Object.keys(user).forEach(key => {
      if (key !== 'id' && key !== 'created_at' && user[key as keyof User] !== undefined) {
        fields.push(`${key} = $${index}`)
        values.push(user[key as keyof User])
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
      `UPDATE users 
       SET ${fields.join(', ')}
       WHERE id = $${index + 1}
       RETURNING id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at`,
      values
    )

    const updatedUser = result.rows[0] || null
    
    // Create notification for user update
    if (updatedUser) {
      await NotificationService.createUserNotification(
        `Se ha actualizado el usuario: ${updatedUser.nombre}`,
        updatedUser.id,
        'media'
      )
    }
    
    return updatedUser
  }

  // Delete a user
  static async deleteUser(id: number): Promise<boolean> {
    // First get user info for notification
    const user = await this.getUserById(id)
    
    // Create notification for user deletion before deleting the user
    // Note: We don't reference the user_id in the notification to avoid foreign key issues
    if (user) {
      await NotificationService.createUserNotification(
        `Se ha eliminado el usuario: ${user.nombre}`,
        undefined, // Don't reference the deleted user ID to avoid foreign key constraint issues
        'media'
      )
    }
    
    // Set user_id to NULL in notifications to avoid foreign key constraint issues
    await db.query('UPDATE notifications SET user_id = NULL WHERE user_id = $1', [id])
    
    // Delete the user
    const result = await db.query('DELETE FROM users WHERE id = $1', [id])
    const deleted = result.rowCount !== null && result.rowCount > 0
    
    return deleted
  }

  // Get user statistics
  static async getUserStats(): Promise<{ total: number; asesores: number; admins: number; activos: number }> {
    const result = await db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN rol = 'asesor' THEN 1 END) as asesores,
         COUNT(CASE WHEN rol = 'admin' THEN 1 END) as admins,
         COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos
       FROM users`
    )
    
    return result.rows[0]
  }

  // Authenticate user by email and password
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, nombre, email, telefono, rol, especialidad, estado, ventas, fecha_ingreso, avatar_url, created_at, updated_at
       FROM users 
       WHERE email = $1 AND password_hash = $2`,
      [email, password]  // In a real app, this should compare hashed passwords
    )
    return result.rows[0] || null
  }
}