import { apiClient } from '@/lib/api'
import { User } from '@/types/user'

export class UserService {
  // Obtener todos los usuarios
  static async getAll(): Promise<User[]> {
    try {
      return await apiClient.getUsers()
    } catch (error: any) {
      console.error('UserService: Error loading users:', error.message)
      return []
    }
  }

  // Obtener usuario por ID
  static async getById(id: number): Promise<User | null> {
    try {
      return await apiClient.getUserById(id)
    } catch (error: any) {
      console.error(`UserService: Error loading user by ID ${id}:`, error.message)
      return null
    }
  }

  // Obtener usuario por email
  static async getByEmail(email: string): Promise<User | null> {
    try {
      const encodedEmail = encodeURIComponent(email)
      return await apiClient.getUserByEmail(encodedEmail)
    } catch (error: any) {
      console.error(`UserService: Error loading user by email ${email}:`, error.message)
      return null
    }
  }

  // Crear nuevo usuario
  static async create(user: Partial<User>): Promise<User | null> {
    try {
      return await apiClient.createUser(user)
    } catch (error: any) {
      console.error('UserService: Error creating user:', error.message)
      return null
    }
  }

  // Actualizar usuario
  static async update(id: number, user: Partial<User>): Promise<User | null> {
    try {
      return await apiClient.updateUser(id, user)
    } catch (error: any) {
      console.error(`UserService: Error updating user ID ${id}:`, error.message)
      return null
    }
  }

  // Eliminar usuario
  static async delete(id: number): Promise<boolean> {
    try {
      await apiClient.deleteUser(id)
      return true
    } catch (error: any) {
      console.error(`UserService: Error deleting user ID ${id}:`, error.message)
      return false
    }
  }

  // Obtener estadísticas
  static async getStats() {
    try {
      return await apiClient.getUserStats()
    } catch (error: any) {
      console.error('UserService: Error loading user stats:', error.message)
      return null
    }
  }

  // Obtener asesores activos
  static async getActiveAdvisors(): Promise<User[]> {
    try {
      return await apiClient.getActiveAdvisors()
    } catch (error: any) {
      console.error('UserService: Error loading active advisors:', error.message)
      return []
    }
  }

  // Filtros específicos
  static async getByRole(role: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => user.rol === role)
  }

  static async getByStatus(status: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => user.estado === status)
  }

  static async getBySpecialty(especialidad: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => 
      user.especialidad?.toLowerCase().includes(especialidad.toLowerCase())
    )
  }

  static async search(query: string): Promise<User[]> {
    const allUsers = await this.getAll()
    const searchTerm = query.toLowerCase()

    return allUsers.filter(user => 
      user.nombre?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.telefono?.includes(searchTerm) ||
      user.especialidad?.toLowerCase().includes(searchTerm)
    )
  }

  // Métodos de avatar
  static async uploadAvatar(userId: number, file: File) {
    try {
      return await apiClient.uploadUserAvatar(userId, file)
    } catch (error: any) {
      console.error(`UserService: Error uploading avatar for user ID ${userId}:`, error.message)
      return null
    }
  }

  static async deleteAvatar(userId: number) {
    try {
      return await apiClient.deleteUserAvatar(userId)
    } catch (error: any) {
      console.error(`UserService: Error deleting avatar for user ID ${userId}:`, error.message)
      return false
    }
  }

  static async getAvatarInfo(userId: number) {
    try {
      return await apiClient.getUserAvatarInfo(userId)
    } catch (error: any) {
      console.error(`UserService: Error getting avatar info for user ID ${userId}:`, error.message)
      return null
    }
  }

  static async getAvatarOptimizedUrls(userId: number) {
    try {
      return await apiClient.getUserAvatarOptimizedUrls(userId)
    } catch (error: any) {
      console.error(`UserService: Error getting optimized avatar URLs for user ID ${userId}:`, error.message)
      return null
    }
  }

  // Utilidades
  static getRoleText(role: string): string {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'asesor': return 'Asesor'
      case 'mecanico': return 'Mecánico'
      case 'supervisor': return 'Supervisor'
      default: return role
    }
  }

  static getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'asesor': return 'bg-blue-100 text-blue-800'
      case 'mecanico': return 'bg-orange-100 text-orange-800'
      case 'supervisor': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'activo': return 'Activo'
      case 'inactivo': return 'Inactivo'
      case 'suspendido': return 'Suspendido'
      default: return status
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-gray-100 text-gray-800'
      case 'suspendido': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  static getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  static formatPhoneNumber(phone: string): string {
    if (phone.startsWith('+51')) return phone
    if (phone.startsWith('51')) return `+${phone}`
    if (phone.length === 9) return `+51 ${phone}`
    return phone
  }
}

export default UserService
