"use client"

import React, { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, Zap, User, Car, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { apiClient } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: number
  tipo: string
  prioridad: string
  titulo: string
  mensaje: string
  leido: boolean
  createdAt: string
  vehiculo?: any
  user?: any
  quote?: any
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onNotificationUpdate?: () => void
}

export function NotificationCenter({ isOpen, onClose, onNotificationUpdate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Cargar notificaciones
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getNotifications() as Notification[]
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Marcar como leída
  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, leido: true } : n)
      )
      onNotificationUpdate?.()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, leido: true })))
      onNotificationUpdate?.()
      toast({
        title: "Notificaciones actualizadas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Obtener icono según el tipo
  const getNotificationIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'vehicle':
        return <Car className="h-4 w-4" />
      case 'quote':
        return <FileText className="h-4 w-4" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />
      case 'system':
        return <Settings className="h-4 w-4" />
      case 'sale':
        return <Zap className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Obtener color según la prioridad
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Cargar notificaciones al abrir
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  // Auto-refresh cada 30 segundos cuando está abierto
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.leido).length

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md h-[600px] bg-white shadow-2xl animate-in slide-in-from-right-5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Marcar todas como leídas
              </Button>
            </div>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.leido 
                        ? 'bg-blue-50 border-l-blue-500' 
                        : 'bg-white border-l-gray-200'
                    }`}
                    onClick={() => !notification.leido && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(notification.prioridad)}`}>
                        {getNotificationIcon(notification.tipo)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.leido ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.titulo}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.prioridad)}`}
                          >
                            {notification.prioridad.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className={`text-xs mb-2 ${
                          !notification.leido ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.mensaje}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </span>
                          
                          {!notification.leido && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}