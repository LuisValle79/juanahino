"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimpleUserAvatar } from "@/components/SimpleUserAvatar"
import { ArrowLeft, Edit, Shield, UserCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await apiClient.getUserById(Number(params.id))
        setUser(user as any)
      } catch (error) {
        console.error("Error loading user:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el usuario. Por favor inténtalo de nuevo.",
          variant: "destructive",
        })
        router.push("/users")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [params.id, router, toast])

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
          <p className="text-muted-foreground">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Usuario no encontrado.</p>
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
            <Link href="/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Detalles del Usuario</h1>
              <p className="text-xs text-muted-foreground">Información detallada del usuario</p>
            </div>
          </div>
          
          <Button onClick={() => router.push(`/users/edit/${user.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Usuario
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <SimpleUserAvatar
                    userId={user.id}
                    userName={user.nombre}
                    userRole={user.rol}
                    avatarUrl={user.avatar_url || user.avatarUrl}
                    size="xlarge"
                  />
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{user.nombre}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{user.telefono || "No especificado"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <div className="font-medium">{getRolBadge(user.rol)}</div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Especialidad</p>
                    <p className="font-medium">{user.especialidad || "No especificada"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <div className="font-medium">{getEstadoBadge(user.estado)}</div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
<p className="font-medium">
  {new Date(user.fechaIngreso || user.fecha_ingreso || Date.now()).toLocaleDateString("es-PE")}
</p>

                  </div>
                  
                  {user.rol === "asesor" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas Realizadas</p>
                      <p className="font-medium">{user.ventas || 0} ventas</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID de Usuario</p>
                  <p className="font-medium">#{user.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Registro</p>
                  <p className="font-medium">
{user.created_at ? (
  <>
    {new Date(user.created_at).toLocaleDateString("es-PE")}{" "}
    {new Date(user.created_at).toLocaleTimeString("es-PE")}
  </>
) : (
  <span className="text-muted-foreground">Sin fecha</span>
)}

                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Última Actualización</p>
                  <p className="font-medium">
{user.created_at ? (
  <>
    {new Date(user.created_at).toLocaleDateString("es-PE")}{" "}
    {new Date(user.created_at).toLocaleTimeString("es-PE")}
  </>
) : (
  <span className="text-muted-foreground">Sin fecha</span>
)}

                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}