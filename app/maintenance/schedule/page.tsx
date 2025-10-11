"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Wrench, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export default function ScheduleMaintenancePage() {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    vehicleId: "",
    maintenanceType: "",
    priority: "",
    description: "",
    estimatedHours: "",
    workshop: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Maintenance scheduled:", { ...formData, date })
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
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Programar Mantenimiento</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Mantenimiento Programado</CardTitle>
              <CardDescription>
                Programa el mantenimiento preventivo o correctivo para tus vehículos HINO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehículo *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HINO-001">HINO-001 - Serie 300</SelectItem>
                        <SelectItem value="HINO-045">HINO-045 - Serie 500</SelectItem>
                        <SelectItem value="HINO-123">HINO-123 - Serie 700</SelectItem>
                        <SelectItem value="HINO-089">HINO-089 - Serie XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType">Tipo de Mantenimiento *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, maintenanceType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventivo</SelectItem>
                        <SelectItem value="corrective">Correctivo</SelectItem>
                        <SelectItem value="inspection">Inspección</SelectItem>
                        <SelectItem value="oil-change">Cambio de Aceite</SelectItem>
                        <SelectItem value="tire-service">Servicio de Llantas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Programada *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Baja
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                            Media
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Alta
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      placeholder="4"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workshop">Taller Asignado</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, workshop: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar taller" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Taller Central</SelectItem>
                        <SelectItem value="norte">Taller Norte</SelectItem>
                        <SelectItem value="sur">Taller Sur</SelectItem>
                        <SelectItem value="external">Taller Externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción del Trabajo</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe los trabajos a realizar..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Recordatorio</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Se enviará una notificación automática 24 horas antes de la fecha programada. Asegúrate de que
                        el vehículo esté disponible en el taller asignado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link href="/dashboard">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Clock className="w-4 h-4 mr-2" />
                    Programar Mantenimiento
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
