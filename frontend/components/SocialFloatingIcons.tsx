'use client'

import { MessageCircle, Instagram } from 'lucide-react'

// Componente personalizado para TikTok ya que Lucide no lo tiene
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

interface SocialLink {
  name: string
  icon: React.ReactNode
  url: string
  color: string
  hoverColor: string
}

export function SocialFloatingIcons() {
  const socialLinks: SocialLink[] = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      url: 'https://wa.me/51999888777?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20vehículos%20HINO',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://instagram.com/hinoperu',
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
      hoverColor: 'hover:from-purple-600 hover:via-pink-600 hover:to-orange-500'
    },
    {
      name: 'TikTok',
      icon: <TikTokIcon className="w-5 h-5" />,
      url: 'https://tiktok.com/@hinoperu',
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-4">
      {/* Iconos de redes sociales siempre visibles */}
      {socialLinks.map((social, index) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative w-12 h-12 rounded-full ${social.color} ${social.hoverColor}
            flex items-center justify-center text-white shadow-lg
            transform transition-all duration-300 hover:scale-110 hover:shadow-xl
            animate-in slide-in-from-right-4 fade-in-0
          `}
          style={{ animationDelay: `${index * 150}ms` }}
          title={`Síguenos en ${social.name}`}
        >
          {social.icon}
          
          {/* Tooltip mejorado */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-95 group-hover:scale-100">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-gray-700">
              <span className="font-medium">{social.name}</span>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </div>

          {/* Efecto de ondas al hacer hover */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white animate-ping"></div>
        </a>
      ))}

      {/* Texto pequeño indicativo */}
      <div className="text-xs text-gray-500 font-medium text-center mt-2 opacity-70 hover:opacity-100 transition-opacity">
        Síguenos
      </div>
    </div>
  )
}