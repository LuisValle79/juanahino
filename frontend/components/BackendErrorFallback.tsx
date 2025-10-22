"use client"

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Server } from "lucide-react"

interface BackendErrorFallbackProps {
  error?: string | null
  onRetry?: () => void
  showRetry?: boolean
  title?: string
  description?: string
  className?: string
}

export function BackendErrorFallback({
  error,
  onRetry,
  showRetry = true,
  title = "Error del Servidor",
  description,
  className
}: BackendErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true)
      try {
        await onRetry()
      } finally {
        setIsRetrying(false)
      }
    }
  }

  // Determinar el tipo de error y mensaje apropiado
  const getErrorInfo = () => {
    if (!error) return { type: 'unknown', message: 'Error desconocido' }

    if (error.includes('ByteBuddyInterceptor')) {
      return {
        type: 'hibernate',
        message: 'Error temporal del servidor. El sistema está procesando datos.',
        suggestion: 'Este error suele resolverse automáticamente. Intenta nuevamente en unos segundos.'
      }
    }

    if (error.includes('500')) {
      return {
        type: 'server',
        message: 'Error interno del servidor.',
        suggestion: 'El servidor está experimentando problemas. Intenta nuevamente.'
      }
    }

    if (error.includes('Invalid cloud_name')) {
      return {
        type: 'cloudinary',
        message: 'Error de configuración de imágenes.',
        suggestion: 'Contacta al administrador del sistema.'
      }
    }

    return {
      type: 'generic',
      message: error,
      suggestion: 'Intenta nuevamente o contacta al soporte técnico.'
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <Server className="h-4 w-4" />
          <AlertTitle>Problema de Conectividad</AlertTitle>
          <AlertDescription>
            {description || errorInfo.message}
          </AlertDescription>
        </Alert>

        {errorInfo.suggestion && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Sugerencia:</strong> {errorInfo.suggestion}
          </div>
        )}

        {showRetry && onRetry && (
          <div className="flex justify-center">
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Reintentando...' : 'Reintentar'}
            </Button>
          </div>
        )}

        {errorInfo.type === 'hibernate' && (
          <div className="text-xs text-muted-foreground text-center">
            <p>Este error es temporal y suele resolverse automáticamente.</p>
            <p>Si persiste, contacta al administrador del sistema.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BackendErrorFallback