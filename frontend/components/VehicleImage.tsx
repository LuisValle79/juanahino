import { useState, useEffect } from 'react'
import { BackendImage } from './BackendImage'

interface VehicleImageProps {
  vehicleId?: number
  src?: string | null | undefined
  alt: string
  className?: string
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  fallback?: string
  showPlaceholder?: boolean
}

export function VehicleImage({ 
  vehicleId,
  src, 
  alt, 
  className,
  size = 'medium',
  fallback = "/placeholder-vehicle.svg",
  showPlaceholder = true
}: VehicleImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // Si no hay src y no hay vehicleId, mostrar placeholder
  if (!src && !vehicleId) {
    if (showPlaceholder) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg`}>
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🚛</div>
            <p className="text-sm text-gray-500">Sin imagen</p>
          </div>
        </div>
      )
    }
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
      />
    )
  }
  
  // Si hay error de imagen, mostrar fallback
  if (imageError) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        onError={() => setImageError(true)}
      />
    )
  }
  
  // Usar BackendImage para manejar las URLs correctamente
  return (
    <BackendImage
      src={src}
      alt={alt}
      className={className}
      size={size}
      fallback={fallback}
      optimized={true}
    />
  )
}