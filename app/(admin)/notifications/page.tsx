"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle, Clock, Truck, Wrench, Fuel, X, Eye, Settings, Search, User, Car, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Notification } from "@/types/notification"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Load notifications from API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const notifications = await response.json()
          setNotifications(notifications)
        } else {
          console.error("Failed to fetch notifications")
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return AlertTriangle
      case "maintenance":
        return Wrench
      case "fuel":
        return Fuel
      case "system":
        return Settings
      case "quote":
        return Bell
      case "user":
        return User
      case "vehicle":
        return Car
      case "sale":
        return DollarSign
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "border-l-red-500 bg-red-50"
      case "media":
        return "border-l-amber-500 bg-amber-50"
      case "baja":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-amber-100 text-amber-800"
      case "baja":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "fuel":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "quote":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "user":
        return "bg-green-100 text-green-800 border-green-200"
      case "vehicle":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "sale":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours > 24) {
      return date.toLocaleDateString()
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`
    } else {
      return "Ahora mismo"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.leido) ||
      (filter === "read" && notification.leido) ||
      notification.tipo === filter

    const matchesSearch =
      searchTerm === "" ||
      notification.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.vehiculo_modelo && notification.vehiculo_modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.quote_cliente && notification.quote_cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.user_nombre && notification.user_nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter((n) => !n.leido).length

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, leido: true } : n
        ))
      } else {
        console.error("Failed to mark notification as read")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
      })
      
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, leido: true })))
      } else {
        console.error("Failed to mark all notifications as read")
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando notificaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Notificaciones</h1>
                <p className="text-xs text-muted-foreground">HINO Connect</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {unreadCount} sin leer
            </Badge>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notificaciones..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Sin leer</SelectItem>
                <SelectItem value="read">Leídas</SelectItem>
                <SelectItem value="alert">Alertas</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="fuel">Combustible</SelectItem>
                <SelectItem value="quote">Cotizaciones</SelectItem>
                <SelectItem value="user">Usuarios</SelectItem>
                <SelectItem value="vehicle">Vehículos</SelectItem>
                <SelectItem value="sale">Ventas</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = getIcon(notification.tipo)
            return (
              <Card
                key={notification.id}
                className={`border-l-4 ${getPriorityColor(notification.prioridad)} ${
                  !notification.leido ? "shadow-md" : "opacity-75"
                } hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          notification.prioridad === "alta"
                            ? "bg-red-100"
                            : notification.prioridad === "media"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            notification.prioridad === "alta"
                              ? "text-red-600"
                              : notification.prioridad === "media"
                                ? "text-amber-600"
                                : "text-blue-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-semibold ${!notification.leido ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.titulo}
                          </h3>
                          {!notification.leido && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>

                        <p className="text-sm text-muted-foreground">{notification.mensaje}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notification.created_at)}</span>
                          </div>
                          {notification.vehiculo_modelo && (
                            <div className="flex items-center space-x-1">
                              <Truck className="w-3 h-3" />
                              <span>{notification.vehiculo_modelo}</span>
                            </div>
                          )}
                          {notification.quote_cliente && (
                            <div className="flex items-center space-x-1">
                              <Bell className="w-3 h-3" />
                              <span>{notification.quote_cliente}</span>
                            </div>
                          )}
                          {notification.user_nombre && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{notification.user_nombre}</span>
                            </div>
                          )}
                          <Badge className={`text-xs ${getPriorityBadge(notification.prioridad)}`}>
                            {notification.prioridad === "alta"
                              ? "Alta"
                              : notification.prioridad === "media"
                                ? "Media"
                                : "Baja"}
                          </Badge>
                          <Badge className={`text-xs border ${getTypeBadge(notification.tipo)}`}>
                            {notification.tipo === "alert" && "Alerta"}
                            {notification.tipo === "maintenance" && "Mantenimiento"}
                            {notification.tipo === "fuel" && "Combustible"}
                            {notification.tipo === "system" && "Sistema"}
                            {notification.tipo === "quote" && "Cotización"}
                            {notification.tipo === "user" && "Usuario"}
                            {notification.tipo === "vehicle" && "Vehículo"}
                            {notification.tipo === "sale" && "Venta"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                        e.stopPropagation()
                        // Handle delete notification
                      }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay notificaciones</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron notificaciones que coincidan con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilter("all")
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {notifications.filter((n) => n.prioridad === "alta" && !n.leido).length}
              </div>
              <div className="text-sm text-muted-foreground">Alertas Críticas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {notifications.filter((n) => n.tipo === "maintenance").length}
              </div>
              <div className="text-sm text-muted-foreground">Mantenimiento</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.filter((n) => n.tipo === "fuel").length}
              </div>
              <div className="text-sm text-muted-foreground">Combustible</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {notifications.filter((n) => n.tipo === "sale").length}
              </div>
              <div className="text-sm text-muted-foreground">Ventas</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}