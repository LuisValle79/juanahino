"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { apiClient } from "@/lib/api"

export default function AddVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    modelo: "",
    tipo: "",
    categoria: "",
    precio: "",
    capacidad: "",
    motor: "",
    año: new Date().getFullYear().toString(),
    estado: "disponible",
    stock: "1",
    descripcion: "",
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadImageToVehicle = async (vehicleId: number): Promise<string | null> => {
    if (!imageFile) return null
    
    try {
      setIsUploading(true)
      
      // Usar el nuevo endpoint específico para vehículos
      const uploadResult = await apiClient.uploadVehicleImage(vehicleId, imageFile, true) // true = imagen principal
      
      if (uploadResult.success) {
        console.log('📤 Imagen de vehículo subida exitosamente:', uploadResult) // Debug log
        // Retornar la URL de la imagen
        return `/api/vehicles/images/${uploadResult.imageId}`
      } else {
        throw new Error(uploadResult.message || "Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading vehicle image:", error)
      toast({
        title: "Error",
        description: `No se pudo subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Subir imagen primero si existe (método anterior que funcionaba)
      let imageUrl = null
      if (imageFile) {
        try {
          setIsUploading(true)
          
          const formDataImg = new FormData()
          formDataImg.append("file", imageFile)
          
          const uploadRes = await fetch("http://localhost:8080/api/upload", { 
            method: "POST", 
            body: formDataImg 
          })
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            if (uploadData.success) {
              imageUrl = uploadData.url
              console.log('📤 Imagen subida exitosamente:', imageUrl)
            }
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError)
        } finally {
          setIsUploading(false)
        }
      }
      
      // Crear vehículo con imagen_url
      const vehicleData = {
        modelo: formData.modelo,
        tipo: formData.tipo,
        categoria: formData.categoria,
        precio: parseFloat(formData.precio) || 0,
        capacidad: formData.capacidad,
        motor: formData.motor,
        año: parseInt(formData.año) || new Date().getFullYear(),
        estado: formData.estado,
        stock: parseInt(formData.stock) || 1,
        descripcion: formData.descripcion,
        imagenUrl: imageUrl
      }
      
      console.log('💾 Creando vehículo:', vehicleData) // Debug log
      
      await apiClient.createVehicle(vehicleData)
      
      toast({
        title: "Vehículo agregado",
        description: `${formData.modelo} ha sido agregado al inventario exitosamente.`,
      })
      
      // Limpiar estado local antes de navegar
      setImagePreview(null)
      setImageFile(null)
      
      router.push("/fleet")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el vehículo. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error adding vehicle:", error)
    }
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
              <h1 className="text-lg font-bold">Agregar Vehículo</h1>
              <p className="text-xs text-muted-foreground">Registrar nuevo vehículo en el inventario</p>
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
                      placeholder="HINO Serie 300"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Vehículo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
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
                        <SelectValue placeholder="Seleccionar categoría" />
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
                      placeholder="4.0L Diesel"
                      value={formData.motor}
                      onChange={(e) => setFormData({ ...formData, motor: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad *</Label>
                    <Input
                      id="capacidad"
                      placeholder="3.5 - 5 toneladas"
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
                    placeholder="Descripción detallada del vehículo..."
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
                      placeholder="45000"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Inicial *</Label>
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
                          Arrastra y suelta imágenes aquí, o haz clic para seleccionar
                        </p>
                        <div className="relative">
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
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            disabled={isUploading}
                          />
                        </div>
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
                {isUploading ? "Guardando vehículo..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Vehículo
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