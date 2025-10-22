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
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useQuotes, useActiveAdvisors } from "@/hooks/useApi"
import QuoteService, { Quote } from "@/lib/services/quoteService"
import UserService from "@/lib/services/userService"
import { User } from "@/types/user"


export default function QuotesManagementPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("")

  // Usar hooks para obtener datos de las APIs
  const { data: quotes, loading: quotesLoading, error: quotesError, refetch: refetchQuotes } = useQuotes()
  const { data: advisors, loading: advisorsLoading } = useActiveAdvisors()

  // Filtrar cotizaciones basado en búsqueda y filtros
  const filteredQuotes = quotes?.filter((quote: Quote) => {
    const matchesSearch =
      quote.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clienteEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.tipoVehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quote.estado === statusFilter
    const matchesPriority = priorityFilter === "all" || quote.prioridad === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  }) || []

  // Manejar asignación de asesor
  const handleAssignAdvisor = async () => {
    if (selectedQuote && selectedAdvisor) {
      try {
        await QuoteService.assignAdvisor(selectedQuote.id, parseInt(selectedAdvisor))
        await refetchQuotes()
        toast({
          title: "Asesor asignado",
          description: `Se asignó el asesor a la cotización de ${selectedQuote.clienteNombre}`,
        })
        setAssignDialogOpen(false)
        setSelectedQuote(null)
        setSelectedAdvisor("")
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo asignar el asesor",
          variant: "destructive",
        })
        console.error("Error assigning advisor:", error)
      }
    }
  }

  // Manejar cambio de estado
  const handleChangeStatus = async (quoteId: number, newStatus: string) => {
    try {
      await QuoteService.update(quoteId, { estado: newStatus as any })
      await refetchQuotes()
      toast({
        title: "Estado actualizado",
        description: `La cotización ha sido marcada como ${QuoteService.getStatusText(newStatus)}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
      console.error("Error updating quote status:", error)
    }
  }

  // Manejar eliminación de cotización
  const handleDeleteQuote = async () => {
    if (quoteToDelete) {
      try {
        await QuoteService.delete(quoteToDelete.id)
        await refetchQuotes()
        toast({
          title: "Cotización eliminada",
          description: `La cotización de ${quoteToDelete.clienteNombre} ha sido eliminada`,
        })
        setDeleteDialogOpen(false)
        setQuoteToDelete(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la cotización",
          variant: "destructive",
        })
        console.error("Error deleting quote:", error)
      }
    }
  }

  // Usar métodos del servicio para badges
  const getStatusBadge = (status: string) => {
    const statusText = QuoteService.getStatusText(status)
    const statusColor = QuoteService.getStatusColor(status)
    
    const icons = {
      pendiente: Clock,
      en_proceso: AlertCircle,
      completada: CheckCircle,
      cancelada: XCircle
    }
    
    const Icon = icons[status as keyof typeof icons] || Clock
    
    return (
      <Badge className={statusColor}>
        <Icon className="h-3 w-3 mr-1" />
        {statusText}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityText = QuoteService.getPriorityText(priority)
    const priorityColor = QuoteService.getPriorityColor(priority)
    
    return <Badge className={priorityColor}>{priorityText}</Badge>
  }

  // Estados de carga y error
  if (quotesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando cotizaciones...</p>
        </div>
      </div>
    )
  }

  if (quotesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar cotizaciones</h3>
          <p className="text-muted-foreground mb-4">{quotesError}</p>
          <Button onClick={refetchQuotes}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Gestión de Cotizaciones</h1>
                <p className="text-xs text-muted-foreground">Administrar solicitudes de cotización</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={refetchQuotes} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cotización
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {quotes?.filter((q: Quote) => q.estado === "pendiente").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {quotes?.filter((q: Quote) => q.estado === "en_proceso").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {quotes?.filter((q: Quote) => q.estado === "completada").length || 0}
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
                    placeholder="Buscar por cliente, email o tipo de vehículo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
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
            <CardTitle>Lista de Cotizaciones ({filteredQuotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote: Quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.clienteNombre}</div>
                        <div className="text-sm text-muted-foreground">{quote.clienteEmail}</div>
                        <div className="text-sm text-muted-foreground">{quote.clienteTelefono}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{QuoteService.getVehicleTypeText(quote.tipoVehiculo)}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(quote.estado)}</TableCell>
                    <TableCell>{getPriorityBadge(quote.prioridad)}</TableCell>
                    <TableCell>
                      {quote.asesor ? (
                        <div className="text-sm">
                          <div className="font-medium">{quote.asesor.nombre}</div>
                          <div className="text-muted-foreground">{quote.asesor.email}</div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Sin asignar
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{QuoteService.formatDate(quote.createdAt)}</div>
                        <div className="text-muted-foreground text-xs">
                          {QuoteService.getTimeAgo(quote.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedQuote(quote)
                              setAssignDialogOpen(true)
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Asignar Asesor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setQuoteToDelete(quote)
                              setDeleteDialogOpen(true)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron cotizaciones</h3>
                <p className="text-muted-foreground mb-4">
                  No hay cotizaciones que coincidan con los filtros seleccionados.
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
      </main>

      {/* Assign Advisor Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Asesor</DialogTitle>
            <DialogDescription>
              Selecciona un asesor para la cotización de {selectedQuote?.clienteNombre}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar asesor" />
              </SelectTrigger>
              <SelectContent>
                {advisorsLoading ? (
                  <SelectItem value="" disabled>Cargando asesores...</SelectItem>
                ) : advisors?.length ? (
                  advisors.map((advisor: User) => (
                    <SelectItem key={advisor.id} value={advisor.id.toString()}>
                      {advisor.nombre} - {advisor.email}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No hay asesores disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignAdvisor} disabled={!selectedAdvisor || advisorsLoading}>
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la cotización de {quoteToDelete?.clienteNombre}? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuote}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}