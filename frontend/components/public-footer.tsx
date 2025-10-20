import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-hino-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HINO</span>
              </div>
              <div>
                <div className="text-lg font-bold">HINO PERÚ</div>
                <div className="text-xs text-neutral-400">Camiones y Buses</div>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Líderes en venta de camiones y buses comerciales en Perú. Calidad japonesa, servicio peruano.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-hino-red transition-colors flex items-center justify-center"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-hino-red transition-colors flex items-center justify-center"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-hino-red transition-colors flex items-center justify-center"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-hino-red transition-colors flex items-center justify-center"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Catálogo de Vehículos
                </Link>
              </li>
              <li>
                <Link href="/asesores" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Nuestros Asesores
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-neutral-400 hover:text-hino-red transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Productos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Nuestros Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalogo?category=camiones-ligeros"
                  className="text-sm text-neutral-400 hover:text-hino-red transition-colors"
                >
                  Camiones Ligeros
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?category=camiones-medianos"
                  className="text-sm text-neutral-400 hover:text-hino-red transition-colors"
                >
                  Camiones Medianos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?category=camiones-pesados"
                  className="text-sm text-neutral-400 hover:text-hino-red transition-colors"
                >
                  Camiones Pesados
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?category=buses"
                  className="text-sm text-neutral-400 hover:text-hino-red transition-colors"
                >
                  Buses Urbanos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?category=buses"
                  className="text-sm text-neutral-400 hover:text-hino-red transition-colors"
                >
                  Buses Interprovinciales
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-hino-red flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-400">Av. Argentina 2833, Callao, Lima - Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-hino-red flex-shrink-0" />
                <span className="text-sm text-neutral-400">+51 1 614-6400</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-hino-red flex-shrink-0" />
                <span className="text-sm text-neutral-400">ventas@hinoperu.com.pe</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/login">
                <button className="w-full px-4 py-2 bg-hino-red hover:bg-hino-red/90 text-white rounded-lg font-medium transition-colors text-sm">
                  Acceso Intranet
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} HINO Perú. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}