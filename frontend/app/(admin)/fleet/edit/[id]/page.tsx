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
import { VehicleImageUpload } from "@/components/VehicleImageUpload"

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
  const [vehicleImageUrl, setVehicleImageUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        
        // Set existing image URL if available
        console.log('🚗 Vehículo cargado:', vehicle)
        
        // Usar imagenUrl (camelCase) como devuelve el backend
        const imageUrl = (vehicle as any).imagenUrl
        if (imageUrl) {
          setVehicleImageUrl(imageUrl)
          console.log('✅ Imagen URL establecida:', imageUrl)
        } else {
          console.log('❌ No hay imagenUrl en el vehículo')
          setVehicleImageUrl("")
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

  const handleImageChange = (imageUrl: string) => {
    setVehicleImageUrl(imageUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.modelo || !formData.tipo || !formData.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
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
        imagenUrl: vehicleImageUrl || undefined
      }
      
      console.log('💾 Actualizando vehículo con Cloudinary:', vehicleData)
      
      await apiClient.updateVehicle(parseInt(params.id), vehicleData)
      
      toast({
        title: "Vehículo actualizado",
        description: `${formData.modelo} ha sido actualizado exitosamente con imagen de Cloudinary.`,
      })
      
      router.push("/fleet")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el vehículo. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error updating vehicle:", error)
    } finally {
      setIsSubmitting(false)
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

            {/* Imágenes con Cloudinary */}
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Vehículo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Actualiza la imagen que se almacenará en Cloudinary con optimización automática
                </p>
              </CardHeader>
              <CardContent>
                <VehicleImageUpload
                  currentImageUrl={vehicleImageUrl}
                  onImageChange={handleImageChange}
                  size="large"
                  showPreview={true}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/fleet">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : (
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