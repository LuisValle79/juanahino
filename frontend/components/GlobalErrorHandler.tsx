'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  useEffect(() => {
    // Capturar errores no manejados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (event.reason?.message?.includes('ByteBuddyInterceptor')) {
        toast.error('Error temporal del servidor. Reintentando automáticamente...');
      } else if (event.reason?.message?.includes('Invalid cloud_name')) {
        toast.error('Error de configuración de imágenes. Contacte al administrador.');
      } else if (event.reason?.message?.includes('could not execute statement')) {
        toast.error('Error de base de datos. Verifique los datos ingresados.');
      } else {
        toast.error('Ha ocurrido un error inesperado.');
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      if (event.error?.message?.includes('ByteBuddyInterceptor')) {
        toast.error('Error temporal del servidor. Reintentando automáticamente...');
      } else if (event.error?.message?.includes('Invalid cloud_name')) {
        toast.error('Error de configuración de imágenes. Contacte al administrador.');
      } else {
        toast.error('Ha ocurrido un error inesperado.');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return <>{children}</>;
};

export default GlobalErrorHandler;