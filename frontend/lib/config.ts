// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000, // 10 seconds
  },
  
  // App Configuration
  app: {
    name: 'HINO Connect',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableDevTools: process.env.NODE_ENV === 'development',
    enableNotificationPolling: true,
  },
  
  // UI Configuration
  ui: {
    itemsPerPage: 10,
    notificationPollingInterval: 30000, // 30 seconds
    toastDuration: 5000, // 5 seconds
  },
  
  // Validation rules
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    minPasswordLength: 8,
  },
} as const;

// Type-safe environment variables
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
}

// Check if we're running on the client side
export const isClient = typeof window !== 'undefined';

// Check if we're in development mode
export const isDevelopment = config.app.environment === 'development';

// Check if we're in production mode
export const isProduction = config.app.environment === 'production';

// API endpoints
export const endpoints = {
  vehicles: '/vehicles',
  users: '/users',
  quotes: '/quotes',
  notifications: '/notifications',
  health: '/health',
} as const;