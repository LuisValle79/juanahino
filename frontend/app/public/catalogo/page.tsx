"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Bus, Search, Filter } from "lucide-react"
import { Vehicle } from "@/types/vehicle"
import { apiClient } from "@/lib/api"

export default function CatalogoPage() {
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")

  // Load vehicles from backend API
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        
        // Fetch real data from backend API
        const data = await apiClient.getVehicles()
        setVehiculos(data)
        setError(null)
      } catch (error) {
        console.error("Error loading vehicles:", error)
        
        // Fallback to mock data if API fails
        const mockVehicles = [
          {
            id: 1,
            modelo: "HINO Serie 300",
            tipo: "camion" as const,
            categoria: "Ligero",
            precio: 45000.00,
            capacidad: "3.5 - 5 toneladas",
            motor: "4.0L Diesel",
            año: 2025,
            estado: "disponible" as const,
            stock: 8,
            imagen_url: "/hino-300-series-white-truck.jpg",
            descripcion: "Ideal para distribución urbana y transporte ligero",
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            modelo: "HINO Serie 500",
            tipo: "camion" as const,
            categoria: "Mediano",
            precio: 75000.00,
            capacidad: "8 - 12 toneladas",
            motor: "7.7L Diesel",
            año: 2025,
            estado: "disponible" as const,
            stock: 12,
            imagen_url: "/hino-500-series-red-truck.jpg",
            descripción: "Potencia y eficiencia para tu negocio",
            created_at: new Date(),
            updated_at: new Date()
          }
        ];
        
        setVehiculos(mockVehicles)
        setError("Usando datos de ejemplo (backend no disponible)")
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const cumpleTipo = filtroTipo === "todos" || vehiculo.tipo === filtroTipo
    const cumpleCategoria = filtroCategoria === "todos" || vehiculo.categoria === filtroCategoria
    const cumpleBusqueda = vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleTipo && cumpleCategoria && cumpleBusqueda
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando catálogo de vehículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Vehículos</h1>
          <p className="text-xl max-w-2xl mx-auto">Explora nuestra amplia gama de camiones y buses comerciales</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vehículo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="camion">Camiones</SelectItem>
                <SelectItem value="bus">Buses</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                <SelectItem value="Ligero">Ligero</SelectItem>
                <SelectItem value="Mediano">Mediano</SelectItem>
                <SelectItem value="Pesado">Pesado</SelectItem>
                <SelectItem value="Urbano">Urbano</SelectItem>
                <SelectItem value="Interurbano">Interurbano</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculosFiltrados.map((vehiculo) => (
              <Card key={vehiculo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vehiculo.imagen_url || "/placeholder.svg"}
                    alt={vehiculo.modelo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {vehiculo.estado === "disponible" ? (
                      <Badge className="bg-green-500">Disponible</Badge>
                    ) : vehiculo.estado === "reservado" ? (
                      <Badge className="bg-amber-500">Reservado</Badge>
                    ) : (
                      <Badge variant="secondary">Vendido</Badge>
                    )}
                  </div>
                  <div className="absolute top-2 left-2">
                    {vehiculo.tipo === "camion" ? (
                      <div className="bg-white/90 backdrop-blur p-2 rounded">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur p-2 rounded">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="pt-4">
                  <h3 className="text-xl font-bold mb-2">{vehiculo.modelo}</h3>
                  <Badge variant="outline" className="mb-3">
                    {vehiculo.categoria}
                  </Badge>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Capacidad:</span>
                      <span className="font-medium text-foreground">{vehiculo.capacidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Motor:</span>
                      <span className="font-medium text-foreground">{vehiculo.motor}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-2xl font-bold text-primary">${vehiculo.precio.toLocaleString()}</p>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Link href={`/public/catalogo/${vehiculo.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Link href="/public/contacto" className="flex-1">
                    <Button className="w-full">Cotizar</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {vehiculosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No se encontraron vehículos con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}