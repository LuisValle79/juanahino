"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

interface NotificationStats {
  unreadCount: number
  lastUpdate: Date
}

export function useNotifications() {
  const [stats, setStats] = useState<NotificationStats>({
    unreadCount: 0,
    lastUpdate: new Date()
  })
  const [isLoading, setIsLoading] = useState(false)

  // Cargar contador de notificaciones no leídas
  const loadUnreadCount = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getUnreadNotificationCount() as { count: number }
      setStats(prev => ({
        ...prev,
        unreadCount: response.count,
        lastUpdate: new Date()
      }))
    } catch (error) {
      console.error('Error loading unread count:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await apiClient.markNotificationAsRead(notificationId)
      setStats(prev => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1),
        lastUpdate: new Date()
      }))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.markAllNotificationsAsRead()
      setStats(prev => ({
        ...prev,
        unreadCount: 0,
        lastUpdate: new Date()
      }))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  // Refrescar contador
  const refresh = useCallback(() => {
    loadUnreadCount()
  }, [loadUnreadCount])

  // Cargar contador inicial
  useEffect(() => {
    loadUnreadCount()
  }, [loadUnreadCount])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [loadUnreadCount])

  return {
    unreadCount: stats.unreadCount,
    lastUpdate: stats.lastUpdate,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh
  }
}