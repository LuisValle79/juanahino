import { apiClient } from '@/lib/api'
import { Vehicle, VehicleStats } from '@/types/vehicle'

export class VehicleService {
  // Obtener todos los vehículos
  static async getAll(): Promise<Vehicle[]> {
    return apiClient.getVehicles()
  }

  // Obtener vehículo por ID
  static async getById(id: number): Promise<Vehicle> {
    return apiClient.getVehicleById(id)
  }

  // Crear nuevo vehículo
  static async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return apiClient.createVehicle(vehicle)
  }

  // Actualizar vehículo
  static async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return apiClient.updateVehicle(id, vehicle)
  }

  // Eliminar vehículo
  static async delete(id: number): Promise<void> {
    return apiClient.deleteVehicle(id)
  }

  // Obtener estadísticas
  static async getStats(): Promise<VehicleStats> {
    return apiClient.getVehicleStats()
  }

  // Filtros específicos
  static async getByType(tipo: string): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    return allVehicles.filter(vehicle => vehicle.tipo === tipo)
  }

  static async getByStatus(estado: string): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    return allVehicles.filter(vehicle => vehicle.estado === estado)
  }

  static async getByCategory(categoria: string): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    return allVehicles.filter(vehicle => vehicle.categoria.toLowerCase().includes(categoria.toLowerCase()))
  }

  static async getByYear(año: number): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    return allVehicles.filter(vehicle => vehicle.año === año)
  }

  static async getByPriceRange(minPrecio: number, maxPrecio: number): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    return allVehicles.filter(vehicle => vehicle.precio >= minPrecio && vehicle.precio <= maxPrecio)
  }

  static async search(query: string): Promise<Vehicle[]> {
    const allVehicles = await this.getAll()
    const searchTerm = query.toLowerCase()
    
    return allVehicles.filter(vehicle => 
      vehicle.modelo.toLowerCase().includes(searchTerm) ||
      vehicle.categoria.toLowerCase().includes(searchTerm) ||
      vehicle.tipo.toLowerCase().includes(searchTerm) ||
      vehicle.motor.toLowerCase().includes(searchTerm) ||
      vehicle.descripcion?.toLowerCase().includes(searchTerm)
    )
  }

  // Métodos de imagen
  static async uploadImage(vehicleId: number, file: File, esPrincipal: boolean = false) {
    return apiClient.uploadVehicleImage(vehicleId, file, esPrincipal)
  }

  static async getImages(vehicleId: number) {
    return apiClient.getVehicleImages(vehicleId)
  }

  static async deleteImage(imageId: number) {
    return apiClient.deleteVehicleImage(imageId)
  }

  // Utilidades
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'disponible':
        return 'Disponible'
      case 'reservado':
        return 'Reservado'
      case 'vendido':
        return 'Vendido'
      default:
        return 'Desconocido'
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800'
      case 'reservado':
        return 'bg-amber-100 text-amber-800'
      case 'vendido':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  static getTypeText(type: string): string {
    switch (type) {
      case 'camion':
        return 'Camión'
      case 'bus':
        return 'Bus'
      default:
        return type
    }
  }
}

export default VehicleService