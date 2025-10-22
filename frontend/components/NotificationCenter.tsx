"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  RefreshCw,
  Trash2,
  Filter,
  X,
} from "lucide-react"
import { useNotifications, useUnreadNotificationCount } from "@/hooks/useApi"
import NotificationService, { Notification } from "@/lib/services/notificationService"
import BackendErrorFallback from "./BackendErrorFallback"
import { useToast } from "@/hooks/use-toast"

export interface NotificationCenterProps {
  className?: string
  showHeader?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  // Props para dropdown compacto
  isDropdownOpen?: boolean
  onNotificationUpdate?: () => void
  // Props para modal
  isOpen?: boolean
  onClose?: () => void
  mode?: "dropdown" | "modal"
}

export function NotificationCenter({
  className,
  showHeader = true,
  autoRefresh = true,
  refreshInterval = 30000,
  isDropdownOpen = false,
  onNotificationUpdate,
  isOpen = false,
  onClose,
  mode = "dropdown",
}: NotificationCenterProps) {
  const { toast } = useToast()
  const [filterPriority] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const { data: notifications, loading, error, refetch } = useNotifications()
  const { data: unreadCount, refetch: refetchUnreadCount } = useUnreadNotificationCount()

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch()
        refetchUnreadCount()
      }, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, refetch, refetchUnreadCount])

  // Filtrar y ordenar notificaciones
  const filteredNotifications: Notification[] = Array.isArray(notifications)
    ? notifications
        .filter((n) => (filterPriority === "all" || n.prioridad === filterPriority) && (!showUnreadOnly || !n.leido))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : []

  // Acciones
  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id)
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
    } catch {
      toast({ title: "Error", description: "No se pudo marcar la notificación como leída", variant: "destructive" })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead()
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
      toast({ title: "Notificaciones actualizadas", description: "Todas las notificaciones han sido marcadas como leídas" })
    } catch {
      toast({ title: "Error", description: "No se pudieron marcar todas las notificaciones como leídas", variant: "destructive" })
    }
  }

  const handleDeleteNotification = async (id: number) => {
    try {
      await NotificationService.delete(id)
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
      toast({ title: "Notificación eliminada", description: "La notificación ha sido eliminada exitosamente" })
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la notificación", variant: "destructive" })
    }
  }

  const getTypeBadge = (type: string) => {
    const typeText = NotificationService.getTypeText(type)
    const typeColor = NotificationService.getTypeColor(type)
    return (
      <Badge className={`${typeColor} text-xs`}>
        {NotificationService.getTypeIcon(type)} {typeText}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const text = NotificationService.getPriorityText(priority)
    const color = NotificationService.getPriorityColor(priority)
    return <Badge className={`${color} text-xs`}>{text}</Badge>
  }

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Fecha inválida"
    return date.toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const diffMs = new Date().getTime() - date.getTime()
    const minutes = Math.floor(diffMs / (1000 * 60))
    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return `${Math.floor(days / 7)} sem`
  }

  // Loader
  if (loading)
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )

  // Error
  if (error)
    return (
      <div className={className}>
        <BackendErrorFallback error={error} onRetry={refetch} title="Error al cargar notificaciones" description="No se pudieron cargar las notificaciones" />
      </div>
    )

  // Render dropdown compacto
  const renderDropdownContent = () => (
    <div className="w-80 max-h-[32rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-900">Notificaciones</span>
          {(unreadCount || 0) > 0 && <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700">{unreadCount}</Badge>}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setShowUnreadOnly(!showUnreadOnly)} className="h-7 w-7 p-0" title={showUnreadOnly ? "Mostrar todas" : "Solo no leídas"}>
            <Filter className="h-3 w-3" />
          </Button>
          {(unreadCount || 0) > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-7 w-7 p-0" title="Marcar todas como leídas">
              <CheckCheck className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={refetch} className="h-7 w-7 p-0" title="Actualizar">
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Lista */}
      <ScrollArea className="max-h-[28rem]">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2" />
            {showUnreadOnly ? "No hay notificaciones sin leer" : "No hay notificaciones"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 hover:bg-gray-50 transition-all duration-200 ${!notification.leido ? 'bg-blue-50/50 border-l-2 border-l-blue-400' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${!notification.leido ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{notification.titulo}</h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.leido && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="h-6 w-6 p-0" title="Marcar como leída">
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)} className="h-6 w-6 p-0" title="Eliminar">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{notification.mensaje}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getTypeBadge(notification.tipo)}
                        {notification.prioridad !== "normal" && getPriorityBadge(notification.prioridad)}
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {formatNotificationDate(notification.createdAt)} ({getRelativeTime(notification.createdAt)})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  // Decidir qué renderizar
  if (mode === "dropdown") return isDropdownOpen ? renderDropdownContent() : null
  return isOpen ? renderDropdownContent() : null
}

export default NotificationCenter
