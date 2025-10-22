import React, { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { BackendAvatar } from './BackendAvatar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface UserAvatarManagerProps {
  userId: number
  userName?: string
  userRole?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  editable?: boolean
  showInfo?: boolean
  className?: string
}

export function UserAvatarManager({
  userId,
  userName,
  userRole,
  size = 'medium',
  editable = false,
  showInfo = true,
  className
}: UserAvatarManagerProps) {
  const [avatarInfo, setAvatarInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [optimizedUrls, setOptimizedUrls] = useState<any>(null)

  useEffect(() => {
    fetchAvatarInfo()
  }, [userId])

  const fetchAvatarInfo = async () => {

    try {
      const result = await apiClient.getUserAvatarInfo(userId)
      
      if (result.success) {
        setAvatarInfo(result)
        
        // Si tiene avatar de Cloudinary, obtener URLs optimizadas
        if (result.hasAvatar && result.isCloudinaryAvatar) {
          try {
            const urlsResult = await apiClient.getUserAvatarOptimizedUrls(userId)
            if (urlsResult.success) {
              setOptimizedUrls(urlsResult.urls)
            }
          } catch (error) {
            // Silenciar errores de URLs optimizadas
          }
        }
      }
    } catch (error) {
      // Silenciar errores 404 - es normal que no existan avatares aún
      if (error instanceof Error && error.message.includes('404')) {
        // Usuario no tiene avatar, usar estado por defecto
        setAvatarInfo({
          userId: userId,
          userName: userName || 'Usuario',
          userRole: userRole || 'usuario',
          hasAvatar: false,
          avatarUrl: null,
          isCloudinaryAvatar: false
        })
      }
      // No mostrar otros errores en consola
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    setUploading(true)
    try {
      // Validar configuración de Cloudinary antes de subir
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
if (!cloudName) {
  throw new Error('Cloudinary no está configurado correctamente')
}



      // Intentar subir usando el endpoint específico de avatares
      const result = await apiClient.uploadUserAvatar(userId, file)
      
      if (result.success) {
        console.log('Avatar subido exitosamente:', {
          avatarUrl: result.avatarUrl,
          thumbnailUrl: result.thumbnailUrl,
          smallUrl: result.smallUrl,
          mediumUrl: result.mediumUrl,
          largeUrl: result.largeUrl
        })
        
        await fetchAvatarInfo() // Refrescar información
      } else {
        throw new Error(result.message || 'Error al subir avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      
      let errorMessage = 'Error al subir avatar'
      if (error instanceof Error) {
        if (error.message.includes('Invalid cloud_name')) {
          errorMessage = 'Error de configuración de Cloudinary. Contacte al administrador.'
        } else if (error.message.includes('404')) {
          errorMessage = 'Los endpoints de avatares no están disponibles en el backend aún.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleAvatarDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar el avatar?')) return

    try {
      const result = await apiClient.deleteUserAvatar(userId)
      
      if (result.success) {
        await fetchAvatarInfo() // Refrescar información
        console.log('Avatar eliminado exitosamente')
      } else {
        throw new Error(result.message || 'Error al eliminar avatar')
      }
    } catch (error) {
      console.error('Error deleting avatar:', error)
      
      if (error instanceof Error && error.message.includes('404')) {
        alert('La funcionalidad de eliminar avatares no está disponible en el backend aún.')
      } else {
        alert('Error al eliminar avatar: ' + (error as Error).message)
      }
    }
  }

  const getAvatarUrl = () => {
    if (!avatarInfo?.hasAvatar) return undefined
    
    if (optimizedUrls) {
      return optimizedUrls[size] || optimizedUrls.original
    }
    
    return avatarInfo.avatarUrl
  }

  const getInitials = () => {
    const name = avatarInfo?.userName || userName || 'Usuario'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        {showInfo && (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <BackendAvatar
            src={getAvatarUrl()}
            alt={avatarInfo?.userName || userName || 'Avatar del usuario'}
            size={size}
            className={`
              ${size === 'small' ? 'w-12 h-12' : ''}
              ${size === 'medium' ? 'w-16 h-16' : ''}
              ${size === 'large' ? 'w-24 h-24' : ''}
              ${size === 'xlarge' ? 'w-32 h-32' : ''}
            `}
          >
            {getInitials()}
          </BackendAvatar>
          
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {showInfo && (
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {avatarInfo?.userName || userName || 'Usuario'}
            </h3>
            <p className="text-sm text-gray-500">
              {avatarInfo?.userRole || userRole || 'Sin rol'}
            </p>
            
            {avatarInfo?.hasAvatar && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-green-600">
                  {avatarInfo.isCloudinaryAvatar ? '☁️ Cloudinary' : '💾 Local'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {editable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Gestionar Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="flex-1"
              />
              
              {avatarInfo?.hasAvatar && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleAvatarDelete}
                  disabled={uploading}
                >
                  Eliminar
                </Button>
              )}
            </div>

            {uploading && (
              <div className="text-sm text-blue-600">
                Subiendo avatar a Cloudinary...
              </div>
            )}

            {avatarInfo?.isCloudinaryAvatar && optimizedUrls && (
              <div className="text-xs text-gray-500 space-y-1">
                <p>✅ Avatar optimizado disponible en múltiples tamaños:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Miniatura: 50x50px</div>
                  <div>Pequeño: 100x100px</div>
                  <div>Mediano: 200x200px</div>
                  <div>Grande: 400x400px</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* URLs para debugging en desarrollo */}
      {process.env.NODE_ENV === 'development' && avatarInfo?.hasAvatar && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>
              <strong>Avatar URL:</strong>
              <div className="break-all text-gray-600">{avatarInfo.avatarUrl}</div>
            </div>
            
            {optimizedUrls && (
              <div>
                <strong>URLs Optimizadas:</strong>
                <div className="space-y-1 text-gray-600">
                  {Object.entries(optimizedUrls).map(([key, url]) => (
                    <div key={key} className="break-all">
                      <span className="font-medium">{key}:</span> {url as string}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}