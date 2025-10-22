"use client"

import { useState, useEffect } from 'react'
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

interface NotificationCenterProps {
  className?: string
  showHeader?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  // Props para dropdown compacto
  isDropdownOpen?: boolean
  onNotificationUpdate?: () => void
  // Props para modal (modo legacy)
  isOpen?: boolean
  onClose?: () => void
  mode?: 'dropdown' | 'modal'
}

export function NotificationCenter({
  className,
  showHeader = true,
  autoRefresh = true,
  refreshInterval = 30000, // 30 segundos
  isDropdownOpen = false,
  onNotificationUpdate,
  // Props legacy para modal
  isOpen = false,
  onClose,
  mode = 'dropdown'
}: NotificationCenterProps) {
  const { toast } = useToast()
  const [filterPriority] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Hooks para obtener datos
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

  // Filtrar y ordenar notificaciones (más recientes primero)
  const filteredNotifications = Array.isArray(notifications) 
    ? notifications
        .filter((notification: Notification) => {
          const matchesPriority = filterPriority === "all" || notification.prioridad === filterPriority
          const matchesReadStatus = !showUnreadOnly || !notification.leido
          
          return matchesPriority && matchesReadStatus
        })
        .sort((a: Notification, b: Notification) => {
          // Ordenar por fecha de creación (más reciente primero)
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          
          // Debug: Log para verificar el ordenamiento
          console.log('Comparando fechas:')
          console.log('A:', a.createdAt, '-> timestamp:', dateA)
          console.log('B:', b.createdAt, '-> timestamp:', dateB)
          console.log('Resultado (B-A):', dateB - dateA)
          
          return dateB - dateA // Más reciente primero (descendente)
        })
    : []

  // Marcar como leída
  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id)
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      })
      console.error("Error marking notification as read:", error)
    }
  }

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead()
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
      toast({
        title: "Notificaciones actualizadas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron marcar todas las notificaciones como leídas",
        variant: "destructive",
      })
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Eliminar notificación
  const handleDeleteNotification = async (id: number) => {
    try {
      await NotificationService.delete(id)
      await refetch()
      await refetchUnreadCount()
      onNotificationUpdate?.()
      toast({
        title: "Notificación eliminada",
        description: "La notificación ha sido eliminada exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      })
      console.error("Error deleting notification:", error)
    }
  }

  // Obtener icono de tipo
  const getTypeIcon = (type: string) => {
    return NotificationService.getTypeIcon(type)
  }

  // Obtener badge de tipo
  const getTypeBadge = (type: string) => {
    const typeText = NotificationService.getTypeText(type)
    const typeColor = NotificationService.getTypeColor(type)
    
    return (
      <Badge className={`${typeColor} text-xs`}>
        <span className="mr-1">{getTypeIcon(type)}</span>
        {typeText}
      </Badge>
    )
  }

  // Obtener badge de prioridad
  const getPriorityBadge = (priority: string) => {
    const priorityText = NotificationService.getPriorityText(priority)
    const priorityColor = NotificationService.getPriorityColor(priority)
    
    return <Badge className={`${priorityColor} text-xs`}>{priorityText}</Badge>
  }

  // Formatear fecha de manera profesional - SIEMPRE muestra fecha y hora exacta
  const formatNotificationDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida recibida:', dateString)
        return 'Fecha inválida'
      }

      // Siempre mostrar fecha y hora completa para debugging
      const fullDateTime = date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      console.log('Fecha original:', dateString, '-> Formateada:', fullDateTime)
      
      return fullDateTime
      
    } catch (error) {
      console.error('Error formateando fecha:', error, 'Fecha original:', dateString)
      return dateString // Devolver la fecha original si hay error
    }
  }

  // Función alternativa para mostrar tiempo relativo
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

      if (diffInMinutes < 1) return "Ahora"
      if (diffInMinutes < 60) return `${diffInMinutes}m`
      if (diffInHours < 24) return `${diffInHours}h`
      if (diffInDays < 7) return `${diffInDays}d`
      return `${Math.floor(diffInDays / 7)}sem`
    } catch {
      return ""
    }
  }

  if (loading) {
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
  }

  if (error) {
    return (
      <div className={className}>
        <BackendErrorFallback
          error={error}
          onRetry={refetch}
          title="Error al cargar notificaciones"
          description="No se pudieron cargar las notificaciones del servidor"
        />
      </div>
    )
  }

  // Renderizar dropdown compacto
  const renderDropdownContent = () => (
    <div className="w-80 max-h-[32rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
      {/* Header compacto */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-900">Notificaciones</span>
          {(unreadCount || 0) > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Filtro rápido */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`h-7 w-7 p-0 transition-all ${showUnreadOnly ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title={showUnreadOnly ? "Mostrar todas" : "Solo no leídas"}
          >
            <Filter className="h-3 w-3" />
          </Button>
          
          {/* Marcar todas como leídas */}
          {(unreadCount || 0) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="h-3 w-3" />
            </Button>
          )}
          
          {/* Actualizar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="h-7 w-7 p-0 hover:bg-gray-200 transition-all"
            title="Actualizar"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Lista de notificaciones con scrollbar personalizada */}
      <div className="max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {showUnreadOnly ? "No hay notificaciones sin leer" : "No hay notificaciones"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-gray-50 transition-all duration-200 ${
                  !notification.leido ? 'bg-blue-50/50 border-l-2 border-l-blue-400' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Indicador de tipo */}
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                    !notification.leido ? 'bg-blue-500 shadow-sm' : 'bg-gray-300'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    {/* Título y badges */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {notification.titulo}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.leido && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
                            title="Marcar como leída"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Mensaje */}
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                      {notification.mensaje}
                    </p>
                    
                    {/* Footer con badges y tiempo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getTypeBadge(notification.tipo)}
                        {notification.prioridad !== 'normal' && getPriorityBadge(notification.prioridad)}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-medium">
                          {formatNotificationDate(notification.createdAt)}
                        </div>
                        <div className="text-xs text-gray-300">
                          {getRelativeTime(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Footer con información adicional */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="text-center">
                  <span className="text-xs text-gray-500 font-medium">
                    {filteredNotifications.length} notificación{filteredNotifications.length !== 1 ? 'es' : ''} 
                    {showUnreadOnly ? ' sin leer' : ' total'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Renderizar modal completo (modo legacy)
  const renderModalContent = () => (
    <>
      {/* Overlay con animación */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-300" 
        onClick={onClose}
      />
      
      {/* Modal centrado con animaciones */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col h-full max-h-[80vh]">
            {/* Header del modal */}
            {showHeader && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
                    {(unreadCount || 0) > 0 && (
                      <p className="text-sm text-gray-600">
                        {unreadCount} sin leer
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Contenido scrolleable del modal */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">No hay notificaciones</h3>
                    <p className="text-gray-500 text-sm">
                      {showUnreadOnly 
                        ? "No tienes notificaciones sin leer" 
                        : "No hay notificaciones disponibles"}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {filteredNotifications.map((notification: Notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                          !notification.leido 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Header con tipo y prioridad */}
                            <div className="flex items-center gap-2 mb-3">
                              {getTypeBadge(notification.tipo)}
                              {getPriorityBadge(notification.prioridad)}
                              {!notification.leido && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                  <BellRing className="h-3 w-3 mr-1" />
                                  Nuevo
                                </Badge>
                              )}
                            </div>

                            {/* Título */}
                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {notification.titulo}
                            </h4>

                            {/* Mensaje */}
                            <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                              {notification.mensaje}
                            </p>

                            {/* Fecha */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                              <span>{formatNotificationDate(notification.createdAt)}</span>
                              <span className="text-gray-300">({getRelativeTime(notification.createdAt)})</span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col gap-1">
                            {!notification.leido && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                title="Marcar como leída"
                                className="hover:bg-green-100 hover:text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              title="Eliminar notificación"
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Decidir qué renderizar según el modo
  if (mode === 'dropdown') {
    return isDropdownOpen ? renderDropdownContent() : null
  } else {
    return isOpen ? renderModalContent() : null
  }
}

export default NotificationCenter