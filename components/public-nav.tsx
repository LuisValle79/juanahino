"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDropdownEnter = (dropdownName: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current)
      dropdownTimeout.current = null
    }
    setActiveDropdown(dropdownName)
  }

  const handleDropdownLeave = () => {
    // Add a delay before closing the dropdown
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null)
      dropdownTimeout.current = null
    }, 300) // 300ms delay before closing
  }

  return (
    <>
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+5116305000" className="flex items-center gap-2 hover:text-hino-red transition-colors">
                <Phone className="w-4 h-4" />
                <span>(01) 630-5000</span>
              </a>
              <a
                href="mailto:ventas@hinoperu.com.pe"
                className="flex items-center gap-2 hover:text-hino-red transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>ventas@hinoperu.com.pe</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-neutral-400">Horario: Lun - Vie 8:00 AM - 6:00 PM</span>
              <Link
                href="/login"
                className="text-hino-red hover:text-hino-red/80 transition-colors font-medium flex items-center gap-1"
              >
                Acceso Intranet →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`fixed top-0 md:top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg border-b border-neutral-200"
            : "bg-white/95 backdrop-blur-md border-b border-neutral-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-hino-red to-red-700 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-hino-red to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl tracking-tight">H</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-neutral-900 tracking-tight">HINO PERÚ</div>
                <div className="text-xs text-hino-red font-medium">Camiones y Buses Comerciales</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium relative group"
              >
                Inicio
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-hino-red group-hover:w-3/4 transition-all duration-300" />
              </Link>

              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("catalogo")}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/public/catalogo"
                  className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium flex items-center gap-1 group"
                >
                  Catálogo
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </Link>
                {activeDropdown === "catalogo" && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => handleDropdownEnter("catalogo")}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href="/public/catalogo?tipo=camion"
                      className="block px-4 py-3 text-neutral-700 hover:bg-red-50 hover:text-hino-red transition-colors"
                    >
                      <div className="font-medium">Camiones</div>
                      <div className="text-xs text-neutral-500">Serie 300, 500, 700</div>
                    </Link>
                    <Link
                      href="/public/catalogo?tipo=bus"
                      className="block px-4 py-3 text-neutral-700 hover:bg-red-50 hover:text-hino-red transition-colors"
                    >
                      <div className="font-medium">Buses</div>
                      <div className="text-xs text-neutral-500">Urbanos e Interurbanos</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/public/asesores"
                className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium relative group"
              >
                Asesores
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-hino-red group-hover:w-3/4 transition-all duration-300" />
              </Link>

              <Link
                href="/public/nosotros"
                className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium relative group"
              >
                Nosotros
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-hino-red group-hover:w-3/4 transition-all duration-300" />
              </Link>

              <Link
                href="/public/noticias"
                className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium relative group"
              >
                Noticias
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-hino-red group-hover:w-3/4 transition-all duration-300" />
              </Link>

              <Link
                href="/public/contacto"
                className="px-4 py-2 text-neutral-700 hover:text-hino-red hover:bg-red-50 rounded-lg transition-all font-medium relative group"
              >
                Contacto
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-hino-red group-hover:w-3/4 transition-all duration-300" />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/public/contacto">
                <Button
                  variant="outline"
                  className="border-2 border-hino-red text-hino-red hover:bg-hino-red hover:text-white bg-transparent transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                >
                  Solicitar Cotización
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-hino-red to-red-700 hover:from-red-700 hover:to-hino-red text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Intranet
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-50 transition-colors text-neutral-700 hover:text-hino-red"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="lg:hidden py-4 border-t border-neutral-200 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/public/catalogo"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Catálogo
                </Link>
                <Link
                  href="/public/asesores"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Asesores
                </Link>
                <Link
                  href="/public/nosotros"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Nosotros
                </Link>
                <Link
                  href="/public/noticias"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Noticias
                </Link>
                <Link
                  href="/public/contacto"
                  className="text-neutral-700 hover:text-hino-red hover:bg-red-50 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Contacto
                </Link>

                <div className="pt-4 mt-4 border-t border-neutral-200 space-y-3">
                  <a
                    href="tel:+5116305000"
                    className="flex items-center gap-2 text-neutral-600 hover:text-hino-red transition-colors px-4"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(01) 630-5000</span>
                  </a>
                  <a
                    href="mailto:ventas@hinoperu.com.pe"
                    className="flex items-center gap-2 text-neutral-600 hover:text-hino-red transition-colors px-4"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">ventas@hinoperu.com.pe</span>
                  </a>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                  <Link href="/public/contacto" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-hino-red text-hino-red hover:bg-hino-red hover:text-white bg-transparent font-semibold"
                    >
                      Solicitar Cotización
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-hino-red to-red-700 hover:from-red-700 hover:to-hino-red text-white font-semibold">
                      Intranet
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer div adjusted for proper spacing */}
      {/* Total height: 3.5rem (top bar 2rem + py-2(0.5rem*2) on md+) + 5rem (main nav h-20) = 8.5rem on desktop */}
      {/* On mobile: just the main nav 5rem (h-20) */}
      {/* Reduced height to eliminate extra space */}
      <div className="h-20 md:h-20" />
    </>
  )
}