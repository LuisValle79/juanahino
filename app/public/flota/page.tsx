'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Fuel, Calendar, Users } from "lucide-react"

type Vehicle = {
  id: number
  modelo: string
  tipo: string
  categoria: string
  precio: number
  capacidad: string
  motor: string
  año: number
  estado: string
  stock: number
  imagen_url: string | null
  descripcion: string | null
  created_at: string
  updated_at: string
}

export default function FlotaPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/public/vehicles')
        const data = await response.json()
        
        if (data.success) {
          setVehicles(data.vehicles)
        } else {
          setError(data.message || 'Error al cargar los vehículos')
        }
      } catch (err) {
        setError('Error de conexión al cargar los vehículos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Cargando flota de vehículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Flota</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Descubre nuestra amplia gama de vehículos comerciales disponibles para tu negocio
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
              <div className="text-sm text-muted-foreground">Vehículos Disponibles</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {vehicles.filter(v => v.tipo === 'Camión').length}
              </div>
              <div className="text-sm text-muted-foreground">Camiones</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {vehicles.filter(v => v.tipo === 'Bus').length}
              </div>
              <div className="text-sm text-muted-foreground">Buses</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {new Set(vehicles.map(v => v.categoria)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categorías</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No hay vehículos disponibles en este momento.</p>
              <Link href="/contacto">
                <Button className="mt-4">Contactar con un Asesor</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                      src={vehicle.imagen_url || "/placeholder-vehicle.jpg"}
                      alt={vehicle.modelo}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {vehicle.tipo}
                    </Badge>
                  </div>

                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{vehicle.modelo}</h3>
                      <span className="text-lg font-bold text-primary">
                        {vehicle.precio.toLocaleString('es-PE', {
                          style: 'currency',
                          currency: 'PEN'
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {vehicle.descripcion || 'Sin descripción disponible'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.año}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.capacidad}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.categoria}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.motor}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/catalogo/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">Ver Detalles</Button>
                      </Link>
                      <Link href="/contacto" className="flex-1">
                        <Button className="w-full">Cotizar</Button>
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
          <h2 className="text-3xl font-bold mb-4">¿Necesitas un vehículo específico?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestros asesores están listos para ayudarte a encontrar el vehículo perfecto para tu negocio
          </p>
          <Link href="/contacto">
            <Button size="lg">Solicitar Cotización</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}