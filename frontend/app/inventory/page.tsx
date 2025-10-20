"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, Search, Filter, Eye, Edit, Truck, Calendar, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const vehicles = [
    {
      id: "HINO-001",
      type: "Camión Ligero",
      model: "HINO 300 Series 816",
      year: 2024,
      price: 145000,
      status: "disponible",
      location: "Lima Norte",
      features: ["4x2", "Manual", "Diesel"],
      image: "/hino-300-series-truck-white.jpg",
    },
    {
      id: "HINO-002",
      type: "Camión Mediano",
      model: "HINO 500 Series 1024",
      year: 2024,
      price: 185000,
      status: "reservado",
      location: "Callao",
      features: ["4x2", "Automático", "Diesel"],
      image: "/hino-500-series-truck-red.jpg",
    },
    {
      id: "HINO-003",
      type: "Bus Urbano",
      model: "HINO AK1JLTA",
      year: 2024,
      price: 220000,
      status: "disponible",
      location: "Lima Sur",
      features: ["Urbano", "Manual", "Euro V"],
      image: "/hino-urban-bus-white.jpg",
    },
    {
      id: "HINO-004",
      type: "Camión Pesado",
      model: "HINO 700 Series 2848",
      year: 2024,
      price: 285000,
      status: "vendido",
      location: "Lima Este",
      features: ["6x4", "Manual", "Diesel"],
      image: "/hino-700-series-heavy-truck.jpg",
    },
    {
      id: "HINO-005",
      type: "Bus Interprovincial",
      model: "HINO AK1JLTA-VKMD",
      year: 2024,
      price: 320000,
      status: "disponible",
      location: "Lima Norte",
      features: ["Interprovincial", "Automático", "Euro V"],
      image: "/hino-intercity-bus-blue.jpg",
    },
    {
      id: "HINO-006",
      type: "Camión Ligero",
      model: "HINO 300 Series 614",
      year: 2024,
      price: 125000,
      status: "disponible",
      location: "Callao",
      features: ["4x2", "Manual", "Diesel"],
      image: "/hino-300-series-small-truck.jpg",
    },
  ]

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || vehicle.type === filterType
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "reservado":
        return "bg-amber-100 text-amber-800"
      case "vendido":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "disponible":
        return "Disponible"
      case "reservado":
        return "Reservado"
      case "vendido":
        return "Vendido"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Inventario</h1>
                <p className="text-xs text-muted-foreground">Gestión de vehículos disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por modelo o ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Camión Ligero">Camión Ligero</SelectItem>
                    <SelectItem value="Camión Mediano">Camión Mediano</SelectItem>
                    <SelectItem value="Camión Pesado">Camión Pesado</SelectItem>
                    <SelectItem value="Bus Urbano">Bus Urbano</SelectItem>
                    <SelectItem value="Bus Interprovincial">Bus Interprovincial</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Más Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {vehicles.filter((v) => v.status === "disponible").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Disponibles</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">
                      {vehicles.filter((v) => v.status === "reservado").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Reservados</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {vehicles.filter((v) => v.status === "vendido").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Vendidos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-3 right-3 ${getStatusColor(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vehicle.model}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <span>{vehicle.type}</span>
                        <span>•</span>
                        <span>{vehicle.year}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">S/ {vehicle.price.toLocaleString("es-PE")}</div>
                      <div className="text-xs text-muted-foreground">ID: {vehicle.id}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {vehicle.location}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Button>
                      {vehicle.status === "disponible" && (
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron vehículos</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda para encontrar los vehículos que buscas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
