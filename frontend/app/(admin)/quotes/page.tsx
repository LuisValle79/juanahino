"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { useQuotes, useActiveAdvisors } from "@/hooks/useApi";
import QuoteService, { Quote } from "@/lib/services/quoteService";
import { User } from "@/types/user";

export default function QuotesManagementPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");

  // Datos desde hooks
  const {
    data: quotes,
    loading: quotesLoading,
    error: quotesError,
    refetch: refetchQuotes,
  } = useQuotes();
  const { data: advisors, loading: advisorsLoading } = useActiveAdvisors();

  // ✅ Asegurar que quotes siempre sea un arreglo
  const quotesList: Quote[] = Array.isArray(quotes) ? quotes : [];

  // 🎯 Filtro con useMemo (optimizado)
  const filteredQuotes = useMemo(() => {
    return quotesList.filter((quote) => {
      const matchesSearch =
        quote.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clienteEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.tipoVehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || quote.estado === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || quote.prioridad === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [quotesList, searchTerm, statusFilter, priorityFilter]);

  // 📤 Asignar asesor
  const handleAssignAdvisor = async () => {
    if (selectedQuote && selectedAdvisor) {
      try {
        await QuoteService.assignAdvisor(selectedQuote.id, parseInt(selectedAdvisor));
        await refetchQuotes();
        toast({
          title: "Asesor asignado",
          description: `Se asignó correctamente el asesor a ${selectedQuote.clienteNombre}`,
        });
        setAssignDialogOpen(false);
        setSelectedQuote(null);
        setSelectedAdvisor("");
      } catch {
        toast({
          title: "Error",
          description: "No se pudo asignar el asesor",
          variant: "destructive",
        });
      }
    }
  };

  // ❌ Eliminar cotización
  const handleDeleteQuote = async () => {
    if (quoteToDelete) {
      try {
        await QuoteService.delete(quoteToDelete.id);
        await refetchQuotes();
        toast({
          title: "Cotización eliminada",
          description: `La cotización de ${quoteToDelete.clienteNombre} fue eliminada.`,
        });
        setDeleteDialogOpen(false);
      } catch {
        toast({
          title: "Error",
          description: "No se pudo eliminar la cotización.",
          variant: "destructive",
        });
      }
    }
  };

  // 🏷️ Badge de estado
  const getStatusBadge = (status: string) => {
    const statusText = QuoteService.getStatusText(status);
    const statusColor = QuoteService.getStatusColor(status);
    const icons = {
      pendiente: Clock,
      en_proceso: AlertCircle,
      completada: CheckCircle,
      cancelada: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return (
      <Badge className={`${statusColor} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {statusText}
      </Badge>
    );
  };

  // 🏷️ Badge de prioridad
  const getPriorityBadge = (priority: string) => {
    const priorityText = QuoteService.getPriorityText(priority);
    const priorityColor = QuoteService.getPriorityColor(priority);
    return <Badge className={priorityColor}>{priorityText}</Badge>;
  };

  // 🕓 Cargando
  if (quotesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Cargando cotizaciones...</p>
      </div>
    );
  }

  // ⚠️ Error
  if (quotesError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Error al cargar cotizaciones
        </h3>
        <p className="text-muted-foreground mb-4">{quotesError}</p>
        <Button onClick={refetchQuotes}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Gestión de Cotizaciones</h1>
                <p className="text-xs text-muted-foreground">
                  Administra solicitudes y asignaciones
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refetchQuotes} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente, email o vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card className="shadow-md border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Cotizaciones ({filteredQuotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
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
                  {filteredQuotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.clienteNombre}</div>
                          <div className="text-sm text-muted-foreground">
                            {quote.clienteEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {QuoteService.getVehicleTypeText(quote.tipoVehiculo)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(quote.estado)}</TableCell>
                      <TableCell>{getPriorityBadge(quote.prioridad)}</TableCell>
                      <TableCell>
                        {quote.asesor ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {quote.asesor.nombre}
                            </div>
                            <div className="text-muted-foreground">
                              {quote.asesor.email}
                            </div>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-600"
                          >
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedQuote(quote);
                                setAssignDialogOpen(true);
                              }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Asignar Asesor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setQuoteToDelete(quote);
                                setDeleteDialogOpen(true);
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
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No se encontraron cotizaciones
                </h3>
                <p className="text-muted-foreground mb-4">
                  Intenta cambiar los filtros o limpiar la búsqueda.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Asesor</DialogTitle>
            <DialogDescription>
              Selecciona un asesor para la cotización de{" "}
              <strong>{selectedQuote?.clienteNombre}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar asesor" />
              </SelectTrigger>
              <SelectContent>
                {advisorsLoading ? (
                  <SelectItem value="" disabled>
                    Cargando asesores...
                  </SelectItem>
                ) : advisors?.length ? (
                  advisors.map((advisor: User) => (
                    <SelectItem
                      key={advisor.id}
                      value={advisor.id.toString()}
                    >
                      {advisor.nombre} — {advisor.email}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No hay asesores disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignAdvisor}
              disabled={!selectedAdvisor || advisorsLoading}
            >
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Deseas eliminar la cotización de{" "}
              <strong>{quoteToDelete?.clienteNombre}</strong>? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuote}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
