import { db } from '@/lib/db'
import { Vehicle } from '@/types/vehicle'
import { NotificationService } from '@/services/notificationService'

export class VehicleService {
  // Get all vehicles
  static async getAllVehicles(): Promise<Vehicle[]> {
    const result = await db.query(
      `SELECT id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at
       FROM vehicles 
       ORDER BY created_at DESC`
    )
    return result.rows
  }

  // Get vehicle by ID
  static async getVehicleById(id: number): Promise<Vehicle | null> {
    const result = await db.query(
      `SELECT id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at
       FROM vehicles 
       WHERE id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  // Get vehicles by type
  static async getVehiclesByType(type: string): Promise<Vehicle[]> {
    const result = await db.query(
      `SELECT id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at
       FROM vehicles 
       WHERE tipo = $1
       ORDER BY created_at DESC`,
      [type]
    )
    return result.rows
  }

  // Get vehicles by status
  static async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    const result = await db.query(
      `SELECT id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at
       FROM vehicles 
       WHERE estado = $1
       ORDER BY created_at DESC`,
      [status]
    )
    return result.rows
  }

  // Create a new vehicle
  static async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> {
    const result = await db.query(
      `INSERT INTO vehicles (modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at`,
      [
        vehicle.modelo,
        vehicle.tipo,
        vehicle.categoria,
        vehicle.precio,
        vehicle.capacidad,
        vehicle.motor,
        vehicle.año,
        vehicle.estado,
        vehicle.stock,
        vehicle.imagen_url || null, // Handle null case
        vehicle.descripcion || null // Handle null case
      ]
    )
    
    const newVehicle = result.rows[0]
    
    // Create notification for new vehicle
    await NotificationService.createVehicleNotification(
      `Se ha agregado un nuevo vehículo: ${newVehicle.modelo}`,
      newVehicle.id,
      'media'
    )
    
    return newVehicle
  }

  // Update a vehicle
  static async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    const fields = []
    const values = []
    let index = 1

    // Build dynamic query based on provided fields
    Object.keys(vehicle).forEach(key => {
      if (key !== 'id' && key !== 'created_at' && vehicle[key as keyof Vehicle] !== undefined) {
        fields.push(`${key} = $${index}`)
        values.push(vehicle[key as keyof Vehicle])
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
      `UPDATE vehicles 
       SET ${fields.join(', ')}
       WHERE id = $${index + 1}
       RETURNING id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at`,
      values
    )

    const updatedVehicle = result.rows[0] || null
    
    // Create notification for vehicle update
    if (updatedVehicle) {
      await NotificationService.createVehicleNotification(
        `Se ha actualizado el vehículo: ${updatedVehicle.modelo}`,
        updatedVehicle.id,
        'media'
      )
    }
    
    return updatedVehicle
  }

  // Delete a vehicle
  static async deleteVehicle(id: number): Promise<boolean> {
    // First get vehicle info for notification
    const vehicle = await this.getVehicleById(id)
    
    const result = await db.query('DELETE FROM vehicles WHERE id = $1', [id])
    const deleted = result.rowCount !== null && result.rowCount > 0
    
    // Create notification for vehicle deletion
    if (deleted && vehicle) {
      await NotificationService.createVehicleNotification(
        `Se ha eliminado el vehículo: ${vehicle.modelo}`,
        vehicle.id,
        'media'
      )
    }
    
    return deleted
  }

  // Get vehicle statistics
  static async getVehicleStats(): Promise<{ total: number; disponibles: number; reservados: number; vendidos: number; stockTotal: number }> {
    const result = await db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN estado = 'disponible' THEN 1 END) as disponibles,
         COUNT(CASE WHEN estado = 'reservado' THEN 1 END) as reservados,
         COUNT(CASE WHEN estado = 'vendido' THEN 1 END) as vendidos,
         SUM(stock) as stockTotal
       FROM vehicles`
    )
    
    return result.rows[0]
  }

  // Mark vehicle as sold
  static async markAsSold(id: number): Promise<Vehicle | null> {
    const result = await db.query(
      `UPDATE vehicles 
       SET estado = 'vendido', updated_at = $1
       WHERE id = $2
       RETURNING id, modelo, tipo, categoria, precio, capacidad, motor, año, estado, stock, imagen_url, descripcion, created_at, updated_at`,
      [new Date(), id]
    )

    const soldVehicle = result.rows[0] || null
    
    // Create notification for vehicle sale
    if (soldVehicle) {
      await NotificationService.createSaleNotification(
        `Se ha vendido un vehículo: ${soldVehicle.modelo}`,
        soldVehicle.id,
        'alta'
      )
    }
    
    return soldVehicle
  }
}