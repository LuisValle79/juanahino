"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { BackendImage } from "@/components/BackendImage"
import { UserAvatarManager } from "@/components/UserAvatarManager"
import { UserRole, UserStatus } from "@/types/user"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    especialidad: "",
    estado: "",
    ventas: 0,
    fechaIngreso: "",
  })
  
  const [originalUser, setOriginalUser] = useState<any>(null)

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: ""
  })

  const [avatarUrl, setAvatarUrl] = useState<string>("")

  // Cargar datos del usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = Number(params.id);
        console.log("Cargando usuario con ID:", userId); // Debug log
        
        if (!userId || isNaN(userId)) {
          throw new Error("ID de usuario inválido");
        }
        
        const user = await apiClient.getUserById(userId) as any
        console.log("Usuario cargado:", user); // Debug log
        
        if (user) {
          setOriginalUser(user); // Guardar usuario original
          setFormData({
            nombre: user.nombre || "",
            email: user.email || "",
            telefono: user.telefono || "",
            rol: user.rol || "",
            especialidad: user.especialidad || "",
            estado: user.estado || "",
            ventas: user.ventas || 0,
            fechaIngreso: user.fechaIngreso || "",
          });
          // Manejar avatar_url
          if (user.avatar_url || user.avatarUrl) {
            setAvatarUrl(user.avatar_url || user.avatarUrl);
          }
        } else {
          throw new Error("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error loading user:", error)
        toast({
          title: "Error",
          description: `No se pudo cargar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          variant: "destructive",
        })
        // No redirigir inmediatamente para poder ver el error
        // router.push("/users")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [params.id, router, toast])

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido.",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "El email es requerido.",
        variant: "destructive",
      })
      return
    }

    if (!formData.rol) {
      toast({
        title: "Error",
        description: "El rol es requerido.",
        variant: "destructive",
      })
      return
    }

    if (!formData.estado) {
      toast({
        title: "Error",
        description: "El estado es requerido.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Crear objeto con solo los campos que se pueden actualizar
      const updateData: any = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        rol: formData.rol,
        especialidad: formData.especialidad.trim() || "",
        estado: formData.estado,
        ventas: Number(formData.ventas) || 0,
      }

      // Incluir avatarUrl si se ha actualizado
      if (avatarUrl) {
        updateData.avatarUrl = avatarUrl;
      }

      // Solo agregar password si se proporcionó uno nuevo
      if (passwordData.newPassword && passwordData.newPassword.trim()) {
        updateData.passwordHash = passwordData.newPassword.trim();
      }

      console.log("Usuario original:", originalUser);
      console.log("Datos a enviar con Cloudinary:", updateData);
      
      await apiClient.updateUser(Number(params.id), updateData)
      toast({ 
        title: "Usuario actualizado", 
        description: `${formData.nombre} ha sido actualizado exitosamente.` 
      })
      
      // Agregar un pequeño delay para asegurar que el backend procese la actualización
      setTimeout(() => {
        router.push("/users?refresh=true")
      }, 500)
    } catch (error) {
      console.error("Error completo:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      // Mensaje más específico para el error 400
      if (errorMessage.includes("Bad Request") || errorMessage.includes("400")) {
        toast({
          title: "Error de Actualización",
          description: "El backend no pudo procesar la actualización. Esto puede deberse a un problema de validación en el servidor. Por favor, contacta al administrador del sistema.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: `No se pudo actualizar el usuario: ${errorMessage}`,
          variant: "destructive",
        })
      }
    } finally {
      setIsUploading(false)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Editar Usuario</h1>
              <p className="text-xs text-muted-foreground">Actualizar información del usuario</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input id="nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input id="telefono" type="tel" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
                </div>
              </CardContent>
            </Card>

            {/* Información Profesional */}
            <Card>
              <CardHeader><CardTitle>Información Profesional</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rol">Rol *</Label>
                    <Select value={formData.rol} onValueChange={value => setFormData({ ...formData, rol: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="asesor">Asesor de Ventas</SelectItem>
                        <SelectItem value="mecanico">Mecánico</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={formData.estado} onValueChange={value => setFormData({ ...formData, estado: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Input 
                      id="especialidad" 
                      value={formData.especialidad} 
                      onChange={e => setFormData({ ...formData, especialidad: e.target.value })} 
                      placeholder="Ej: Buses Interurbanos, Camiones, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="ventas">Ventas Realizadas</Label>
                    <Input 
                      id="ventas" 
                      type="number" 
                      value={formData.ventas} 
                      onChange={e => setFormData({ ...formData, ventas: Number(e.target.value) })} 
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cambiar Contraseña */}
            <Card>
              <CardHeader><CardTitle>Cambiar Contraseña</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Deja estos campos vacíos si no deseas cambiar la contraseña
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                    <Input 
                      id="confirmNewPassword" 
                      type="password" 
                      value={passwordData.confirmNewPassword} 
                      onChange={e => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatar con Cloudinary */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar del Usuario</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gestiona el avatar que se almacenará en Cloudinary con optimización automática
                </p>
              </CardHeader>
              <CardContent>
                <UserAvatarManager
                  userId={Number(params.id)}
                  userName={formData.nombre}
                  userRole={formData.rol}
                  size="large"
                  editable={true}
                  showInfo={true}
                />
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Link href="/users">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={isUploading}>
                <Save className="h-4 w-4 mr-2" />
                {isUploading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
