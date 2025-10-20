'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Award } from "lucide-react"
import { apiClient } from "@/lib/api"

type Advisor = {
  id: number
  nombre: string
  email: string
  telefono: string
  rol: string
  especialidad: string
  estado: string
  ventas: number
  fecha_ingreso: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function AsesoresPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        // Try to fetch from API first
        const data = await apiClient.getActiveAdvisors();
        setAdvisors(data);
      } catch (err) {
        console.error('Error fetching advisors from API:', err);
        
        // Fallback to mock data if API fails
        const mockAdvisors: Advisor[] = [
          {
            id: 1,
            nombre: "Carlos Mendoza",
            email: "carlos.mendoza@hino.com.pe",
            telefono: "+51 999 888 777",
            rol: "asesor",
            especialidad: "Camiones Pesados",
            estado: "activo",
            ventas: 150,
            fecha_ingreso: "2020-03-15",
            avatar_url: "/placeholder-asesor.jpg",
            created_at: "2020-03-15T00:00:00Z",
            updated_at: "2025-01-15T00:00:00Z"
          },
          {
            id: 2,
            nombre: "María González",
            email: "maria.gonzalez@hino.com.pe",
            telefono: "+51 999 777 666",
            rol: "asesor",
            especialidad: "Buses Urbanos",
            estado: "activo",
            ventas: 120,
            fecha_ingreso: "2021-06-20",
            avatar_url: "/placeholder-asesor.jpg",
            created_at: "2021-06-20T00:00:00Z",
            updated_at: "2025-01-15T00:00:00Z"
          },
          {
            id: 3,
            nombre: "Roberto Silva",
            email: "roberto.silva@hino.com.pe",
            telefono: "+51 999 666 555",
            rol: "asesor",
            especialidad: "Camiones Ligeros",
            estado: "activo",
            ventas: 95,
            fecha_ingreso: "2022-01-10",
            avatar_url: "/placeholder-asesor.jpg",
            created_at: "2022-01-10T00:00:00Z",
            updated_at: "2025-01-15T00:00:00Z"
          }
        ];
        
        setAdvisors(mockAdvisors);
        setError('Usando datos de ejemplo (backend no disponible)');
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisors()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Asesores</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Expertos comprometidos en ayudarte a encontrar el vehículo perfecto para tu negocio
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Cargando asesores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Asesores</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Expertos comprometidos en ayudarte a encontrar el vehículo perfecto para tu negocio
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Asesores</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Expertos comprometidos en ayudarte a encontrar el vehículo perfecto para tu negocio
          </p>
        </div>
      </section>

      {/* Asesores Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {advisors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No hay asesores disponibles en este momento.</p>
              <Link href="/public/contacto">
                <Button className="mt-4">Contactar con el equipo</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advisors.map((asesor) => (
                <Card key={asesor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    <img
                      src={asesor.avatar_url || "/placeholder-asesor.jpg"}
                      alt={asesor.nombre}
                      className="w-full h-full object-cover"
                    />
                    {asesor.ventas > 150 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Top Seller
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="text-xl font-bold mb-1">{asesor.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {asesor.rol === 'asesor' ? 'Asesor de Ventas' : 'Asesor Senior de Ventas'}
                    </p>

                    <Badge variant="outline" className="mb-4">
                      {asesor.especialidad}
                    </Badge>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>{asesor.ventas} ventas completadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${asesor.email}`} className="hover:text-primary">
                          {asesor.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${asesor.telefono}`} className="hover:text-primary">
                          {asesor.telefono}
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/public/contacto?asesor=${asesor.id}`}>
                        <Button className="w-full">Contactar</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas asesoría personalizada?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestros expertos están listos para ayudarte a encontrar el vehículo ideal para tu negocio
          </p>
          <Link href="/public/contacto">
            <Button size="lg">Solicitar Cotización</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}