import { useState } from 'react'

interface BackendImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallback?: string
}

export function BackendImage({ src, alt, className, fallback = "/placeholder.svg" }: BackendImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // Si no hay src o hubo error, usar fallback
  if (!src || imageError) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        onError={() => setImageError(true)}
      />
    )
  }
  
  // Determinar la URL correcta de la imagen
  const getImageUrl = (imageSrc: string) => {
    // Obtener la URL base del backend desde las variables de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080'
    
    // Si ya es una URL completa, usarla tal como está
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc
    }
    
    // Si empieza con /uploads/, es del sistema de archivos estáticos (NUEVO)
    if (imageSrc.startsWith('/uploads/')) {
      return `${backendBaseUrl}${imageSrc}`
    }
    
    // Si empieza con /api/vehicles/images/, es del sistema de BD (legacy)
    if (imageSrc.startsWith('/api/vehicles/images/')) {
      return `${backendBaseUrl}${imageSrc}`
    }
    
    // Si es una ruta relativa normal, es del frontend
    if (imageSrc.startsWith('/')) {
      return imageSrc
    }
    
    // Por defecto, asumir que es del backend
    return `${backendBaseUrl}/uploads/${imageSrc}`
  }
  
  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}