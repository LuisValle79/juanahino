// Utilidades de validación mejoradas
export const validators = {
  email: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  phone: (phone: string) => {
    const re = /^\+?[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
  },
  
  required: (value: any) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength: (value: string, min: number) => {
    return value && value.length >= min;
  },
  
  maxLength: (value: string, max: number) => {
    return value && value.length <= max;
  },
  
  positiveNumber: (value: any) => {
    return !isNaN(value) && parseFloat(value) > 0;
  },
  
  year: (value: any) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(value);
    return year >= 1900 && year <= currentYear + 5;
  },
  
  // Validador para prioridades de notificaciones
  notificationPriority: (value: string) => {
    const validPriorities = ['alta', 'media', 'baja'];
    return validPriorities.includes(value?.toLowerCase());
  },
  
  // Validador para tipos de notificaciones
  notificationType: (value: string) => {
    const validTypes = ['alert', 'maintenance', 'fuel', 'system', 'quote', 'user', 'vehicle', 'sale'];
    return validTypes.includes(value?.toLowerCase());
  },
  
  // Validador para estados de vehículos
  vehicleStatus: (value: string) => {
    const validStatuses = ['disponible', 'reservado', 'vendido'];
    return validStatuses.includes(value?.toLowerCase());
  },
  
  // Validador para roles de usuario
  userRole: (value: string) => {
    const validRoles = ['admin', 'asesor', 'supervisor', 'vendedor'];
    return validRoles.includes(value?.toLowerCase());
  }
};

// Validación de datos antes del envío
export const validateData = (data: any, schema: any) => {
  const errors: any = {};
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    const ruleSet = rules as any;
    
    if (ruleSet.required && !validators.required(value)) {
      errors[key] = `${key} es obligatorio`;
    }
    
    if (ruleSet.type === 'email' && value && !validators.email(value)) {
      errors[key] = 'Email inválido';
    }
    
    if (ruleSet.type === 'phone' && value && !validators.phone(value)) {
      errors[key] = 'Teléfono inválido';
    }
    
    if (ruleSet.type === 'number' && value && !validators.positiveNumber(value)) {
      errors[key] = 'Debe ser un número válido';
    }
    
    if (ruleSet.minLength && value && !validators.minLength(value, ruleSet.minLength)) {
      errors[key] = `Debe tener al menos ${ruleSet.minLength} caracteres`;
    }
    
    if (ruleSet.validator && value && !ruleSet.validator(value)) {
      errors[key] = `Valor inválido para ${key}`;
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Validar datos antes de enviar al backend
export const validateBeforeSend = (data: any, type: 'user' | 'vehicle' | 'notification') => {
  const schemas = {
    user: {
      nombre: { required: true, minLength: 2 },
      email: { required: true, type: 'email' },
      rol: { required: true, validator: validators.userRole },
      telefono: { type: 'phone' }
    },
    vehicle: {
      modelo: { required: true, minLength: 3 },
      tipo: { required: true },
      precio: { required: true, type: 'number' },
      año: { required: true, validator: validators.year }
    },
    notification: {
      tipo: { required: true, validator: validators.notificationType },
      prioridad: { required: true, validator: validators.notificationPriority },
      titulo: { required: true, minLength: 5 },
      mensaje: { required: true, minLength: 10 }
    }
  };
  
  return validateData(data, schemas[type] || {});
};

// Sanitizar datos de notificación
export const sanitizeNotificationData = (data: any) => {
  const prioridad = ['alta', 'media', 'baja'].includes(data.prioridad?.toLowerCase()) 
    ? data.prioridad.toLowerCase() 
    : 'media';

  const tipo = ['alert', 'maintenance', 'fuel', 'system', 'quote', 'user', 'vehicle', 'sale'].includes(data.tipo?.toLowerCase())
    ? data.tipo.toLowerCase()
    : 'system';

  return {
    ...data,
    prioridad,
    tipo
  };
};


// Validar configuración de Cloudinary
export const validateCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName || cloudName === 'dqkdflqyp' || cloudName === 'tu_cloud_name_real') {
    throw new Error('Cloudinary no está configurado correctamente');
  }
  
  return true;
};