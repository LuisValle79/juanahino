import { apiClient } from '@/lib/api'
import { User } from '@/types/user'

export class UserService {
  // Obtener todos los usuarios
  static async getAll(): Promise<User[]> {
    return apiClient.getUsers()
  }

  // Obtener usuario por ID
  static async getById(id: number): Promise<User> {
    return apiClient.getUserById(id)
  }

  // Obtener usuario por email
  static async getByEmail(email: string): Promise<User> {
    const encodedEmail = encodeURIComponent(email)
    return apiClient.request(`/users/email/${encodedEmail}`)
  }

  // Crear nuevo usuario
  static async create(user: Partial<User>): Promise<User> {
    return apiClient.createUser(user)
  }

  // Actualizar usuario
  static async update(id: number, user: Partial<User>): Promise<User> {
    return apiClient.updateUser(id, user)
  }

  // Eliminar usuario
  static async delete(id: number): Promise<void> {
    return apiClient.deleteUser(id)
  }

  // Obtener estadísticas
  static async getStats() {
    return apiClient.getUserStats()
  }

  // Obtener asesores activos
  static async getActiveAdvisors(): Promise<User[]> {
    return apiClient.getActiveAdvisors()
  }

  // Filtros específicos
  static async getByRole(rol: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => user.rol === rol)
  }

  static async getByStatus(estado: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => user.estado === estado)
  }

  static async getBySpecialty(especialidad: string): Promise<User[]> {
    const allUsers = await this.getAll()
    return allUsers.filter(user => 
      user.especialidad.toLowerCase().includes(especialidad.toLowerCase())
    )
  }

  static async search(query: string): Promise<User[]> {
    const allUsers = await this.getAll()
    const searchTerm = query.toLowerCase()
    
    return allUsers.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.telefono.includes(searchTerm) ||
      user.especialidad.toLowerCase().includes(searchTerm)
    )
  }

  // Métodos de avatar
  static async uploadAvatar(userId: number, file: File) {
    return apiClient.uploadUserAvatar(userId, file)
  }

  static async deleteAvatar(userId: number) {
    return apiClient.deleteUserAvatar(userId)
  }

  static async getAvatarInfo(userId: number) {
    return apiClient.getUserAvatarInfo(userId)
  }

  static async getAvatarOptimizedUrls(userId: number) {
    return apiClient.getUserAvatarOptimizedUrls(userId)
  }

  // Utilidades
  static getRoleText(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'asesor':
        return 'Asesor'
      case 'mecanico':
        return 'Mecánico'
      case 'supervisor':
        return 'Supervisor'
      default:
        return role
    }
  }

  static getRoleColor(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'asesor':
        return 'bg-blue-100 text-blue-800'
      case 'mecanico':
        return 'bg-orange-100 text-orange-800'
      case 'supervisor':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'activo':
        return 'Activo'
      case 'inactivo':
        return 'Inactivo'
      case 'suspendido':
        return 'Suspendido'
      default:
        return status
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'inactivo':
        return 'bg-gray-100 text-gray-800'
      case 'suspendido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    // Formato básico para números peruanos
    if (phone.startsWith('+51')) {
      return phone
    }
    if (phone.startsWith('51')) {
      return `+${phone}`
    }
    if (phone.length === 9) {
      return `+51 ${phone}`
    }
    return phone
  }
}

export default UserService