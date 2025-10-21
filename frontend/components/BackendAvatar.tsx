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
    
    // Si ya es una URL completa, usarla tal como está
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc
    }
    
    // Si empieza con /uploads/, es del backend
    if (imageSrc.startsWith('/uploads/')) {
      return `http://localhost:8080${imageSrc}`
    }
    
    // Si es una ruta relativa normal, es del frontend
    if (imageSrc.startsWith('/')) {
      return imageSrc
    }
    
    // Por defecto, asumir que es del backend
    return `http://localhost:8080/uploads/${imageSrc}`
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