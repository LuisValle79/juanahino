"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Truck, Upload, Save } from "lucide-react"
import Link from "next/link"

export default function AddVehiclePage() {
  const [formData, setFormData] = useState({
    vehicleId: "",
    model: "",
    year: "",
    vin: "",
    licensePlate: "",
    driver: "",
    department: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Vehicle data:", formData)
    // Redirect back to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Agregar Nuevo Vehículo</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
              <CardDescription>Completa los datos del nuevo vehículo HINO para agregarlo a tu flota</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">ID del Vehículo *</Label>
                    <Input
                      id="vehicleId"
                      placeholder="HINO-001"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo HINO *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, model: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300-series">Serie 300</SelectItem>
                        <SelectItem value="500-series">Serie 500</SelectItem>
                        <SelectItem value="700-series">Serie 700</SelectItem>
                        <SelectItem value="xl-series">Serie XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Año *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Placa *</Label>
                    <Input
                      id="licensePlate"
                      placeholder="ABC-123"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vin">Número VIN</Label>
                  <Input
                    id="vin"
                    placeholder="1HINO123456789012"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver">Conductor Asignado</Label>
                    <Input
                      id="driver"
                      placeholder="Nombre del conductor"
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logistics">Logística</SelectItem>
                        <SelectItem value="transport">Transporte</SelectItem>
                        <SelectItem value="construction">Construcción</SelectItem>
                        <SelectItem value="delivery">Reparto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Información adicional sobre el vehículo..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Arrastra y suelta imágenes del vehículo aquí</p>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivos
                  </Button>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link href="/dashboard">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Vehículo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
