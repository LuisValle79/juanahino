"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Bus, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Vehicle } from "@/types/vehicle"
import loading from "./loading"

export default function FleetManagementPage() {
  const { toast } = useToast()
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<Vehicle | null>(null)

  // Load vehicles from API
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const vehicles = await apiClient.getVehicles()
        setVehiculos(vehicles as any[])
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los vehículos",
          variant: "destructive",
        })
        console.error("Error loading vehicles:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const cumpleBusqueda = vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleTipo = filtroTipo === "todos" || vehiculo.tipo === filtroTipo
    const cumpleEstado = filtroEstado === "todos" || vehiculo.estado === filtroEstado
    return cumpleBusqueda && cumpleTipo && cumpleEstado
  })

  const handleDelete = async () => {
    if (vehiculoAEliminar) {
      try {
        await apiClient.deleteVehicle(vehiculoAEliminar.id)
        setVehiculos(vehiculos.filter((v) => v.id !== vehiculoAEliminar.id))
        toast({
          title: "Vehículo eliminado",
          description: `${vehiculoAEliminar.modelo} ha sido eliminado del inventario.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el vehículo",
          variant: "destructive",
        })
        console.error("Error deleting vehicle:", error)
      } finally {
        setDeleteDialogOpen(false)
        setVehiculoAEliminar(null)
      }
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <Badge className="bg-green-500">Disponible</Badge>
      case "reservado":
        return <Badge className="bg-amber-500">Reservado</Badge>
      case "vendido":
        return <Badge variant="secondary">Vendido</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando flota de vehículos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Gestión de Flota</h1>
              <p className="text-xs text-muted-foreground">Administrar inventario de vehículos</p>
            </div>
          </div>

          <Link href="/fleet/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vehículo
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehiculos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {vehiculos.filter((v) => v.estado === "disponible").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reservados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {vehiculos.filter((v) => v.estado === "reservado").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{vehiculos.reduce((acc, v) => acc + v.stock, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por modelo..."
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

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario de Vehículos ({vehiculosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiculosFiltrados.map((vehiculo) => (
                  <TableRow key={vehiculo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={vehiculo.imagen_url || "/placeholder.svg"}
                          alt={vehiculo.modelo}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{vehiculo.modelo}</div>
                          <div className="text-sm text-muted-foreground">{vehiculo.año}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vehiculo.tipo === "camion" ? (
                          <Truck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bus className="h-4 w-4 text-primary" />
                        )}
                        <span className="capitalize">{vehiculo.tipo}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vehiculo.categoria}</TableCell>
                    <TableCell className="font-medium">${vehiculo.precio.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehiculo.stock} unidades</Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(vehiculo.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/fleet/edit/${vehiculo.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setVehiculoAEliminar(vehiculo)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {vehiculosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron vehículos con los filtros seleccionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar {vehiculoAEliminar?.modelo}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}