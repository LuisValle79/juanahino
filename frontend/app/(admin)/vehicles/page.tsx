"use client"

import { useState, useMemo } from "react"
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
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useVehicles, useVehicleStats } from "@/hooks/useApi"
import { Vehicle, VehicleStats } from "@/types/vehicle"
import VehicleService from "@/lib/services/vehicleService"
import { VehicleImage } from "@/components/VehicleImage"
import { Loading, LoadingCard } from "@/components/ui/loading"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import Link from "next/link"

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch data from backend
  const { data: vehicles, loading: vehiclesLoading, error: vehiclesError, refetch: refetchVehicles } = useVehicles()
  const { data: stats, loading: statsLoading, error: statsError } = useVehicleStats()

  // Filter vehicles based on search and status
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return []
    
    return vehicles.filter((vehicle: Vehicle) => {
      const matchesSearch =
        vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || vehicle.estado === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [vehicles, searchTerm, statusFilter])

  // Usar métodos del servicio
  const getStatusColor = VehicleService.getStatusColor
  const getStatusText = VehicleService.getStatusText
  const formatPrice = VehicleService.formatPrice

  // Show loading state
  if (vehiclesLoading) {
    return <LoadingCard text="Cargando vehículos..." />
  }

  // Show error state
  if (vehiclesError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los vehículos: {vehiclesError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2" 
              onClick={refetchVehicles}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Vehículos</h1>
            <p className="text-sm text-muted-foreground">Administra el inventario de vehículos</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ConnectionStatus />
          <Button onClick={refetchVehicles} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Link href="/fleet/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Vehículo
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
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
                  <SelectItem value="disponible">Disponibles</SelectItem>
                  <SelectItem value="reservado">Reservados</SelectItem>
                  <SelectItem value="vendido">Vendidos</SelectItem>
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
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                {statsLoading ? (
                  <Loading size="sm" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.total || vehicles?.length || 0}</p>
                )}
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                {statsLoading ? (
                  <Loading size="sm" />
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.disponible || vehicles?.filter((v: Vehicle) => v.estado === "disponible").length || 0}
                  </p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reservados</p>
                {statsLoading ? (
                  <Loading size="sm" />
                ) : (
                  <p className="text-2xl font-bold text-amber-600">
                    {stats?.reservado || vehicles?.filter((v: Vehicle) => v.estado === "reservado").length || 0}
                  </p>
                )}
              </div>
              <Wrench className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendidos</p>
                {statsLoading ? (
                  <Loading size="sm" />
                ) : (
                  <p className="text-2xl font-bold text-gray-600">
                    {stats?.vendido || vehicles?.filter((v: Vehicle) => v.estado === "vendido").length || 0}
                  </p>
                )}
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle: Vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              {/* Imagen del vehículo */}
              <div className="mb-4">
                <VehicleImage
                  vehicleId={vehicle.id}
                  src={vehicle.imagenUrl || vehicle.imagen_url}
                  alt={`${vehicle.modelo} - ${vehicle.categoria}`}
                  className="w-full h-48 object-cover rounded-lg"
                  size="medium"
                  showPlaceholder={true}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vehicle.modelo}</CardTitle>
                    <CardDescription>
                      {vehicle.categoria} ({vehicle.año})
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
                      <Link href={`/fleet/edit/${vehicle.id}`} className="flex items-center w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
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
                <Badge className={getStatusColor(vehicle.estado)}>{getStatusText(vehicle.estado)}</Badge>
                <Badge variant="outline" className="text-xs">
                  {vehicle.tipo === 'camion' ? 'Camión' : 'Bus'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span>Precio</span>
                  </div>
                  <span className="font-medium text-primary">{formatPrice(vehicle.precio)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <span>Motor</span>
                  </div>
                  <span className="font-medium">{vehicle.motor}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>Capacidad</span>
                  </div>
                  <span className="font-medium">{vehicle.capacidad}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium">{vehicle.stock} unidades</span>
                </div>

                {vehicle.descripcion && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Descripción:</span>
                    <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                      {vehicle.descripcion}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Creado</span>
                  <span>{new Date(vehicle.created_at).toLocaleDateString()}</span>
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
    </div>
  )
}