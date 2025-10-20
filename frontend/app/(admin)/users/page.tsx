"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Shield,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"

export default function UsersManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState<string>("todos")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null)

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await apiClient.getUsers()
        setUsuarios(users as any[])
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        })
        console.error("Error loading users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cumpleBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleRol = filtroRol === "todos" || usuario.rol === filtroRol
    const cumpleEstado = filtroEstado === "todos" || usuario.estado === filtroEstado
    return cumpleBusqueda && cumpleRol && cumpleEstado
  })

  const handleDelete = async () => {
    if (usuarioAEliminar) {
      try {
        await apiClient.deleteUser(usuarioAEliminar.id)
        setUsuarios(usuarios.filter((u) => u.id !== usuarioAEliminar.id))
        toast({
          title: "Usuario eliminado",
          description: `${usuarioAEliminar.nombre} ha sido eliminado del sistema.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario",
          variant: "destructive",
        })
        console.error("Error deleting user:", error)
      } finally {
        setDeleteDialogOpen(false)
        setUsuarioAEliminar(null)
      }
    }
  }

  
  const getRolBadge = (rol: string) => {
    switch (rol) {
      case "admin":
        return (
          <Badge className="bg-purple-500">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
        )
      case "asesor":
        return (
          <Badge className="bg-blue-500">
            <UserCheck className="h-3 w-3 mr-1" />
            Asesor
          </Badge>
        )
      default:
        return <Badge variant="outline">{rol}</Badge>
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-500">Activo</Badge>
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando usuarios...</p>
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
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Gestión de Usuarios</h1>
                <p className="text-xs text-muted-foreground">Administrar asesores y administradores</p>
              </div>
            </div>
          </div>

          <Link href="/users/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Usuario
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Asesores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {usuarios.filter((u) => u.rol === "asesor").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Administradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {usuarios.filter((u) => u.rol === "admin").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {usuarios.filter((u) => u.estado === "activo").length}
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
                    placeholder="Buscar por nombre o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filtroRol} onValueChange={setFiltroRol}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="asesor">Asesores</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios ({usuariosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={usuario.avatar_url || "/placeholder.svg"} alt={usuario.nombre} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {usuario.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{usuario.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            Desde {new Date(usuario.fecha_ingreso).toLocaleDateString("es-PE")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{usuario.email}</div>
                        <div className="text-muted-foreground">{usuario.telefono}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRolBadge(usuario.rol)}</TableCell>
                    <TableCell>{usuario.especialidad}</TableCell>
                    <TableCell>
                      {usuario.rol === "asesor" ? (
                        <Badge variant="outline">{usuario.ventas} ventas</Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push(`/users/detail/${usuario.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push(`/users/edit/${usuario.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setUsuarioAEliminar(usuario)
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

            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron usuarios con los filtros seleccionados.</p>
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
              ¿Estás seguro de que deseas eliminar a {usuarioAEliminar?.nombre}? Esta acción no se puede deshacer y se
              perderá todo el historial asociado.
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
