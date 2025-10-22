import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api'
import { BackendImage } from './BackendImage'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface VehicleImageUploadProps {
  currentImageUrl?: string
  onImageChange?: (imageUrl: string) => void
  className?: string
  size?: 'thumbnail' | 'small' | 'medium' | 'large'
  showPreview?: boolean
}

export function VehicleImageUpload({
  currentImageUrl,
  onImageChange,
  className,
  size = 'medium',
  showPreview = true
}: VehicleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '')
  const [dragOver, setDragOver] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen debe ser menor a 10MB')
      return
    }

    setUploading(true)
    try {
      // Validar configuración de Cloudinary antes de subir
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName || cloudName === 'dqkdflqyp' || cloudName === 'tu_cloud_name_real') {
        throw new Error('Cloudinary no está configurado correctamente')
      }

      const result = await apiClient.uploadImageToCloudinary(file, 'vehicle')
      
      if (result.success) {
        const newImageUrl = result.url
        setImageUrl(newImageUrl)
        onImageChange?.(newImageUrl)
        
        console.log('Imagen subida a Cloudinary:', {
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          mediumUrl: result.mediumUrl,
          largeUrl: result.largeUrl
        })
      } else {
        throw new Error(result.message || 'Error al subir imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      
      let errorMessage = 'Error al subir imagen'
      if (error instanceof Error) {
        if (error.message.includes('Invalid cloud_name')) {
          errorMessage = 'Error de configuración de Cloudinary. Contacte al administrador.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }, [])

  const handleDeleteImage = async () => {
    if (!imageUrl) return

    try {
      const result = await apiClient.deleteImageFromCloudinary(imageUrl)
      
      if (result.success) {
        setImageUrl('')
        onImageChange?.('')
        console.log('Imagen eliminada de Cloudinary')
      } else {
        throw new Error(result.message || 'Error al eliminar imagen')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error al eliminar imagen: ' + (error as Error).message)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de subida */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">Subiendo imagen a Cloudinary...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <p className="text-sm text-gray-600">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400">
              Formatos soportados: JPG, PNG, WebP (máx. 10MB)
            </p>
          </div>
        )}
        
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="vehicle-image-upload"
          disabled={uploading}
        />
        
        {!uploading && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById('vehicle-image-upload')?.click()}
          >
            Seleccionar Imagen
          </Button>
        )}
      </div>

      {/* Vista previa de la imagen */}
      {showPreview && imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Vista previa:</h4>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteImage}
            >
              Eliminar
            </Button>
          </div>
          
          <div className="relative">
            <BackendImage
              src={imageUrl}
              alt="Vista previa del vehículo"
              size={size}
              className="w-full max-w-md rounded-lg shadow-md"
            />
            
            {/* Información de la imagen */}
            <div className="mt-2 text-xs text-gray-500">
              <p>✅ Imagen alojada en Cloudinary</p>
              <p>🌐 CDN global para carga rápida</p>
              <p>🎨 Optimización automática</p>
            </div>
          </div>
        </div>
      )}

      {/* URL de la imagen (para debugging) */}
      {imageUrl && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 break-all">
          <strong>URL:</strong> {imageUrl}
        </div>
      )}
    </div>
  )
}