"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Bus, Search, Filter, Eye, Calendar, Fuel, Gauge } from "lucide-react"
import { Vehicle } from "@/types/vehicle"
import { apiClient } from "@/lib/api"
import { BackendImage } from "@/components/BackendImage"
import VehicleService from "@/lib/services/vehicleService"

export default function CatalogoPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState(searchParams.get('tipo') || "all")
  const [statusFilter, setStatusFilter] = useState("disponible")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch vehicles from API
        const data = await apiClient.getVehicles()
        setVehicles(data as Vehicle[])
      } catch (err) {
        console.error('Error fetching vehicles from API:', err)
        setError("No se pudieron cargar los vehículos. El servicio no está disponible.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || vehicle.tipo === typeFilter
    const matchesStatus = statusFilter === "all" || vehicle.estado === statusFilter
    const matchesCategory = categoryFilter === "all" || vehicle.categoria.toLowerCase().includes(categoryFilter.toLowerCase())
    
    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      matchesPrice = vehicle.precio >= min && (max ? vehicle.precio <= max : true)
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesPrice
  })

  const getStatusBadge = (status: string) => {
    const statusText = VehicleService.getStatusText(status)
    const statusColor = VehicleService.getStatusColor(status)
    
    return <Badge className={statusColor}>{statusText}</Badge>
  }

  const formatPrice = VehicleService.formatPrice

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Vehículos</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Descubre nuestra amplia gama de camiones y buses comerciales HINO
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mr-4"></div>
            <p className="text-lg">Cargando vehículos...</p>
          </div>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Vehículos</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Descubre nuestra amplia gama de camiones y buses comerciales HINO
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el catálogo</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
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
          <p className="text-xl max-w-2xl mx-auto">
            Descubre nuestra amplia gama de camiones y buses comerciales HINO
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vehículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de vehículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="camion">Camiones</SelectItem>
                <SelectItem value="bus">Buses</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="liviano">Liviano</SelectItem>
                <SelectItem value="mediano">Mediano</SelectItem>
                <SelectItem value="pesado">Pesado</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="0-50000">Hasta $50,000</SelectItem>
                <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                <SelectItem value="100000-200000">$100,000 - $200,000</SelectItem>
                <SelectItem value="200000">Más de $200,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron vehículos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros para encontrar lo que buscas
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                  setStatusFilter("disponible")
                  setCategoryFilter("all")
                  setPriceRange("all")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <BackendImage
                      src={vehicle.imagenUrl || vehicle.imagen_url}
                      alt={vehicle.modelo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallback="/placeholder.svg"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(vehicle.estado)}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white/90">
                        {vehicle.tipo === "camion" ? (
                          <><Truck className="w-3 h-3 mr-1" />Camión</>
                        ) : (
                          <><Bus className="w-3 h-3 mr-1" />Bus</>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{vehicle.modelo}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.categoria}</p>
                    
                    <div className="text-2xl font-bold text-primary mb-3">
                      {formatPrice(vehicle.precio)}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {vehicle.año}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="w-3 h-3 mr-1" />
                        {vehicle.motor}
                      </div>
                      <div className="flex items-center">
                        <Gauge className="w-3 h-3 mr-1" />
                        {vehicle.capacidad}
                      </div>
                    </div>

                    {vehicle.descripcion && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {vehicle.descripcion}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock: {vehicle.stock}</span>
                      {vehicle.estado === "disponible" && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 space-y-2">
                    <Link href={`/public/catalogo/${vehicle.id}`} className="w-full">
                      <Button className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                    <Link href={`/public/contacto?vehiculo=${vehicle.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Solicitar Cotización
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Nuestros asesores especializados pueden ayudarte a encontrar el vehículo perfecto para tu negocio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public/contacto">
              <Button size="lg" variant="secondary">
                Contactar Asesor
              </Button>
            </Link>
            <Link href="/public/asesores">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Ver Asesores
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}