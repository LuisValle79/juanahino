export type VehicleType = 'camion' | 'bus'
export type VehicleStatus = 'disponible' | 'reservado' | 'vendido'

export interface Vehicle {
  id: number
  modelo: string
  tipo: VehicleType
  categoria: string
  precio: number
  capacidad: string
  motor: string
  año: number
  estado: VehicleStatus
  stock: number
  imagen_url?: string
  imagenUrl?: string // For backward compatibility
  descripcion?: string
  created_at: Date | string
  updated_at: Date | string
}

export interface VehicleStats {
  total: number
  disponible: number
  reservado: number
  vendido: number
  available?: number // Alternative naming
  byType?: Record<string, number>
  byStatus?: Record<string, number>
}