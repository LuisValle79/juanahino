import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BackendAvatarProps {
  src: string | null | undefined
  alt: string
  fallback?: string
  className?: string
  children?: React.ReactNode
}

export function BackendAvatar({ src, alt, fallback, className, children }: BackendAvatarProps) {
  // Determinar la URL correcta de la imagen
  const getImageUrl = (imageSrc: string | null | undefined) => {
    if (!imageSrc) return undefined
    
    // Obtener la URL base del backend desde las variables de entorno
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080'
    
    // Si ya es una URL completa, usarla tal como está
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
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
  
  return (
    <Avatar className={className}>
      <AvatarImage 
        src={getImageUrl(src) || fallback || "/placeholder.svg"} 
        alt={alt} 
      />
      <AvatarFallback>
        {children}
      </AvatarFallback>
    </Avatar>
  )
}