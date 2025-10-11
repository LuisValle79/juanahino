"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserPlus, Building, Phone, Mail, MapPin, Truck, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

export default function NewLeadPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    vehicleType: "",
    quantity: "",
    budget: "",
    timeframe: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el lead
    console.log("Nuevo lead creado:", formData)
    // Redirect back to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nuevo Lead</h1>
                <p className="text-xs text-muted-foreground">Registrar prospecto de venta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 mb-8">
            <Badge className="bg-primary text-primary-foreground">
              <UserPlus className="w-3 h-3 mr-1" />
              Información del Lead
            </Badge>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información de la Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-primary" />
                    <span>Información de la Empresa</span>
                  </CardTitle>
                  <CardDescription>Datos básicos del prospecto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                    <Input
                      id="companyName"
                      placeholder="Ej: Transportes Lima SAC"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Persona de Contacto *</Label>
                    <Input
                      id="contactName"
                      placeholder="Nombre completo"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="contacto@empresa.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+51 999 999 999"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Dirección completa de la empresa"
                        className="pl-10 min-h-[80px]"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requerimientos del Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Requerimientos</span>
                  </CardTitle>
                  <CardDescription>Necesidades específicas del cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Tipo de Vehículo *</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camion-ligero">Camión Ligero (3.5T - 7.5T)</SelectItem>
                        <SelectItem value="camion-mediano">Camión Mediano (7.5T - 16T)</SelectItem>
                        <SelectItem value="camion-pesado">Camión Pesado (+16T)</SelectItem>
                        <SelectItem value="bus-urbano">Bus Urbano</SelectItem>
                        <SelectItem value="bus-interprovincial">Bus Interprovincial</SelectItem>
                        <SelectItem value="bus-turistico">Bus Turístico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Presupuesto Estimado</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="budget"
                          placeholder="S/ 150,000"
                          className="pl-10"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Tiempo de Compra</Label>
                    <Select
                      value={formData.timeframe}
                      onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inmediato">Inmediato (1-30 días)</SelectItem>
                        <SelectItem value="corto">Corto plazo (1-3 meses)</SelectItem>
                        <SelectItem value="mediano">Mediano plazo (3-6 meses)</SelectItem>
                        <SelectItem value="largo">Largo plazo (+6 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Información adicional sobre el prospecto..."
                      className="min-h-[100px]"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </Link>
              <div className="flex space-x-3">
                <Button type="button" variant="secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Guardar y Programar Seguimiento
                </Button>
                <Button type="submit">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Lead
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
