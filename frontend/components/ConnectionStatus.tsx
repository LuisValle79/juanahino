'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { config } from '@/lib/config';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      await apiClient.healthCheck();
      setIsConnected(true);
      setLastCheck(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastCheck(new Date());
      console.error('Backend connection failed:', error);
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Set up periodic checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <Badge variant="secondary" className={className}>
        <AlertCircle className="h-3 w-3 mr-1" />
        Verificando...
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge variant="default" className={`bg-green-500 hover:bg-green-600 ${className}`}>
        <Wifi className="h-3 w-3 mr-1" />
        Conectado
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className={className}>
      <WifiOff className="h-3 w-3 mr-1" />
      Sin conexión
    </Badge>
  );
}

// Hook for connection status
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await apiClient.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isConnected, isChecking, checkConnection };
}