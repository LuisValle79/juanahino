export type UserRole = 'admin' | 'asesor'
export type UserStatus = 'activo' | 'inactivo'

export interface User {
  id: number
  nombre: string
  email: string
  telefono: string
  rol: UserRole
  especialidad: string
  estado: UserStatus
  ventas: number
  fecha_ingreso: Date
  avatar_url: string
  password_hash: string
  created_at: Date
  updated_at: Date
}