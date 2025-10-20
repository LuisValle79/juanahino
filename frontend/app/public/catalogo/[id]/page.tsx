"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Truck, Bus, Calendar, Fuel, Gauge, Users, Phone, Mail, MapPin } from "lucide-react"
import { Vehicle } from "@/types/vehicle"
import { apiClient } from "@/lib/api"

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        // Fetch vehicle data from API
        const vehicleData = await apiClient.getVehicleById(parseInt(params.id))
        setVehicle(vehicleData)
        
        // Fetch all vehicles to get related ones
        const allVehicles = await apiClient.getVehicles()
        const filteredRelated = allVehicles
          .filter((v: Vehicle) => v.id !== vehicleData.id && v.tipo === vehicleData.tipo)
          .slice(0, 3)
        setRelatedVehicles(filteredRelated)
      } catch (error) {
        console.error("Error loading vehicle:", error)
        router.push('/public/catalogo')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadVehicle()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando detalles del vehículo...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vehículo no encontrado</h2>
          <p className="text-muted-foreground mb-6">Lo sentimos, no pudimos encontrar el vehículo que buscas.</p>
          <Link href="/public/catalogo">
            <Button>Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">Inicio</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/public/catalogo" className="text-muted-foreground hover:text-primary">Catálogo</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-primary">{vehicle.modelo}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 w-full">
                  <img
                    src={vehicle.imagen_url || "/placeholder.svg"}
                    alt={vehicle.modelo}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    {vehicle.estado === "disponible" ? (
                      <Badge className="bg-green-500 text-white">Disponible</Badge>
                    ) : vehicle.estado === "reservado" ? (
                      <Badge className="bg-amber-500 text-white">Reservado</Badge>
                    ) : (
                      <Badge variant="secondary">Vendido</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{vehicle.modelo}</h1>
                    <p className="text-muted-foreground">{vehicle.categoria}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">${vehicle.precio.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Precio</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{vehicle.año}</div>
                    <div className="text-sm text-muted-foreground">Año</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Fuel className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{vehicle.motor}</div>
                    <div className="text-sm text-muted-foreground">Motor</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{vehicle.capacidad}</div>
                    <div className="text-sm text-muted-foreground">Capacidad</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="font-semibold text-2xl text-primary">{vehicle.stock}</div>
                    <div className="text-sm text-muted-foreground">En Stock</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Especificaciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Tipo de Vehículo</h4>
                      <div className="flex items-center gap-2">
                        {vehicle.tipo === "camion" ? (
                          <Truck className="w-5 h-5 text-primary" />
                        ) : (
                          <Bus className="w-5 h-5 text-primary" />
                        )}
                        <span className="capitalize">{vehicle.tipo}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Categoría</h4>
                      <p>{vehicle.categoria}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Capacidad</h4>
                      <p>{vehicle.capacidad}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Motor</h4>
                      <p>{vehicle.motor}</p>
                    </div>
                  </div>
                </div>

                {vehicle.descripcion && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Descripción</h3>
                      <p className="text-muted-foreground">{vehicle.descripcion}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Solicitar Cotización</h3>
                <p className="text-sm text-muted-foreground">Contáctanos para obtener más información</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">Llámanos</div>
                    <div className="text-sm text-muted-foreground">+51 1 234 5678</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">Escríbenos</div>
                    <div className="text-sm text-muted-foreground">ventas@hino.com.pe</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">Visítanos</div>
                    <div className="text-sm text-muted-foreground">Av. Principal 123, Lima</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/public/contacto" className="w-full">
                  <Button className="w-full">Solicitar Cotización</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Vehículos Relacionados</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedVehicles.map((relatedVehicle) => (
                    <Link 
                      key={relatedVehicle.id} 
                      href={`/public/catalogo/${relatedVehicle.id}`}
                      className="block"
                    >
                      <div className="flex gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-16 h-16 rounded overflow-hidden">
                          <img
                            src={relatedVehicle.imagen_url || "/placeholder.svg"}
                            alt={relatedVehicle.modelo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{relatedVehicle.modelo}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{relatedVehicle.categoria}</p>
                          <p className="text-primary font-semibold text-sm">${relatedVehicle.precio.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}