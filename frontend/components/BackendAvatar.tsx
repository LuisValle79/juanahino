import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { apiClient } from '@/lib/api'

interface BackendAvatarProps {
  src?: string | null | undefined
  userId?: number
  alt: string
  fallback?: string
  className?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  children?: React.ReactNode
  editable?: boolean
  onAvatarChange?: (newAvatarUrl: string) => void
}

export function BackendAvatar({ 
  src, 
  userId,
  alt, 
  fallback, 
  className, 
  size = 'medium',
  children,
  editable = false,
  onAvatarChange
}: BackendAvatarProps) {
  const [avatarInfo, setAvatarInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Obtener información del avatar si se proporciona userId
  useEffect(() => {
    if (userId && !src) {
      setLoading(true)
      apiClient.getUserAvatarInfo(userId)
        .then(result => {
          if (result.success) {
            setAvatarInfo(result)
          }
        })
        .catch(error => {
          console.error('Error getting avatar info:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [userId, src])
  
  // Verificar si es una URL de Cloudinary
  const isCloudinaryUrl = (url: string) => {
    return url.includes('cloudinary.com')
  }
  
  // Determinar la URL correcta de la imagen
  const getImageUrl = (imageSrc: string | null | undefined) => {
    if (!imageSrc) {
      // Si tenemos avatarInfo del usuario, usar esa URL
      if (avatarInfo?.hasAvatar && avatarInfo.avatarUrl) {
        return getOptimizedAvatarUrl(avatarInfo.avatarUrl)
      }
      return undefined
    }
    
    // Obtener la URL base del backend desde las variables de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080'
    
    // Si ya es una URL completa (incluyendo Cloudinary), optimizarla
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      if (isCloudinaryUrl(imageSrc)) {
        return getOptimizedAvatarUrl(imageSrc)
      }
      return imageSrc
    }
    
    // Si empieza con /uploads/, es del backend
    if (imageSrc.startsWith('/uploads/')) {
      return `${backendBaseUrl}${imageSrc}`
    }
    
    // Si es una ruta relativa normal, es del frontend
    if (imageSrc.startsWith('/')) {
      return imageSrc
    }
    
    // Por defecto, asumir que es del backend
    return `${backendBaseUrl}/uploads/${imageSrc}`
  }
  
  // Obtener URL optimizada para avatares de Cloudinary
  const getOptimizedAvatarUrl = (url: string) => {
    if (!isCloudinaryUrl(url)) return url
    
    const sizeMap = {
      'small': 50,
      'medium': 100,
      'large': 200,
      'xlarge': 400
    }
    
    const dimension = sizeMap[size] || 100
    return url.replace('/upload/', `/upload/c_fill,w_${dimension},h_${dimension},q_auto,f_auto/`)
  }
  
  // Manejar subida de avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !userId) return
    
    setUploading(true)
    try {
      const result = await apiClient.uploadUserAvatar(userId, file)
      if (result.success) {
        setAvatarInfo((prev: any) => ({
          ...prev,
          hasAvatar: true,
          avatarUrl: result.avatarUrl,
          isCloudinaryAvatar: true
        }))
        onAvatarChange?.(result.avatarUrl)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error al subir avatar: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }
  
  // Manejar eliminación de avatar
  const handleAvatarDelete = async () => {
    if (!userId) return
    
    try {
      const result = await apiClient.deleteUserAvatar(userId)
      if (result.success) {
        setAvatarInfo((prev: any) => ({
          ...prev,
          hasAvatar: false,
          avatarUrl: null
        }))
        onAvatarChange?.('')
      }
    } catch (error) {
      console.error('Error deleting avatar:', error)
      alert('Error al eliminar avatar: ' + (error as Error).message)
    }
  }
  
  const finalImageUrl = getImageUrl(src) || fallback || "/placeholder.svg"
  
  if (loading) {
    return (
      <Avatar className={className}>
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-400">...</span>
        </div>
      </Avatar>
    )
  }
  
  return (
    <div className="relative inline-block">
      <Avatar className={className}>
        <AvatarImage 
          src={finalImageUrl} 
          alt={alt} 
        />
        <AvatarFallback>
          {children}
        </AvatarFallback>
      </Avatar>
      
      {editable && userId && (
        <div className="absolute -bottom-2 -right-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
            id={`avatar-upload-${userId}`}
            disabled={uploading}
          />
          <label 
            htmlFor={`avatar-upload-${userId}`} 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 cursor-pointer text-xs shadow-lg"
            title="Cambiar avatar"
          >
            {uploading ? '⏳' : '📷'}
          </label>
          
          {avatarInfo?.hasAvatar && (
            <button 
              onClick={handleAvatarDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 ml-1 text-xs shadow-lg"
              title="Eliminar avatar"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  )
}