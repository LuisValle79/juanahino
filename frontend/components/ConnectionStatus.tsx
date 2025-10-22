"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Activity 
} from "lucide-react"
import { apiClient } from "@/lib/api"

interface ConnectionStatusProps {
  className?: string
  showText?: boolean
  autoCheck?: boolean
  checkInterval?: number
}

interface HealthStatus {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  database: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN'
  vehicleCount?: number
  notificationCount?: number
  timestamp?: number
}

export function ConnectionStatus({
  className,
  showText = false,
  autoCheck = true,
  checkInterval = 60000, // 1 minuto
}: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking')
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [isManualCheck, setIsManualCheck] = useState(false)

  // Verificar salud del backend
  const checkHealth = async (manual = false) => {
    if (manual) {
      setIsManualCheck(true)
    }
    
    try {
      setStatus('checking')
      const health = await apiClient.healthCheck()
      
      setHealthData(health)
      setStatus('online')
      setLastCheck(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
      setHealthData(null)
      setStatus('offline')
      setLastCheck(new Date())
    } finally {
      if (manual) {
        setTimeout(() => setIsManualCheck(false), 1000)
      }
    }
  }

  // Auto-check
  useEffect(() => {
    // Check inicial
    checkHealth()

    if (autoCheck) {
      const interval = setInterval(() => {
        checkHealth()
      }, checkInterval)
      
      return () => clearInterval(interval)
    }
  }, [autoCheck, checkInterval])

  // Obtener icono según el estado
  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className={`h-4 w-4 animate-spin ${isManualCheck ? 'text-blue-500' : ''}`} />
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // Obtener texto del estado
  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando...'
      case 'online':
        return 'Conectado'
      case 'offline':
        return 'Desconectado'
      case 'error':
        return 'Error'
      default:
        return 'Desconocido'
    }
  }

  // Obtener color del badge
  const getBadgeVariant = () => {
    switch (status) {
      case 'online':
        return 'default' // Verde
      case 'offline':
        return 'destructive' // Rojo
      case 'error':
        return 'secondary' // Amarillo
      case 'checking':
        return 'outline' // Gris
      default:
        return 'outline'
    }
  }

  // Formatear información de salud
  const getHealthInfo = () => {
    if (!healthData) return 'Sin información de salud disponible'
    
    const info = [
      `Estado: ${healthData.status}`,
      `Base de datos: ${healthData.database}`,
    ]
    
    if (healthData.vehicleCount !== undefined) {
      info.push(`Vehículos: ${healthData.vehicleCount}`)
    }
    
    if (healthData.notificationCount !== undefined) {
      info.push(`Notificaciones: ${healthData.notificationCount}`)
    }
    
    if (lastCheck) {
      info.push(`Última verificación: ${lastCheck.toLocaleTimeString()}`)
    }
    
    return info.join('\n')
  }

  const statusComponent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => checkHealth(true)}
              disabled={status === 'checking'}
              className="h-8 px-2"
            >
              {getStatusIcon()}
              {showText && (
                <span className="ml-2 text-sm">{getStatusText()}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm whitespace-pre-line">
              <div className="font-medium mb-1">Estado del Backend</div>
              {getHealthInfo()}
              <div className="mt-2 text-xs text-muted-foreground">
                Haz clic para verificar manualmente
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {!showText && (
        <Badge variant={getBadgeVariant()} className="text-xs">
          {getStatusText()}
        </Badge>
      )}
    </div>
  )

  return statusComponent
}

export default ConnectionStatus