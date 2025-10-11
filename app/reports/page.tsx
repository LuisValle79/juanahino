"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, Download, Fuel, MapPin, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedReport, setSelectedReport] = useState("overview")

  const reportData = {
    overview: {
      totalVehicles: 247,
      activeVehicles: 198,
      totalKm: 1247890,
      fuelConsumption: 45678,
      maintenanceCost: 125000,
      efficiency: 87.3,
    },
    fuel: {
      totalConsumption: 45678,
      averageEfficiency: 12.5,
      costPerLiter: 4.85,
      totalCost: 221540,
      topEfficient: [
        { vehicle: "HINO-001", efficiency: 15.2 },
        { vehicle: "HINO-045", efficiency: 14.8 },
        { vehicle: "HINO-123", efficiency: 14.1 },
      ],
    },
    maintenance: {
      totalCost: 125000,
      scheduledServices: 45,
      emergencyRepairs: 12,
      averageCostPerVehicle: 506,
      upcomingServices: 23,
    },
  }

  const monthlyData = [
    { month: "Ene", km: 98000, fuel: 3200, cost: 8500 },
    { month: "Feb", km: 105000, fuel: 3400, cost: 9200 },
    { month: "Mar", km: 112000, fuel: 3600, cost: 7800 },
    { month: "Abr", km: 108000, fuel: 3500, cost: 8900 },
    { month: "May", km: 115000, fuel: 3700, cost: 9500 },
    { month: "Jun", km: 120000, fuel: 3900, cost: 10200 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Reportes y Análisis</h1>
                <p className="text-xs text-muted-foreground">HINO Connect</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="90d">90 días</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="fuel">Combustible</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kilómetros Totales</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{reportData.overview.totalKm.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8.2% vs mes anterior
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consumo de Combustible</CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {reportData.overview.fuelConsumption.toLocaleString()} L
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -3.1% vs mes anterior
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Costo de Mantenimiento</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    S/ {reportData.overview.maintenanceCost.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% vs mes anterior
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia Mensual</CardTitle>
                  <CardDescription>Kilómetros recorridos por mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{data.month}</span>
                        <div className="flex-1 mx-4">
                          <Progress value={(data.km / 120000) * 100} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground w-20 text-right">
                          {data.km.toLocaleString()} km
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de la Flota</CardTitle>
                  <CardDescription>Distribución actual de vehículos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Activos</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">198</div>
                        <div className="text-xs text-muted-foreground">80.2%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm">Mantenimiento</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">32</div>
                        <div className="text-xs text-muted-foreground">13.0%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-sm">Inactivos</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">17</div>
                        <div className="text-xs text-muted-foreground">6.8%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fuel Tab */}
          <TabsContent value="fuel" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {reportData.fuel.totalConsumption.toLocaleString()} L
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{reportData.fuel.averageEfficiency} km/L</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Costo por Litro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">S/ {reportData.fuel.costPerLiter}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">S/ {reportData.fuel.totalCost.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vehículos Más Eficientes</CardTitle>
                <CardDescription>Top 3 vehículos con mejor rendimiento de combustible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.fuel.topEfficient.map((vehicle, index) => (
                    <div key={vehicle.vehicle} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                          #{index + 1}
                        </div>
                        <span className="font-medium">{vehicle.vehicle}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{vehicle.efficiency} km/L</div>
                        <div className="text-xs text-muted-foreground">Eficiencia</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    S/ {reportData.maintenance.totalCost.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Servicios Programados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{reportData.maintenance.scheduledServices}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reparaciones de Emergencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{reportData.maintenance.emergencyRepairs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Próximos Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{reportData.maintenance.upcomingServices}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rendimiento</CardTitle>
                <CardDescription>Métricas clave de rendimiento de la flota</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Eficiencia General</span>
                      <span className="text-sm text-muted-foreground">{reportData.overview.efficiency}%</span>
                    </div>
                    <Progress value={reportData.overview.efficiency} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Disponibilidad de Flota</span>
                      <span className="text-sm text-muted-foreground">
                        {((reportData.overview.activeVehicles / reportData.overview.totalVehicles) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(reportData.overview.activeVehicles / reportData.overview.totalVehicles) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cumplimiento de Mantenimiento</span>
                      <span className="text-sm text-muted-foreground">92.5%</span>
                    </div>
                    <Progress value={92.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
