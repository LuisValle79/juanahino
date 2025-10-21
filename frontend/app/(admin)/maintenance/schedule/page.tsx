"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  RefreshCw,
  Truck,
  User,
  MapPin,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Tipos para el mantenimiento
interface MaintenanceSchedule {
  id: number
  vehicleId: number
  vehicleModel: string
  vehiclePlate: string
  maintenanceType: string
  scheduledDate: string
  status: 'programado' | 'en-progreso' | 'completado' | 'vencido'
  priority: 'baja' | 'media' | 'alta' | 'critica'
  technician?: string
  estimatedDuration: number // en horas
  description: string
  lastMaintenance?: string
  nextMaintenance?: string
  createdAt: string
}

export default function MaintenanceSchedulePage() {
  const { toast } = useToast()
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Datos de ejemplo para el mantenimiento
  useEffect(() => {
    const loadMaintenanceData = async () => {
      setLoading(true)
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const sampleData: MaintenanceSchedule[] = [
        {
          id: 1,
          vehicleId: 1,
          vehicleModel: "HINO Serie 300",
          vehiclePlate: "ABC-123",
          maintenanceType: "Mantenimiento Preventivo",
          scheduledDate: "2024-11-15T09:00:00",
          status: "programado",
          priority: "media",
          technician: "Carlos Mendoza",
          estimatedDuration: 4,
          description: "Cambio de aceite, filtros y revisión general del motor",
          lastMaintenance: "2024-08-15",
          nextMaintenance: "2025-02-15",
          createdAt: "2024-10-20T10:00:00"
        },
        {
          id: 2,
          vehicleId: 2,
          vehicleModel: "HINO Serie 500",
          vehiclePlate: "DEF-456",
          maintenanceType: "Reparación de Frenos",
          scheduledDate: "2024-10-22T14:00:00",
          status: "en-progreso",
          priority: "alta",
          technician: "Ana García",
          estimatedDuration: 6,
          description: "Reemplazo de pastillas de freno y revisión del sistema hidráulico",
          lastMaintenance: "2024-07-20",
          nextMaintenance: "2025-01-20",
          createdAt: "2024-10-18T15:30:00"
        },
        {
          id: 3,
          vehicleId: 3,
          vehicleModel: "HINO Liesse",
          vehiclePlate: "GHI-789",
          maintenanceType: "Inspección Técnica",
          scheduledDate: "2024-10-18T08:00:00",
          status: "vencido",
          priority: "critica",
          estimatedDuration: 2,
          description: "Inspección técnica vehicular obligatoria",
          lastMaintenance: "2024-04-18",
          nextMaintenance: "2025-04-18",
          createdAt: "2024-10-15T12:00:00"
        },
        {
          id: 4,
          vehicleId: 4,
          vehicleModel: "HINO Blue Ribbon",
          vehiclePlate: "JKL-012",
          maintenanceType: "Mantenimiento Correctivo",
          scheduledDate: "2024-10-19T11:00:00",
          status: "completado",
          priority: "media",
          technician: "Luis Rodriguez",
          estimatedDuration: 8,
          description: "Reparación del sistema de aire acondicionado",
          lastMaintenance: "2024-10-19",
          nextMaintenance: "2025-01-19",
          createdAt: "2024-10-16T09:15:00"
        },
        {
          id: 5,
          vehicleId: 5,
          vehicleModel: "Nissan Frontier",
          vehiclePlate: "MNO-345",
          maintenanceType: "Cambio de Neumáticos",
          scheduledDate: "2024-11-01T10:00:00",
          status: "programado",
          priority: "baja",
          technician: "María López",
          estimatedDuration: 3,
          description: "Reemplazo de neumáticos delanteros y balanceado",
          lastMaintenance: "2024-05-01",
          nextMaintenance: "2025-05-01",
          createdAt: "2024-10-19T14:20:00"
        }
      ]
      
      setSchedules(sampleData)
      setLoading(false)
    }

    loadMaintenanceData()
  }, [])

  // Filtrar programaciones
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.technician?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter
    const matchesPriority = priorityFilter === "all" || schedule.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programado":
        return "bg-blue-100 text-blue-800"
      case "en-progreso":
        return "bg-amber-100 text-amber-800"
      case "completado":
        return "bg-green-100 text-green-800"
      case "vencido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "baja":
        return "bg-gray-100 text-gray-800"
      case "media":
        return "bg-blue-100 text-blue-800"
      case "alta":
        return "bg-amber-100 text-amber-800"
      case "critica":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "programado":
        return "Programado"
      case "en-progreso":
        return "En Progreso"
      case "completado":
        return "Completado"
      case "vencido":
        return "Vencido"
      default:
        return "Desconocido"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "baja":
        return "Baja"
      case "media":
        return "Media"
      case "alta":
        return "Alta"
      case "critica":
        return "Crítica"
      default:
        return "Desconocida"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Estadísticas
  const stats = {
    total: schedules.length,
    programado: schedules.filter(s => s.status === 'programado').length,
    enProgreso: schedules.filter(s => s.status === 'en-progreso').length,
    completado: schedules.filter(s => s.status === 'completado').length,
    vencido: schedules.filter(s => s.status === 'vencido').length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Programación de Mantenimiento</h1>
            <p className="text-sm text-muted-foreground">Gestiona el mantenimiento preventivo y correctivo de la flota</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Programar Mantenimiento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.programado}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-amber-600">{stats.enProgreso}</p>
              </div>
              <Wrench className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">{stats.completado}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.vencido}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por vehículo, placa o técnico..."
                  className="pl-10 w-80"
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
                  <SelectItem value="programado">Programados</SelectItem>
                  <SelectItem value="en-progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completados</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
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

      {/* Maintenance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Programaciones de Mantenimiento ({filteredSchedules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Tipo de Mantenimiento</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{schedule.vehicleModel}</div>
                        <div className="text-sm text-muted-foreground">{schedule.vehiclePlate}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{schedule.maintenanceType}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {schedule.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(schedule.scheduledDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(schedule.status)}>
                      {getStatusText(schedule.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(schedule.priority)}>
                      {getPriorityText(schedule.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {schedule.technician ? (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{schedule.technician}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{schedule.estimatedDuration}h</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Reprogramar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Completado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron programaciones</h3>
              <p className="text-muted-foreground mb-4">
                No hay programaciones de mantenimiento que coincidan con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}