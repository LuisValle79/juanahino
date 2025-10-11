"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, BarChart3, CalendarIcon, Download, FileText, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export default function GenerateReportPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportType, setReportType] = useState("")
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [reportFormat, setReportFormat] = useState("pdf")

  const vehicles = [
    { id: "HINO-001", name: "HINO-001 - Serie 300" },
    { id: "HINO-045", name: "HINO-045 - Serie 500" },
    { id: "HINO-123", name: "HINO-123 - Serie 700" },
    { id: "HINO-089", name: "HINO-089 - Serie XL" },
  ]

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId],
    )
  }

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      type: reportType,
      dateFrom,
      dateTo,
      vehicles: selectedVehicles,
      format: reportFormat,
    })
    // Simulate report generation
    alert("Reporte generado exitosamente. Se descargará automáticamente.")
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
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Generar Reporte</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Reporte</CardTitle>
                  <CardDescription>Selecciona los parámetros para generar tu reporte personalizado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tipo de Reporte *</Label>
                    <Select onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de reporte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Rendimiento de Flota</SelectItem>
                        <SelectItem value="maintenance">Historial de Mantenimiento</SelectItem>
                        <SelectItem value="fuel">Consumo de Combustible</SelectItem>
                        <SelectItem value="alerts">Alertas y Notificaciones</SelectItem>
                        <SelectItem value="utilization">Utilización de Vehículos</SelectItem>
                        <SelectItem value="costs">Análisis de Costos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Inicio *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Fin *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Vehículos a Incluir</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-vehicles"
                          checked={selectedVehicles.length === vehicles.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVehicles(vehicles.map((v) => v.id))
                            } else {
                              setSelectedVehicles([])
                            }
                          }}
                        />
                        <Label htmlFor="all-vehicles" className="font-medium">
                          Seleccionar todos los vehículos
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                        {vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={vehicle.id}
                              checked={selectedVehicles.includes(vehicle.id)}
                              onCheckedChange={() => handleVehicleToggle(vehicle.id)}
                            />
                            <Label htmlFor={vehicle.id} className="text-sm">
                              {vehicle.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Salida</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {reportType ? `Reporte de ${reportType}` : "Selecciona un tipo de reporte"}
                    </p>
                    {dateFrom && dateTo && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(dateFrom, "dd/MM/yyyy")} - {format(dateTo, "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vehículos:</span>
                      <span className="font-medium">{selectedVehicles.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Formato:</span>
                      <span className="font-medium uppercase">{reportFormat}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reportes Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <p className="text-sm font-medium">Rendimiento Mensual</p>
                      <p className="text-xs text-muted-foreground">Generado hace 2 días</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <p className="text-sm font-medium">Mantenimiento Q4</p>
                      <p className="text-xs text-muted-foreground">Generado hace 1 semana</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleGenerateReport}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!reportType || !dateFrom || !dateTo || selectedVehicles.length === 0}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
