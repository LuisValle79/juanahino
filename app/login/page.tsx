"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Set cookie with user data
        const userData = {
          email: data.user.email,
          role: data.user.rol,
          name: data.user.nombre
        }
        
        // Set cookie expiration based on "remember me" option
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
        
        // Set cookie with proper domain and path
        document.cookie = `auth-token=${btoa(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Lax`
        
        // Get redirect URL from query params or default to dashboard
        const urlParams = new URLSearchParams(window.location.search)
        const redirectUrl = urlParams.get('redirect') || '/dashboard'
        
        // Redirect to dashboard
        window.location.href = redirectUrl
      } else {
        alert(`Error de autenticación: ${data.message}`)
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('Hubo un problema al iniciar sesión. Por favor inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder-byu57.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HINO CONNECT</h1>
                <p className="text-gray-200">Tu Hino y tú más conectados que nunca</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Gestión Segura</h3>
                <p className="text-sm text-gray-200">
                  Acceso protegido a toda la información de tu flota con los más altos estándares de seguridad.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Monitoreo en Tiempo Real</h3>
                <p className="text-sm text-gray-200">
                  Supervisa el estado y rendimiento de tus vehículos las 24 horas del día.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Soporte Especializado</h3>
                <p className="text-sm text-gray-200">
                  Equipo técnico especializado disponible para resolver cualquier consulta.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Estadísticas de Ventas</h4>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">247</div>
                <div className="text-xs text-gray-200">Vehículos Vendidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">S/ 8.2M</div>
                <div className="text-xs text-gray-200">Ingresos del Año</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md">
            <CardHeader className="space-y-4 text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-card-foreground">Bienvenido de vuelta</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ingresa tus credenciales para acceder a HINO Connect
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/80 border-border focus:border-ring focus:ring-ring/20 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/80 border-border focus:border-ring focus:ring-ring/20 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Recordarme
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-accent hover:text-accent/80 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  ¿Necesitas acceso?{" "}
                  <Link href="/contact" className="text-accent hover:text-accent/80 font-medium transition-colors">
                    Contacta a soporte
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-center text-xs text-muted-foreground">
                  Al iniciar sesión, aceptas nuestros{" "}
                  <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                    Términos de Servicio
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                    Política de Privacidad
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-200">
              ¿Conoces la nueva aplicación móvil?{" "}
              <Link href="/mobile-app" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Descárgala aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}