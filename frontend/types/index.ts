// Export all types from individual files
export * from './vehicle';
export * from './user';
export * from './quote';
export * from './quote-client';
export * from './notification';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Stats types
export interface VehicleStats {
  total: number;
  disponible: number;
  reservado: number;
  vendido: number;
  byType: {
    camion: number;
    bus: number;
  };
  byCategory: Record<string, number>;
}

export interface UserStats {
  total: number;
  activo: number;
  inactivo: number;
  byRole: {
    admin: number;
    asesor: number;
  };
  totalSales: number;
}

export interface QuoteStats {
  total: number;
  pendiente: number;
  enProceso: number;
  enviada: number;
  cerrada: number;
  byPriority: {
    alta: number;
    media: number;
    baja: number;
  };
  unassigned: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    alert: number;
    maintenance: number;
    fuel: number;
    system: number;
    quote: number;
    user: number;
    vehicle: number;
    sale: number;
  };
  byPriority: {
    alta: number;
    media: number;
    baja: number;
  };
}

// Form types
export interface VehicleFormData {
  modelo: string;
  tipo: 'camion' | 'bus';
  categoria: string;
  precio: number;
  capacidad: string;
  motor: string;
  año: number;
  estado: 'disponible' | 'reservado' | 'vendido';
  stock: number;
  imagen_url?: string;
  descripcion?: string;
}

export interface UserFormData {
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'admin' | 'asesor';
  especialidad?: string;
  estado: 'activo' | 'inactivo';
  password?: string;
}

export interface QuoteFormData {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono?: string;
  empresa?: string;
  tipo_vehiculo: string;
  mensaje?: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface NotificationFormData {
  tipo: 'alert' | 'maintenance' | 'fuel' | 'system' | 'quote' | 'user' | 'vehicle' | 'sale';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  mensaje: string;
  vehiculo_id?: number;
  quote_id?: number;
  user_id?: number;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}