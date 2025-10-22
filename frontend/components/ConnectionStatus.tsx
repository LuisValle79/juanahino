"use client"

import { useState, useEffect } from "react"
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
  Activity,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

interface ConnectionStatusProps {
  className?: string
  showText?: boolean
  autoCheck?: boolean
  checkInterval?: number
}

interface HealthStatus {
  status: "UP" | "DOWN" | "UNKNOWN"
  database: "CONNECTED" | "DISCONNECTED" | "UNKNOWN"
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
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error"
  >("checking")
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [isManualCheck, setIsManualCheck] = useState(false)

  // ✅ Verificar salud del backend
  const checkHealth = async (manual = false) => {
    if (manual) setIsManualCheck(true)

    try {
      setStatus("checking")

      const health = (await apiClient.healthCheck()) as HealthStatus

      if (health?.status === "UP" && health?.database === "CONNECTED") {
        setStatus("online")
      } else {
        setStatus("offline")
      }

      setHealthData(health)
      setLastCheck(new Date())
    } catch (error) {
      console.error("Error verificando salud del backend:", error)
      setHealthData(null)
      setStatus("offline")
      setLastCheck(new Date())
    } finally {
      if (manual) setTimeout(() => setIsManualCheck(false), 1000)
    }
  }

  // 🔁 Auto-check
  useEffect(() => {
    checkHealth()
    if (autoCheck) {
      const interval = setInterval(checkHealth, checkInterval)
      return () => clearInterval(interval)
    }
  }, [autoCheck, checkInterval])

  // 🎨 Iconos según estado
  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return (
          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
        )
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // 🧾 Texto del estado
  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Verificando..."
      case "online":
        return "Conectado"
      case "offline":
        return "Desconectado"
      case "error":
        return "Error"
      default:
        return "Desconocido"
    }
  }

  // 🎨 Colores del Badge
  const getBadgeVariant = () => {
    switch (status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "error":
        return "secondary"
      case "checking":
        return "outline"
      default:
        return "outline"
    }
  }

  // 🧠 Info de salud
  const getHealthInfo = () => {
    if (!healthData) return "Sin información de salud disponible"

    const info = [
      `Estado: ${healthData.status}`,
      `Base de datos: ${healthData.database}`,
    ]

    if (healthData.vehicleCount !== undefined)
      info.push(`Vehículos: ${healthData.vehicleCount}`)

    if (healthData.notificationCount !== undefined)
      info.push(`Notificaciones: ${healthData.notificationCount}`)

    if (lastCheck)
      info.push(`Última verificación: ${lastCheck.toLocaleTimeString()}`)

    return info.join("\n")
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => checkHealth(true)}
                disabled={status === "checking"}
                className="h-8 px-2 transition-all duration-200 hover:bg-muted"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getStatusIcon()}
                  </motion.div>
                </AnimatePresence>

                {showText && (
                  <span className="ml-2 text-sm">{getStatusText()}</span>
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>

          <TooltipContent className="max-w-xs whitespace-pre-line p-2">
            <div className="text-sm">
              <div className="font-semibold mb-1">Estado del sistema</div>
              {getHealthInfo()}
              <div className="mt-2 text-xs text-muted-foreground">
                🔄 Haz clic para verificar manualmente
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!showText && (
        <Badge variant={getBadgeVariant()} className="text-xs px-2 py-1">
          {getStatusText()}
        </Badge>
      )}
    </div>
  )
}

export default ConnectionStatus
