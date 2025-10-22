"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Truck,
  TrendingUp,
  Users,
  Bell,
  Filter,
  Download,
  UserPlus,
  Package,
  MessageSquare,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useVehicleStats, useUserStats, useQuoteStats, useUnreadNotificationCount } from "@/hooks/useApi"
import { LoadingSkeleton } from "@/components/ui/loading"
import NotificationIndicator from "@/components/NotificationIndicator"
import ConnectionStatus from "@/components/ConnectionStatus"

export default function DashboardPage() {
  // Hooks para obtener datos de las APIs
  const { data: vehicleStats, loading: vehicleStatsLoading, error: vehicleStatsError } = useVehicleStats()
  const { data: userStats, loading: userStatsLoading } = useUserStats()
  const { data: quoteStats, loading: quoteStatsLoading } = useQuoteStats()
  const { data: unreadCount } = useUnreadNotificationCount()

  // Calcular estadísticas basadas en datos reales de la API
  const dashboardStats = {
    totalVehicles: (vehicleStats && typeof vehicleStats === 'object' && 'total' in vehicleStats) ? vehicleStats.total : 0,
    availableVehicles: (vehicleStats && typeof vehicleStats === 'object') ? 
      (vehicleStats.disponible || vehicleStats.available || 0) : 0,
    reservedVehicles: (vehicleStats && typeof vehicleStats === 'object' && 'reservado' in vehicleStats) ? vehicleStats.reservado : 0,
    soldVehicles: (vehicleStats && typeof vehicleStats === 'object' && 'vendido' in vehicleStats) ? vehicleStats.vendido : 0,
    totalUsers: (userStats && typeof userStats === 'object' && 'total' in userStats) ? userStats.total : 0,
    activeAdvisors: (userStats && typeof userStats === 'object' && 'activeAdvisors' in userStats) ? userStats.activeAdvisors : 0,
    totalQuotes: (quoteStats && typeof quoteStats === 'object' && 'total' in quoteStats) ? quoteStats.total : 0,
    pendingQuotes: (quoteStats && typeof quoteStats === 'object' && 'pendiente' in quoteStats) ? quoteStats.pendiente : 0,
    completedQuotes: (quoteStats && typeof quoteStats === 'object' && 'completada' in quoteStats) ? quoteStats.completada : 0,
    unreadNotifications: unreadCount || 0,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de ventas y gestión comercial HINO</p>
        </div>
        <div className="flex items-center space-x-2">
          <ConnectionStatus showText={false} />
          <NotificationIndicator />
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
            <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {vehicleStatsLoading ? (
              <LoadingSkeleton lines={2} />
            ) : vehicleStatsError ? (
              <div className="text-sm text-destructive">Error al cargar</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">{dashboardStats.totalVehicles}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.availableVehicles} disponibles
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {quoteStatsLoading ? (
              <LoadingSkeleton lines={2} />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{dashboardStats.totalQuotes}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.pendingQuotes} pendientes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {userStatsLoading ? (
              <LoadingSkeleton lines={2} />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.activeAdvisors} asesores activos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {vehicleStatsLoading ? (
              <LoadingSkeleton lines={2} />
            ) : (
              <>
                <div className="text-2xl font-bold text-amber-600">{dashboardStats.availableVehicles}</div>
                <p className="text-xs text-muted-foreground">Unidades disponibles</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardStats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">Sin leer</p>
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
                  <span className="text-sm font-medium">Vehículos Totales</span>
                  <span className="text-2xl font-bold text-primary">{dashboardStats.totalVehicles}</span>
                </div>
                <Progress value={(dashboardStats.totalVehicles / 120) * 100} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">Disponibles</div>
                    <div className="text-sm text-muted-foreground">{dashboardStats.availableVehicles} unidades</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">Cotizaciones</div>
                    <div className="text-sm text-muted-foreground">{dashboardStats.totalQuotes} solicitudes</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-amber-600">Pendientes</div>
                    <div className="text-sm text-muted-foreground">{dashboardStats.pendingQuotes} cotizaciones</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Sistema</CardTitle>
              <CardDescription>Estado actual de usuarios y recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Estadísticas de Usuarios</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalUsers}</div>
                      <div className="text-sm text-muted-foreground">Total Usuarios</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dashboardStats.activeAdvisors}</div>
                      <div className="text-sm text-muted-foreground">Asesores Activos</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/users/add">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </Link>
              <Link href="/fleet/add">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Truck className="w-4 h-4 mr-2" />
                  Agregar Vehículo
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Gestionar Flota
                </Button>
              </Link>
              <Link href="/quotes">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Cotizaciones
                </Button>
              </Link>
              <Link href="/users">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Backend</span>
                <ConnectionStatus showText={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vehículos Disponibles</span>
                <span className="text-sm font-medium text-green-600">
                  {dashboardStats.availableVehicles}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cotizaciones Pendientes</span>
                <span className="text-sm font-medium text-amber-600">
                  {dashboardStats.pendingQuotes}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificaciones</span>
                <span className="text-sm font-medium text-purple-600">
                  {dashboardStats.unreadNotifications} sin leer
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}