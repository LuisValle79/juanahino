"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellRing } from "lucide-react"
import { useUnreadNotificationCount } from "@/hooks/useApi"
import NotificationCenter from "./NotificationCenter"

interface NotificationIndicatorProps {
  className?: string
  showBadge?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function NotificationIndicator({
  className,
  showBadge = true,
  autoRefresh = true,
  refreshInterval = 30000,
}: NotificationIndicatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { data: unreadCount, refetch } = useUnreadNotificationCount()
  const hasUnread = (unreadCount || 0) > 0

  const handleNotificationUpdate = () => {
    refetch()
  }

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev)

  // Auto-refresh contador
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => refetch(), refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, refetch])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  // Cerrar dropdown con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false)
    }
    if (isDropdownOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isDropdownOpen])

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className={`relative transition-all duration-200 hover:scale-105 ${
          isDropdownOpen ? "bg-blue-50 text-blue-600" : ""
        } ${className}`}
        onClick={toggleDropdown}
        aria-label={`Notificaciones${hasUnread ? ` (${unreadCount || 0} sin leer)` : ""}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className={`transition-all duration-300 ${hasUnread ? "animate-pulse" : ""}`}>
          {hasUnread ? <BellRing className="h-5 w-5 text-blue-600" /> : <Bell className="h-5 w-5" />}
        </div>

        {showBadge && hasUnread && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce bg-red-500 hover:bg-red-600 shadow-lg"
          >
            {(unreadCount || 0) > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
        >
          <NotificationCenter
            mode="dropdown"
            isDropdownOpen={isDropdownOpen}
            onNotificationUpdate={handleNotificationUpdate}
            onDropdownToggle={toggleDropdown}
            autoRefresh={autoRefresh}
          />
        </div>
      )}
    </div>
  )
}

export default NotificationIndicator
