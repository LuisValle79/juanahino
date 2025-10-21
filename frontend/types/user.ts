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
  fecha_ingreso: Date | string
  avatar_url?: string
  avatarUrl?: string // For backward compatibility
  password_hash?: string
  passwordHash?: string // For backward compatibility
  created_at: Date | string
  updated_at: Date | string
  createdAt?: Date | string // For backward compatibility
  updatedAt?: Date | string // For backward compatibility
  fechaIngreso?: string // For form compatibility
}