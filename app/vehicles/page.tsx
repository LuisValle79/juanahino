"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Truck,
  MapPin,
  Fuel,
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const vehicles = [
    {
      id: "HINO-001",
      model: "HINO 300 Series",
      year: 2023,
      status: "active",
      location: "Lima Centro",
      driver: "Carlos Mendoza",
      fuel: 85,
      mileage: 45678,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      efficiency: 94.2,
      alerts: 0,
    },
    {
      id: "HINO-045",
      model: "HINO 500 Series",
      year: 2022,
      status: "active",
      location: "Callao",
      driver: "Ana Rodriguez",
      fuel: 23,
      mileage: 67890,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      efficiency: 91.8,
      alerts: 1,
    },
    {
      id: "HINO-123",
      model: "HINO 700 Series",
      year: 2021,
      status: "maintenance",
      location: "Taller Central",
      driver: "Luis Vargas",
      fuel: 0,
      mileage: 89123,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-01-25",
      efficiency: 89.5,
      alerts: 2,
    },
    {
      id: "HINO-089",
      model: "HINO 300 Series",
      year: 2023,
      status: "active",
      location: "San Isidro",
      driver: "Maria Torres",
      fuel: 67,
      mileage: 34567,
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-04-08",
      efficiency: 87.1,
      alerts: 1,
    },
    {
      id: "HINO-156",
      model: "HINO 500 Series",
      year: 2022,
      status: "inactive",
      location: "Depósito",
      driver: "No asignado",
      fuel: 45,
      mileage: 78901,
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-04-05",
      efficiency: 92.3,
      alerts: 0,
    },
  ]

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-amber-100 text-amber-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "maintenance":
        return "Mantenimiento"
      case "inactive":
        return "Inactivo"
      default:
        return "Desconocido"
    }
  }

  const getFuelColor = (fuel: number) => {
    if (fuel > 50) return "text-green-600"
    if (fuel > 25) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Gestión de Vehículos</h1>
                <p className="text-xs text-muted-foreground">HINO Connect</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Vehículo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vehículos..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Más Filtros
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vehicles.filter((v) => v.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mantenimiento</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {vehicles.filter((v) => v.status === "maintenance").length}
                  </p>
                </div>
                <Wrench className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Con Alertas</p>
                  <p className="text-2xl font-bold text-red-600">{vehicles.filter((v) => v.alerts > 0).length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                      <CardDescription>
                        {vehicle.model} ({vehicle.year})
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Programar Mantenimiento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(vehicle.status)}>{getStatusText(vehicle.status)}</Badge>
                  {vehicle.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {vehicle.alerts} alerta{vehicle.alerts > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Ubicación</span>
                    </div>
                    <span className="font-medium">{vehicle.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Fuel className={`w-4 h-4 ${getFuelColor(vehicle.fuel)}`} />
                      <span>Combustible</span>
                    </div>
                    <span className={`font-medium ${getFuelColor(vehicle.fuel)}`}>{vehicle.fuel}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span>Eficiencia</span>
                    </div>
                    <span className="font-medium text-primary">{vehicle.efficiency}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conductor</span>
                    <span className="font-medium">{vehicle.driver}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kilometraje</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Próximo mantenimiento</span>
                    <span>{new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron vehículos</h3>
              <p className="text-muted-foreground mb-4">
                No hay vehículos que coincidan con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
