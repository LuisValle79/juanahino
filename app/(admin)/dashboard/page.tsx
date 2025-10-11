"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Truck,
  TrendingUp,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  PieChart,
  ShoppingCart,
  DollarSign,
  Target,
  UserPlus,
  Package,
  FileText,
  Phone,
  MapPin,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { logout } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const salesStats = {
    totalSales: 89,
    monthlyRevenue: 2450000,
    activeLeads: 156,
    inventory: 47,
    conversionRate: 23.5,
  }

  const recentAlerts = [
    { id: 1, type: "Lead Caliente", client: "Transportes Lima SAC", priority: "high", time: "5 min ago" },
    { id: 2, type: "Cotización Vencida", client: "Logística del Sur", priority: "medium", time: "1 hora ago" },
    { id: 3, type: "Seguimiento Pendiente", client: "Cargo Express", priority: "low", time: "2 horas ago" },
    { id: 4, type: "Visita Programada", client: "Transporte Nacional", priority: "high", time: "3 horas ago" },
  ]

  const topSellers = [
    { id: "Carlos Mendoza", sales: 12, revenue: 420000, region: "Lima Norte" },
    { id: "Ana García", sales: 10, revenue: 380000, region: "Callao" },
    { id: "Roberto Silva", sales: 8, revenue: 290000, region: "Lima Sur" },
    { id: "María López", sales: 7, revenue: 245000, region: "Lima Este" },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de ventas y gestión comercial HINO</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{salesStats.totalSales}</div>
            <p className="text-xs text-muted-foreground">+18% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              S/ {(salesStats.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">Meta: S/ 2.8M</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Activos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{salesStats.activeLeads}</div>
            <p className="text-xs text-muted-foreground">+24 nuevos esta semana</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{salesStats.inventory}</div>
            <p className="text-xs text-muted-foreground">Unidades disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{salesStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Leads a ventas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rendimiento de Ventas</CardTitle>
                  <CardDescription>Progreso hacia la meta mensual</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Meta Mensual</span>
                  <span className="text-2xl font-bold text-primary">89/120</span>
                </div>
                <Progress value={(salesStats.totalSales / 120) * 100} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">Camiones</div>
                    <div className="text-sm text-muted-foreground">67 vendidos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">Buses</div>
                    <div className="text-sm text-muted-foreground">22 vendidos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-amber-600">Pendientes</div>
                    <div className="text-sm text-muted-foreground">31 unidades</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Vendedores del Mes</CardTitle>
              <CardDescription>Mejores resultados por región</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellers.map((seller, index) => (
                  <div key={seller.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{seller.id}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {seller.region}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold text-primary">{seller.sales} ventas</div>
                        <div className="text-xs text-muted-foreground">S/ {(seller.revenue / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Alertas de Ventas</CardTitle>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.priority === "high"
                        ? "bg-red-500"
                        : alert.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{alert.type}</div>
                    <div className="text-sm text-muted-foreground">{alert.client}</div>
                    <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/leads/new">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nuevo Lead
                </Button>
              </Link>
              <Link href="/quotes/create">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Crear Cotización
                </Button>
              </Link>
              <Link href="/fleet">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Gestionar Flota
                </Button>
              </Link>
              <Link href="/quotes">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Ver Cotizaciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conectividad</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Excelente</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última Sincronización</span>
                <span className="text-sm text-muted-foreground">Hace 1 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cotizaciones Pendientes</span>
                <span className="text-sm font-medium text-amber-600">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}