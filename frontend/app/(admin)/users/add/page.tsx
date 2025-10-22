"use client"

import type React from "react"
import { useState, useRef } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { UserRole, UserStatus } from "@/types/user"
import { UserAvatarManager } from "@/components/UserAvatarManager"

export default function AddUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    especialidad: "",
    estado: "activo",
    password: "",
    confirmPassword: "",
  })
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdUserId, setCreatedUserId] = useState<number | null>(null)

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.rol || !formData.especialidad || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || "",
        rol: formData.rol as UserRole,
        especialidad: formData.especialidad || "",
        estado: (formData.estado || "activo") as UserStatus,
        passwordHash: formData.password,
        avatarUrl: avatarUrl || undefined,
        ventas: 0,
        fechaIngreso: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      }

      console.log('💾 Creando usuario con avatar de Cloudinary:', userData)

      const data = await apiClient.createUser(userData)

      // Guardar el ID del usuario creado para poder subir avatar después
      if (data && data.id) {
        setCreatedUserId(data.id)
      }

      toast({
        title: "Usuario creado",
        description: `${formData.nombre} ha sido agregado exitosamente con avatar de Cloudinary.`,
      })
      
      router.push("/users")
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el usuario. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-lg font-bold">Agregar Usuario</h1>
              <p className="text-xs text-muted-foreground">
                Registrar nuevo usuario en el sistema
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez García"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan.perez@hino.com.pe"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+51 999 888 777"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información Laboral */}
            <Card>
              <CardHeader>
                <CardTitle>Información Laboral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol *</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value) =>
                        setFormData({ ...formData, rol: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="asesor">Asesor de Ventas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad *</Label>
                    <Select
                      value={formData.especialidad}
                      onValueChange={(value) =>
                        setFormData({ ...formData, especialidad: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Camiones Ligeros">
                          Camiones Ligeros
                        </SelectItem>
                        <SelectItem value="Camiones Medianos">
                          Camiones Medianos
                        </SelectItem>
                        <SelectItem value="Camiones Pesados">
                          Camiones Pesados
                        </SelectItem>
                        <SelectItem value="Buses Urbanos">
                          Buses Urbanos
                        </SelectItem>
                        <SelectItem value="Buses Interurbanos">
                          Buses Interurbanos
                        </SelectItem>
                        <SelectItem value="Buses Premium">
                          Buses Premium
                        </SelectItem>
                        <SelectItem value="Administración">
                          Administración
                        </SelectItem>
                        <SelectItem value="Gerencia">Gerencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) =>
                      setFormData({ ...formData, estado: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Credenciales */}
            <Card>
              <CardHeader>
                <CardTitle>Credenciales de Acceso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
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
                  Sube un avatar que se almacenará en Cloudinary con optimización automática
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        El avatar se podrá subir después de crear el usuario
                      </p>
                      <p className="text-xs text-gray-400">
                        ☁️ Se almacenará en Cloudinary con múltiples tamaños optimizados
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex justify-end gap-4">
              <Link href="/users">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Creando usuario..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
