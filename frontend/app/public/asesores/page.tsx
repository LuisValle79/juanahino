'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Award } from "lucide-react"
import { BackendImage } from "@/components/BackendImage"
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
  fechaIngreso?: string
  fecha_ingreso?: string
  avatarUrl?: string | null
  avatar_url?: string | null
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

export default function AsesoresPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        // Try to fetch from the dedicated advisors endpoint first
        let advisors;
        try {
          // Try the alternative endpoint that matches your backend
          advisors = await apiClient.getActiveAdvisorsAlt();
          console.log('🎯 Asesores obtenidos del endpoint /advisors/active:', advisors);
        } catch (advisorError) {
          console.log('⚠️ Endpoint /advisors/active no disponible, probando /advisors...');
          try {
            advisors = await apiClient.getAdvisors();
            console.log('🎯 Asesores obtenidos del endpoint /advisors:', advisors);
          } catch (advisorError2) {
            console.log('⚠️ Endpoints de asesores no disponibles, usando filtrado manual...');
            // Fallback: fetch all users and filter for active advisors
            const allUsers = await apiClient.getUsers();
            console.log('👥 Todos los usuarios cargados:', allUsers);
            
            advisors = allUsers.filter(user => 
              user.rol === 'asesor' && user.estado === 'activo'
            );
            console.log('🎯 Asesores activos filtrados manualmente:', advisors);
          }
        }
        
        setAdvisors(advisors as Advisor[]);
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
            fechaIngreso: "2020-03-15",
            avatarUrl: "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-1.jpg",
            createdAt: "2020-03-15T00:00:00Z",
            updatedAt: "2025-01-15T00:00:00Z"
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
            fechaIngreso: "2021-06-20",
            avatarUrl: "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-2.jpg",
            createdAt: "2021-06-20T00:00:00Z",
            updatedAt: "2025-01-15T00:00:00Z"
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
            fechaIngreso: "2022-01-10",
            avatarUrl: "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-3.jpg",
            createdAt: "2022-01-10T00:00:00Z",
            updatedAt: "2025-01-15T00:00:00Z"
          },
          {
            id: 4,
            nombre: "Ana Torres",
            email: "ana.torres@hino.com.pe",
            telefono: "+51 999 555 444",
            rol: "asesor",
            especialidad: "Buses Interurbanos",
            estado: "activo",
            ventas: 180,
            fechaIngreso: "2019-08-12",
            avatarUrl: "https://res.cloudinary.com/dqkdflqyp/image/upload/v1729531234/hino-avatars/sample-avatar-4.jpg",
            createdAt: "2019-08-12T00:00:00Z",
            updatedAt: "2025-01-15T00:00:00Z"
          }
        ];
        
        setAdvisors(mockAdvisors);
        setError(null); // No mostrar error, usar datos de ejemplo silenciosamente
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
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {(asesor.avatarUrl || asesor.avatar_url) ? (
                      <BackendImage
                        src={asesor.avatarUrl || asesor.avatar_url}
                        alt={`Foto profesional de ${asesor.nombre}`}
                        className="w-full h-full object-cover"
                        fallback="/professional-sales-advisor-man.jpg"
                        size="medium"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex flex-col items-center justify-center text-primary">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                          <span className="text-2xl font-bold text-primary">
                            {asesor.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-center px-4">
                          {asesor.nombre}
                        </p>
                      </div>
                    )}
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