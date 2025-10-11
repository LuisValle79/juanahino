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
  imagen_url: string
  descripcion?: string
  created_at: Date
  updated_at: Date
}