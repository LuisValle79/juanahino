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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setIsUploading(true)
      // Por ahora, retornamos una URL de placeholder
      // TODO: Implementar upload real cuando el endpoint esté listo
      return "/placeholder-user.jpg"
    } catch (error) {
      console.error("Error uploading image:", error)
      return "/placeholder-user.jpg"
    } finally {
      setIsUploading(false)
    }
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

    try {
      // Upload image first if exists
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) return
      }

      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || null,
        rol: formData.rol,
        especialidad: formData.especialidad || null,
        estado: formData.estado || "activo",
        passwordHash: formData.password,
        avatarUrl: imageUrl || null,
        ventas: 0,
        fechaIngreso: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      }

      const data = await apiClient.createUser(userData)

      // El backend Spring Boot devuelve directamente el objeto User
      toast({
        title: "Usuario creado",
        description: `${formData.nombre} ha sido agregado exitosamente.`,
      })
      router.push("/users")
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el usuario. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
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

            {/* ✅ Foto de Perfil corregida */}
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleImageChange({ target: { files: [file] } } as any)
                  }}
                >
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="max-h-48 rounded-lg object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Arrastra y suelta una imagen aquí, o haz clic para
                          seleccionar
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? "Subiendo..." : "Seleccionar Imagen"}
                        </Button>
                      </div>
                    </div>
                  )}
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
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
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
