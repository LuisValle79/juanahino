export type UserRole = 'admin' | 'asesor' | 'mecanico' | 'supervisor'
export type UserStatus = 'activo' | 'inactivo' | 'suspendido'

export interface User {
  id: number
  nombre: string
  email: string
  telefono: string
  rol: UserRole
  especialidad: string
  estado: UserStatus
  ventas: number
  fechaIngreso: string // Backend uses camelCase
  avatarUrl?: string // Backend uses camelCase
  passwordHash?: string // Backend uses camelCase
  createdAt: string // Backend uses camelCase
  updatedAt: string // Backend uses camelCase
  // Backward compatibility fields
  fecha_ingreso?: string
  avatar_url?: string
  password_hash?: string
  created_at?: Date | string
  updated_at?: Date | string
}