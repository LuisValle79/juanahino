"use client"

import { useState, useEffect } from "react"
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
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Quote } from "@/types/quote-client"

export default function QuotesManagementPage() {
  const { toast } = useToast()
  const [cotizaciones, setCotizaciones] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  // Load quotes from API
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch('/api/quotes')
        if (response.ok) {
          const quotes = await response.json()
          setCotizaciones(quotes)
        } else {
          toast({
            title: "Error",
            description: "No se pudieron cargar las cotizaciones",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las cotizaciones",
          variant: "destructive",
        })
        console.error("Error loading quotes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuotes()
  }, [])

  const cotizacionesFiltradas = cotizaciones.filter((cotizacion) => {
    const cumpleBusqueda =
      cotizacion.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cotizacion.empresa.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleEstado = filtroEstado === "todos" || cotizacion.estado === filtroEstado
    const cumplePrioridad = filtroPrioridad === "todos" || cotizacion.prioridad === filtroPrioridad
    return cumpleBusqueda && cumpleEstado && cumplePrioridad
  })

  const handleAsignarAsesor = async (cotizacionId: number) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'assignAdvisor',
          quoteId: cotizacionId,
          advisorId: 1 // In a real implementation, you would use the current user ID
        }),
      })
      
      if (response.ok) {
        const updatedQuote = await response.json()
        setCotizaciones(
          cotizaciones.map((c) =>
            c.id === cotizacionId ? updatedQuote : c
          )
        )
        toast({
          title: "Asesor asignado",
          description: "La cotización ha sido asignada exitosamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo asignar el asesor",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo asignar el asesor",
        variant: "destructive",
      })
      console.error("Error assigning advisor:", error)
    }
  }

  const handleCambiarEstado = async (cotizacionId: number, nuevoEstado: string) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          quoteId: cotizacionId,
          estado: nuevoEstado
        }),
      })
      
      if (response.ok) {
        const updatedQuote = await response.json()
        setCotizaciones(cotizaciones.map((c) => (c.id === cotizacionId ? updatedQuote : c)))
        toast({
          title: "Estado actualizado",
          description: `La cotización ha sido marcada como ${nuevoEstado}.`,
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
      console.error("Error updating quote status:", error)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-amber-500">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "en-proceso":
        return (
          <Badge className="bg-blue-500">
            <UserPlus className="h-3 w-3 mr-1" />
            En Proceso
          </Badge>
        )
      case "enviada":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Enviada
          </Badge>
        )
      case "cerrada":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Cerrada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return <Badge variant="destructive">Alta</Badge>
      case "media":
        return <Badge className="bg-amber-500">Media</Badge>
      case "baja":
        return <Badge variant="outline">Baja</Badge>
      default:
        return <Badge variant="outline">{prioridad}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando cotizaciones...</p>
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
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Gestión de Cotizaciones</h1>
              <p className="text-xs text-muted-foreground">Administrar solicitudes de cotización</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cotizaciones.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {cotizaciones.filter((c) => c.estado === "pendiente").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {cotizaciones.filter((c) => c.estado === "en-proceso").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {cotizaciones.filter((c) => c.estado === "enviada").length}
              </div>
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
                    placeholder="Buscar por cliente o empresa..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="cerrada">Cerrada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Cotización ({cotizacionesFiltradas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizacionesFiltradas.map((cotizacion) => (
                  <TableRow key={cotizacion.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cotizacion.cliente_nombre}</div>
                        <div className="text-sm text-muted-foreground">{cotizacion.cliente_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{cotizacion.empresa}</TableCell>
                    <TableCell>{cotizacion.tipo_vehiculo}</TableCell>
                    <TableCell>{getPrioridadBadge(cotizacion.prioridad)}</TableCell>
                    <TableCell>{getEstadoBadge(cotizacion.estado)}</TableCell>
                    <TableCell>
                      {cotizacion.asesor_nombre ? (
                        <span className="text-sm">{cotizacion.asesor_nombre}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(cotizacion.created_at).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedQuote(cotizacion)
                              setDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          {!cotizacion.asesor_asignado_id && (
                            <DropdownMenuItem onClick={() => handleAsignarAsesor(cotizacion.id)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Asignar Asesor
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCambiarEstado(cotizacion.id, "en-proceso")}>
                            En Proceso
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(cotizacion.id, "enviada")}>
                            Marcar como Enviada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarEstado(cotizacion.id, "cerrada")}>
                            Cerrar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {cotizacionesFiltradas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron cotizaciones con los filtros seleccionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Cotización</DialogTitle>
            <DialogDescription>Información completa de la solicitud</DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="text-sm font-medium">{selectedQuote.cliente_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="text-sm font-medium">{selectedQuote.empresa}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedQuote.cliente_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                  <p className="text-sm">{selectedQuote.cliente_telefono}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Vehículo</label>
                  <p className="text-sm font-medium">{selectedQuote.tipo_vehiculo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prioridad</label>
                  <div className="mt-1">{getPrioridadBadge(selectedQuote.prioridad)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mensaje</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedQuote.mensaje}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">{getEstadoBadge(selectedQuote.estado)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Asesor Asignado</label>
                  <p className="text-sm mt-1">{selectedQuote.asesor_nombre || "Sin asignar"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Cerrar
            </Button>
            {selectedQuote && !selectedQuote.asesor_asignado_id && (
              <Button
                onClick={() => {
                  handleAsignarAsesor(selectedQuote.id)
                  setDetailDialogOpen(false)
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Asignar Asesor
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}