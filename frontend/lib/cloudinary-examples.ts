// URLs de ejemplo de Cloudinary para usar como fallback cuando el backend no esté disponible
export const CLOUDINARY_EXAMPLES = {
  vehicles: [
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-vehicles/sample-truck-1.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-vehicles/sample-truck-2.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-vehicles/sample-truck-3.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-vehicles/sample-bus-1.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-vehicles/sample-bus-2.jpg"
  ],
  avatars: [
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-1.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-2.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-3.jpg",
    "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-4.jpg"
  ]
}

// Función para obtener una URL de ejemplo aleatoria
export const getRandomCloudinaryExample = (type: 'vehicles' | 'avatars'): string => {
  const examples = CLOUDINARY_EXAMPLES[type]
  return examples[Math.floor(Math.random() * examples.length)]
}

// Función para verificar si una URL es de Cloudinary
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com')
}

// Función para optimizar URLs de Cloudinary
export const optimizeCloudinaryUrl = (url: string, width: number, height: number): string => {
  if (!isCloudinaryUrl(url)) return url
  
  return url.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`)
}