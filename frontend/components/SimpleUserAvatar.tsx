import React from 'react'
import { BackendAvatar } from './BackendAvatar'

interface SimpleUserAvatarProps {
  userId: number
  userName: string
  userRole?: string
  avatarUrl?: string | null
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  className?: string
}

export function SimpleUserAvatar({
  userId,
  userName,
  userRole,
  avatarUrl,
  size = 'medium',
  className
}: SimpleUserAvatarProps) {
  
  const getInitials = () => {
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getOptimizedUrl = () => {
    if (!avatarUrl) return null
    
    // Si es de Cloudinary, aplicar optimizaciones
    if (avatarUrl.includes('cloudinary.com')) {
      const sizeMap = {
        'small': 50,
        'medium': 100,
        'large': 200,
        'xlarge': 400
      }
      
      const dimension = sizeMap[size] || 100
      return avatarUrl.replace('/upload/', `/upload/c_fill,w_${dimension},h_${dimension},q_auto,f_auto/`)
    }
    
    return avatarUrl
  }

  return (
    <BackendAvatar
      src={getOptimizedUrl()}
      alt={`Avatar de ${userName}`}
      size={size}
      className={className}
    >
      {getInitials()}
    </BackendAvatar>
  )
}