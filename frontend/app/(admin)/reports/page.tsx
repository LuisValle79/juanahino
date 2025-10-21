"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Truck,
  Users,
  FileText,
  Eye,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useToast } from "@/hooks/use-toast"

// Tipos para los reportes
interface ReportData {
  id: string
  name: string
  description: string
  type: 'ventas' | 'inventario' | 'mantenimiento' | 'financiero' | 'operacional'
  lastGenerated: string
  status: 'actualizado' | 'pendiente' | 'error'
  size: string
}

interface SalesMetric {
  period: string
  sales: number
  revenue: number
  vehicles: number
  growth: number
}

interface InventoryMetric {
  category: string
  total: number
  available: number
  reserved: number
  sold: number
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<ReportData[]>([])
  const [salesData, setSalesData] = useState<SalesMetric[]>([])
  const [inventoryData, setInventoryData] = useState<InventoryMetric[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReportType, setSelectedReportType] = useState("all")

  // Cargar datos de ejemplo
  useEffect(() => {
    const loadReportsData = async () => {
      setLoading(true)
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const sampleReports: ReportData[] = [
        {
          id: "sales-monthly",
          name: "Reporte de Ventas Mensual",
          description: "Análisis detallado de ventas del mes actual",
          type: "ventas",
          lastGenerated: "2024-10-20T10:30:00",
          status: "actualizado",
          size: "2.4 MB"
        },
        {
          id: "inventory-status",
          name: "Estado del Inventario",
          description: "Resumen actual del inventario de vehículos",
          type: "inventario",
          lastGenerated: "2024-10-20T08:15:00",
          status: "actualizado",
          size: "1.8 MB"
        },
        {
          id: "maintenance-summary",
          name: "Resumen de Mantenimiento",
          description: "Programaciones y costos de mantenimiento",
          type: "mantenimiento",
          lastGenerated: "2024-10-19T16:45:00",
          status: "pendiente",
          size: "3.1 MB"
        },
        {
          id: "financial-quarterly",
          name: "Reporte Financiero Trimestral",
          description: "Análisis financiero del trimestre",
          type: "financiero",
          lastGenerated: "2024-10-18T14:20:00",
          status: "actualizado",
          size: "4.7 MB"
        },
        {
          id: "operations-weekly",
          name: "Operaciones Semanales",
          description: "Métricas operacionales de la semana",
          type: "operacional",
          lastGenerated: "2024-10-17T09:00:00",
          status: "error",
          size: "1.2 MB"
        }
      ]

      const sampleSalesData: SalesMetric[] = [
        { period: "Enero", sales: 12, revenue: 540000, vehicles: 12, growth: 8.5 },
        { period: "Febrero", sales: 15, revenue: 675000, vehicles: 15, growth: 25.0 },
        { period: "Marzo", sales: 18, revenue: 810000, vehicles: 18, growth: 20.0 },
        { period: "Abril", sales: 14, revenue: 630000, vehicles: 14, growth: -22.2 },
        { period: "Mayo", sales: 20, revenue: 900000, vehicles: 20, growth: 42.9 },
        { period: "Junio", sales: 22, revenue: 990000, vehicles: 22, growth: 10.0 },
      ]

      const sampleInventoryData: InventoryMetric[] = [
        { category: "Camiones Ligeros", total: 25, available: 18, reserved: 4, sold: 3 },
        { category: "Camiones Pesados", total: 15, available: 8, reserved: 3, sold: 4 },
        { category: "Buses Urbanos", total: 12, available: 7, reserved: 2, sold: 3 },
        { category: "Buses Interurbanos", total: 8, available: 5, reserved: 1, sold: 2 },
      ]
      
      setReports(sampleReports)
      setSalesData(sampleSalesData)
      setInventoryData(sampleInventoryData)
      setLoading(false)
    }

    loadReportsData()
  }, [])

  // Filtrar reportes
  const filteredReports = reports.filter((report) => {
    return selectedReportType === "all" || report.type === selectedReportType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actualizado":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-amber-100 text-amber-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "actualizado":
        return "Actualizado"
      case "pendiente":
        return "Pendiente"
      case "error":
        return "Error"
      default:
        return "Desconocido"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ventas":
        return "bg-blue-100 text-blue-800"
      case "inventario":
        return "bg-purple-100 text-purple-800"
      case "mantenimiento":
        return "bg-orange-100 text-orange-800"
      case "financiero":
        return "bg-green-100 text-green-800"
      case "operacional":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "ventas":
        return "Ventas"
      case "inventario":
        return "Inventario"
      case "mantenimiento":
        return "Mantenimiento"
      case "financiero":
        return "Financiero"
      case "operacional":
        return "Operacional"
      default:
        return "Otro"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular métricas generales
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0)
  const averageGrowth = salesData.reduce((sum, item) => sum + item.growth, 0) / salesData.length
  const totalInventory = inventoryData.reduce((sum, item) => sum + item.total, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reportes y Análisis</h1>
            <p className="text-sm text-muted-foreground">Métricas de rendimiento y reportes del negocio</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{averageGrowth.toFixed(1)}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventas Totales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">Este período</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventario Total</p>
                <p className="text-2xl font-bold">{totalInventory}</p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">Vehículos</span>
                </div>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reportes Activos</p>
                <p className="text-2xl font-bold">{reports.length}</p>
                <div className="flex items-center mt-1">
                  <FileText className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">Disponibles</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Ventas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="w-5 h-5" />
              <span>Tendencia de Ventas</span>
            </CardTitle>
            <CardDescription>Evolución de ventas por período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.period}</div>
                    <div className="text-sm text-muted-foreground">{item.sales} vehículos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.revenue)}</div>
                    <div className={`text-sm flex items-center ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {item.growth >= 0 ? '+' : ''}{item.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Estado del Inventario</span>
            </CardTitle>
            <CardDescription>Distribución actual por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">{item.total} total</span>
                  </div>
                  <div className="flex space-x-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(item.available / item.total) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500" 
                      style={{ width: `${(item.reserved / item.total) * 100}%` }}
                    />
                    <div 
                      className="bg-gray-500" 
                      style={{ width: `${(item.sold / item.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Disponible: {item.available}</span>
                    <span>Reservado: {item.reserved}</span>
                    <span>Vendido: {item.sold}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Reportes */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="inventario">Inventario</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="financiero">Financiero</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Reporte</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Última Generación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(report.type)}>
                      {getTypeText(report.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(report.lastGenerated)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusText(report.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{report.size}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron reportes</h3>
              <p className="text-muted-foreground mb-4">
                No hay reportes que coincidan con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReportType("all")
                  setSelectedPeriod("month")
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}