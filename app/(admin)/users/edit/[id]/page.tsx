"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: ""
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Cargar datos del usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        const data = await response.json()
        if (data.success && data.user) {
          const user = data.user
          setFormData({
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            especialidad: user.especialidad,
            estado: user.estado,
          })
          if (user.avatar_url) setImagePreview(user.avatar_url)
        } else {
          throw new Error(data.message || "Error al cargar el usuario")
        }
      } catch (error) {
        console.error("Error loading user:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el usuario.",
          variant: "destructive",
        })
        router.push("/users")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [params.id, router, toast])

  // === MANEJO DE IMAGEN ===
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      let uploadedUrl = imagePreview

      // Subir imagen si hay archivo nuevo
      if (imageFile) {
        const formDataImg = new FormData()
        formDataImg.append("file", imageFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formDataImg })
        const uploadData = await uploadRes.json()
        if (uploadData.success) uploadedUrl = uploadData.url
      }

      const updateData: any = {
        ...formData,
        avatar_url: uploadedUrl || null,
      }

      if (passwordData.newPassword) updateData.password_hash = passwordData.newPassword

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: "Usuario actualizado", description: `${formData.nombre} ha sido actualizado.` })
        router.push("/users")
      } else throw new Error(data.message)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      })
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

            {/* Foto de Perfil */}
            <Card>
              <CardHeader><CardTitle>Foto de Perfil</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Vista previa" className="max-h-48 rounded-lg object-contain" />
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
                      <p className="text-sm text-muted-foreground">
                        Arrastra y suelta una imagen aquí, o haz clic para seleccionar
                      </p>
                      <div className="relative inline-block">
                        <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                          {isUploading ? "Subiendo..." : "Seleccionar Imagen"}
                        </Button>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Link href="/users">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={isUploading}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
