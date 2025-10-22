import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface BackendImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallback?: string
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  optimized?: boolean
}

export function BackendImage({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.svg",
  size = 'medium',
  optimized = true
}: BackendImageProps) {
  const [imageError, setImageError] = useState(false)
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Obtener URLs optimizadas para imágenes de Cloudinary
  useEffect(() => {
    if (src && optimized && isCloudinaryUrl(src)) {
      setLoading(true)
      apiClient.getOptimizedImageUrls(src)
        .then(result => {
          if (result.success && result.urls) {
            setOptimizedUrl(result.urls[size] || result.urls.original)
          }
        })
        .catch(error => {
          console.error('Error getting optimized URLs:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [src, size, optimized])
  
  // Verificar si es una URL de Cloudinary
  const isCloudinaryUrl = (url: string) => {
    return url.includes('cloudinary.com')
  }
  
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
    // Si tenemos URL optimizada de Cloudinary, usarla
    if (optimizedUrl && isCloudinaryUrl(imageSrc)) {
      return optimizedUrl
    }
    
    // Obtener la URL base del backend desde las variables de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080'
    
    // Debug log para avatares
    console.log('🖼️ BackendImage Debug:', {
      originalSrc: imageSrc,
      backendBaseUrl,
      isCloudinary: isCloudinaryUrl(imageSrc)
    })
    
    // Si ya es una URL completa (incluyendo Cloudinary), usarla tal como está
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      // Para URLs de Cloudinary, aplicar transformaciones básicas si no está optimizada
      if (isCloudinaryUrl(imageSrc) && !optimized) {
        return applyBasicTransformations(imageSrc, size)
      }
      return imageSrc
    }
    
    // Si empieza con /uploads/, es del sistema de archivos estáticos (legacy)
    if (imageSrc.startsWith('/uploads/')) {
      const finalUrl = `${backendBaseUrl}${imageSrc}`
      console.log('🖼️ URL final para /uploads/:', finalUrl)
      return finalUrl
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
  
  // Aplicar transformaciones básicas a URLs de Cloudinary
  const applyBasicTransformations = (url: string, size: string) => {
    const sizeMap = {
      'thumbnail': 'c_fill,w_150,h_150,q_auto,f_auto',
      'small': 'c_fill,w_300,h_200,q_auto,f_auto',
      'medium': 'c_fill,w_400,h_300,q_auto,f_auto',
      'large': 'c_fill,w_800,h_600,q_auto,f_auto',
      'original': 'q_auto,f_auto'
    }
    
    const transformation = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium
    return url.replace('/upload/', `/upload/${transformation}/`)
  }
  
  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Cargando...</span>
      </div>
    )
  }
  
  const finalImageUrl = getImageUrl(src)
  
  return (
    <img
      src={finalImageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error('🚨 Error cargando imagen:', {
          originalSrc: src,
          finalUrl: finalImageUrl,
          error: e
        })
        setImageError(true)
      }}
      onLoad={() => {
        console.log('✅ Imagen cargada exitosamente:', finalImageUrl)
      }}
    />
  )
}