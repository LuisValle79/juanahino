// Constantes y enums para la aplicación
export const VEHICLE_TYPES = {
  CAMION: 'camion',
  BUS: 'bus'
} as const;

export const VEHICLE_STATUS = {
  DISPONIBLE: 'disponible',
  RESERVADO: 'reservado',
  VENDIDO: 'vendido'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ASESOR: 'asesor',
  SUPERVISOR: 'supervisor',
  VENDEDOR: 'vendedor'
} as const;

export const USER_STATUS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido'
} as const;

export const QUOTE_STATUS = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
} as const;

export const QUOTE_PRIORITY = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
} as const;

export const NOTIFICATION_TYPES = {
  ALERT: 'alert',
  MAINTENANCE: 'maintenance',
  FUEL: 'fuel',
  SYSTEM: 'system',
  QUOTE: 'quote',
  USER: 'user',
  VEHICLE: 'vehicle',
  SALE: 'sale'
} as const;

export const NOTIFICATION_PRIORITY = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
} as const;

export const FILE_TYPES = {
  VEHICLE: 'vehicle',
  AVATAR: 'avatar',
  USER: 'user',
  DOCUMENT: 'document',
  GENERAL: 'general'
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  SERVER_ERROR: 'Error interno del servidor. Reintentando automáticamente...',
  NOT_FOUND: 'Recurso no encontrado',
  BAD_REQUEST: 'Datos inválidos',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  CLOUDINARY_CONFIG: 'Error de configuración de imágenes. Contacte al administrador.',
  DATABASE_ERROR: 'Error de base de datos. Verifique los datos ingresados.',
  HIBERNATE_ERROR: 'Error temporal del servidor. Reintentando...',
  VALIDATION_ERROR: 'Error de validación en los datos',
  UPLOAD_ERROR: 'Error al subir archivo',
  DELETE_ERROR: 'Error al eliminar',
  UPDATE_ERROR: 'Error al actualizar',
  CREATE_ERROR: 'Error al crear',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Creado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  UPLOADED: 'Subido exitosamente',
  SAVED: 'Guardado exitosamente',
  SENT: 'Enviado exitosamente',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_DESCRIPTION_LENGTH: 10,
  CURRENT_YEAR: new Date().getFullYear(),
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear() + 5,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  POLLING_INTERVAL: 30000, // 30 seconds
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 200,
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;