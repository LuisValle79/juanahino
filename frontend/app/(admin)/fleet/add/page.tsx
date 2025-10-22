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
import { VehicleType, VehicleStatus } from "@/types/vehicle"
import { VehicleImageUpload } from "@/components/VehicleImageUpload"

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
  const [vehicleImageUrl, setVehicleImageUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Crear vehículo con imagen de Cloudinary
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
      
      console.log('💾 Creando vehículo con Cloudinary:', vehicleData)
      
      await apiClient.createVehicle(vehicleData)
      
      toast({
        title: "Vehículo agregado",
        description: `${formData.modelo} ha sido agregado al inventario exitosamente con imagen de Cloudinary.`,
      })
      
      router.push("/fleet")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el vehículo. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error adding vehicle:", error)
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

            {/* Imágenes con Cloudinary */}
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Vehículo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sube una imagen que se almacenará en Cloudinary con optimización automática
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
                {isSubmitting ? "Guardando vehículo..." : (
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