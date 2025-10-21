"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Vehicle, VehicleType, VehicleStatus } from "@/types/vehicle"
import { apiClient } from "@/lib/api"
import { BackendImage } from "@/components/BackendImage"

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    modelo: "",
    tipo: "",
    categoria: "",
    precio: "",
    capacidad: "",
    motor: "",
    año: new Date().getFullYear().toString(),
    estado: "",
    stock: "",
    descripcion: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Load vehicle data
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const vehicle = await apiClient.getVehicleById(parseInt(params.id)) as Vehicle
        
        setFormData({
          modelo: vehicle.modelo || "",
          tipo: vehicle.tipo || "",
          categoria: vehicle.categoria || "",
          precio: vehicle.precio?.toString() || "",
          capacidad: vehicle.capacidad || "",
          motor: vehicle.motor || "",
          año: vehicle.año?.toString() || new Date().getFullYear().toString(),
          estado: vehicle.estado || "",
          stock: vehicle.stock?.toString() || "1",
          descripcion: vehicle.descripcion || "",
        })
        
        // Set existing image preview if available
        console.log('🚗 Vehículo cargado:', vehicle) // Debug log
        console.log('🔍 Claves del vehículo:', Object.keys(vehicle)) // Debug log para ver todas las propiedades
        console.log('🖼️ imagenUrl del vehículo:', (vehicle as any).imagenUrl) // Debug log camelCase
        
        // Usar imagenUrl (camelCase) como devuelve el backend
        const imageUrl = (vehicle as any).imagenUrl
        if (imageUrl) {
          setImagePreview(imageUrl)
          console.log('✅ Imagen preview establecida:', imageUrl) // Debug log
        } else {
          console.log('❌ No hay imagenUrl en el vehículo') // Debug log
          setImagePreview(null) // Limpiar cualquier preview anterior
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el vehículo. Por favor inténtalo de nuevo.",
          variant: "destructive",
        })
        console.error("Error loading vehicle:", error)
        router.push("/fleet")
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [params.id, router, toast])

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview // Return existing image if no new file
    
    try {
      setIsUploading(true)
      
      const formDataImg = new FormData()
      formDataImg.append("file", imageFile)
      
      const uploadRes = await fetch("http://localhost:8080/api/upload", { 
        method: "POST", 
        body: formDataImg 
      })
      
      if (!uploadRes.ok) {
        throw new Error(`Error ${uploadRes.status}: ${uploadRes.statusText}`)
      }
      
      const uploadData = await uploadRes.json()
      
      if (uploadData.success) {
        console.log('📤 Imagen subida exitosamente:', uploadData.url)
        return uploadData.url
      } else {
        throw new Error(uploadData.message || "Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: `No se pudo subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      })
      return imagePreview // Return existing image on error
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Upload image first if a new one was selected
      let imageUrl = imagePreview
      if (imageFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          return // Error already handled in uploadImage
        }
      }
      
      // Convert form data to proper types
      const vehicleData = {
        modelo: formData.modelo,
        tipo: formData.tipo as VehicleType,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio) || 0,
        capacidad: formData.capacidad,
        motor: formData.motor,
        año: parseInt(formData.año) || new Date().getFullYear(),
        estado: formData.estado as VehicleStatus,
        stock: parseInt(formData.stock) || 1,
        descripcion: formData.descripcion,
        imagenUrl: imageUrl || undefined
      }
      
      console.log('💾 Guardando vehículo con imagen_url:', imageUrl) // Debug log
      console.log('📋 Datos completos del vehículo:', vehicleData) // Debug log
      
      await apiClient.updateVehicle(parseInt(params.id), vehicleData)
      
      toast({
        title: "Vehículo actualizado",
        description: `${formData.modelo} ha sido actualizado exitosamente.`,
      })
      
      // Limpiar estado local antes de navegar
      setImagePreview(null)
      setImageFile(null)
      
      router.push("/fleet")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el vehículo. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error updating vehicle:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando vehículo...</p>
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
            <Link href="/fleet">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Editar Vehículo</h1>
              <p className="text-xs text-muted-foreground">Actualizar información del vehículo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo *</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Vehículo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camion">Camión</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ligero">Ligero</SelectItem>
                        <SelectItem value="Mediano">Mediano</SelectItem>
                        <SelectItem value="Pesado">Pesado</SelectItem>
                        <SelectItem value="Urbano">Urbano</SelectItem>
                        <SelectItem value="Interurbano">Interurbano</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="año">Año *</Label>
                    <Input
                      id="año"
                      type="number"
                      min="2020"
                      max="2030"
                      value={formData.año}
                      onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especificaciones Técnicas */}
            <Card>
              <CardHeader>
                <CardTitle>Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motor">Motor *</Label>
                    <Input
                      id="motor"
                      value={formData.motor}
                      onChange={(e) => setFormData({ ...formData, motor: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad *</Label>
                    <Input
                      id="capacidad"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información Comercial */}
            <Card>
              <CardHeader>
                <CardTitle>Información Comercial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (USD) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      min="0"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="reservado">Reservado</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes del Vehículo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <BackendImage 
                        src={imagePreview} 
                        alt="Vista previa" 
                        className="max-h-48 rounded-lg object-contain"
                        fallback="/placeholder.svg"
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
                          Arrastra y suelta imágenes aquí, o haz clic para seleccionar
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={triggerFileInput}
                          disabled={isUploading}
                        >
                          {isUploading ? "Subiendo..." : "Seleccionar Archivos"}
                        </Button>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/fleet">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Guardando..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
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