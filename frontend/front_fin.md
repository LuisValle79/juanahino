# Documentación Completa de Integración Frontend - Hino Connect API

## 📋 Información General

### Base URL
- **Desarrollo Local**: `http://localhost:8080`
- **Producción**: `https://hinoconnect-backend.onrender.com` (o tu URL de producción)

### Configuración CORS
El backend está configurado para aceptar requests desde:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://hinoconnect-v2.netlify.app`

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

Para uploads de archivos:
```javascript
{
  'Content-Type': 'multipart/form-data'
}
```

---

## 🚗 API de Vehículos (`/api/vehicles`)

### Obtener todos los vehículos
```javascript
// GET /api/vehicles
const getVehicles = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`);
  return await response.json();
};
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "modelo": "Hino 300 Series",
    "tipo": "camion",
    "categoria": "Liviano",
    "precio": 45000.00,
    "capacidad": "3.5 toneladas",
    "motor": "4JJ1-TC",
    "año": 2024,
    "estado": "disponible",
    "stock": 5,
    "imagenUrl": "https://res.cloudinary.com/...",
    "descripcion": "Camión liviano ideal para distribución urbana",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### Obtener vehículo por ID
```javascript
// GET /api/vehicles/{id}
const getVehicleById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`);
  if (!response.ok) throw new Error('Vehículo no encontrado');
  return await response.json();
};
```

### Crear nuevo vehículo
```javascript
// POST /api/vehicles
const createVehicle = async (vehicleData) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData)
  });
  return await response.json();
};

// Ejemplo de datos:
const vehicleData = {
  modelo: "Hino 500 Series",
  tipo: "camion",
  categoria: "Pesado",
  precio: 85000.00,
  capacidad: "15 toneladas",
  motor: "J08E-VD",
  año: 2024,
  estado: "disponible",
  stock: 3,
  descripcion: "Camión pesado para transporte de carga"
};
```

### Actualizar vehículo
```javascript
// PUT /api/vehicles/{id}
const updateVehicle = async (id, vehicleData) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData)
  });
  return await response.json();
};
```

### Eliminar vehículo
```javascript
// DELETE /api/vehicles/{id}
const deleteVehicle = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};
```

### Filtros y búsquedas de vehículos

#### Por tipo
```javascript
// GET /api/vehicles/type/{tipo}
const getVehiclesByType = async (tipo) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/type/${tipo}`);
  return await response.json();
};
// Tipos disponibles: "camion", "bus"
```

#### Por estado
```javascript
// GET /api/vehicles/status/{estado}
const getVehiclesByStatus = async (estado) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/status/${estado}`);
  return await response.json();
};
// Estados disponibles: "disponible", "reservado", "vendido"
```

#### Por categoría
```javascript
// GET /api/vehicles/category/{categoria}
const getVehiclesByCategory = async (categoria) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/category/${categoria}`);
  return await response.json();
};
```

#### Por año
```javascript
// GET /api/vehicles/year/{año}
const getVehiclesByYear = async (año) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/year/${año}`);
  return await response.json();
};
```

#### Por rango de precio
```javascript
// GET /api/vehicles/price-range?minPrecio={min}&maxPrecio={max}
const getVehiclesByPriceRange = async (minPrecio, maxPrecio) => {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/price-range?minPrecio=${minPrecio}&maxPrecio=${maxPrecio}`
  );
  return await response.json();
};
```

#### Búsqueda general
```javascript
// GET /api/vehicles/search?q={query}
const searchVehicles = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};
```

#### Estadísticas de vehículos
```javascript
// GET /api/vehicles/stats
const getVehicleStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/stats`);
  return await response.json();
};
```

---

## 👥 API de Usuarios (`/api/users`)

### Obtener todos los usuarios
```javascript
// GET /api/users
const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  return await response.json();
};
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@hinoconnect.com",
    "telefono": "+1234567890",
    "rol": "asesor",
    "especialidad": "Camiones Livianos",
    "estado": "activo",
    "ventas": 15,
    "avatarUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### Obtener usuario por ID
```javascript
// GET /api/users/{id}
const getUserById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
  if (!response.ok) throw new Error('Usuario no encontrado');
  return await response.json();
};
```

### Obtener usuario por email
```javascript
// GET /api/users/email/{email}
const getUserByEmail = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/users/email/${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error('Usuario no encontrado');
  return await response.json();
};
```

### Crear nuevo usuario
```javascript
// POST /api/users
const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear usuario');
  }
  
  return await response.json();
};

// Ejemplo de datos:
const userData = {
  nombre: "María García",
  email: "maria@hinoconnect.com",
  telefono: "+1234567891",
  rol: "asesor",
  especialidad: "Buses",
  estado: "activo",
  passwordHash: "hashedPassword123" // En producción, hashear la contraseña
};
```

### Actualizar usuario
```javascript
// PUT /api/users/{id}
const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar usuario');
  }
  
  return await response.json();
};

// Datos para actualización (UserUpdateDTO):
const updateData = {
  nombre: "María García Actualizada",
  email: "maria.nueva@hinoconnect.com",
  telefono: "+1234567892",
  rol: "supervisor",
  especialidad: "Buses y Camiones",
  estado: "activo",
  ventas: 20,
  avatarUrl: "https://res.cloudinary.com/nueva-imagen"
};
```

### Eliminar usuario
```javascript
// DELETE /api/users/{id}
const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};
```

### Filtros de usuarios

#### Por rol
```javascript
// GET /api/users/role/{rol}
const getUsersByRole = async (rol) => {
  const response = await fetch(`${API_BASE_URL}/api/users/role/${rol}`);
  return await response.json();
};
// Roles disponibles: "admin", "asesor", "supervisor", "vendedor"
```

#### Por estado
```javascript
// GET /api/users/status/{estado}
const getUsersByStatus = async (estado) => {
  const response = await fetch(`${API_BASE_URL}/api/users/status/${estado}`);
  return await response.json();
};
// Estados disponibles: "activo", "inactivo", "suspendido"
```

#### Por especialidad
```javascript
// GET /api/users/specialty/{especialidad}
const getUsersBySpecialty = async (especialidad) => {
  const response = await fetch(`${API_BASE_URL}/api/users/specialty/${encodeURIComponent(especialidad)}`);
  return await response.json();
};
```

#### Obtener asesores activos
```javascript
// GET /api/users/advisors/active
const getActiveAdvisors = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/advisors/active`);
  return await response.json();
};
```

#### Búsqueda de usuarios
```javascript
// GET /api/users/search?q={query}
const searchUsers = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};
```

#### Estadísticas de usuarios
```javascript
// GET /api/users/stats
const getUserStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/stats`);
  return await response.json();
};
```

#### Obtener usuarios como DTO
```javascript
// GET /api/users/dto
const getUsersDTO = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/dto`);
  return await response.json();
};
```

#### Endpoints de prueba
```javascript
// GET /api/users/test
const testUserController = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/test`);
  return await response.json();
};

// GET /api/users/test-db
const testUserDatabase = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/test-db`);
  return await response.json();
};
```

---

## 💬 API de Cotizaciones (`/api/quotes`)

### Obtener todas las cotizaciones
```javascript
// GET /api/quotes
const getQuotes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/quotes`);
  return await response.json();
};
```

### Obtener cotización por ID
```javascript
// GET /api/quotes/{id}
const getQuoteById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/${id}`);
  if (!response.ok) throw new Error('Cotización no encontrada');
  return await response.json();
};
```

### Crear nueva cotización
```javascript
// POST /api/quotes
const createQuote = async (quoteData) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData)
  });
  return await response.json();
};

// Ejemplo de datos:
const quoteData = {
  clienteNombre: "Empresa ABC",
  clienteEmail: "contacto@empresaabc.com",
  clienteTelefono: "+1234567890",
  tipoVehiculo: "camion",
  mensaje: "Necesito cotización para 3 camiones livianos",
  prioridad: "alta",
  estado: "pendiente"
};
```

### Actualizar cotización
```javascript
// PUT /api/quotes/{id}
const updateQuote = async (id, quoteData) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData)
  });
  return await response.json();
};
```

### Eliminar cotización
```javascript
// DELETE /api/quotes/{id}
const deleteQuote = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};
```

### Asignar asesor a cotización
```javascript
// PUT /api/quotes/{quoteId}/assign/{advisorId}
const assignAdvisor = async (quoteId, advisorId) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/${quoteId}/assign/${advisorId}`, {
    method: 'PUT'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al asignar asesor');
  }
  
  return await response.json();
};
```

### Filtros de cotizaciones

#### Por estado
```javascript
// GET /api/quotes/status/{estado}
const getQuotesByStatus = async (estado) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/status/${estado}`);
  return await response.json();
};
// Estados disponibles: "pendiente", "en_proceso", "completada", "cancelada"
```

#### Por prioridad
```javascript
// GET /api/quotes/priority/{prioridad}
const getQuotesByPriority = async (prioridad) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/priority/${prioridad}`);
  return await response.json();
};
// Prioridades disponibles: "alta", "media", "baja"
```

#### Por asesor
```javascript
// GET /api/quotes/advisor/{advisorId}
const getQuotesByAdvisor = async (advisorId) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/advisor/${advisorId}`);
  return await response.json();
};
```

#### Cotizaciones sin asignar
```javascript
// GET /api/quotes/unassigned
const getUnassignedQuotes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/unassigned`);
  return await response.json();
};
```

#### Búsqueda de cotizaciones
```javascript
// GET /api/quotes/search?q={query}
const searchQuotes = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};
```

#### Por tipo de vehículo
```javascript
// GET /api/quotes/vehicle-type?tipo={tipo}
const getQuotesByVehicleType = async (tipo) => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/vehicle-type?tipo=${tipo}`);
  return await response.json();
};
```

#### Estadísticas de cotizaciones
```javascript
// GET /api/quotes/stats
const getQuoteStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/quotes/stats`);
  return await response.json();
};
```

---

## 🔔 API de Notificaciones (`/api/notifications`)

### Obtener todas las notificaciones
```javascript
// GET /api/notifications
const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications`);
  return await response.json();
};
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "tipo": "alert",
    "prioridad": "alta",
    "titulo": "Mantenimiento Requerido",
    "mensaje": "El vehículo ID 5 requiere mantenimiento preventivo",
    "vehiculo": {
      "id": 5,
      "modelo": "Hino 300 Series"
    },
    "quote": null,
    "user": {
      "id": 2,
      "nombre": "Juan Pérez"
    },
    "leido": false,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### Obtener notificación por ID
```javascript
// GET /api/notifications/{id}
const getNotificationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`);
  if (!response.ok) throw new Error('Notificación no encontrada');
  return await response.json();
};
```

### Crear nueva notificación
```javascript
// POST /api/notifications
const createNotification = async (notificationData) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData)
  });
  return await response.json();
};

// Ejemplo de datos:
const notificationData = {
  tipo: "maintenance",
  prioridad: "alta",
  titulo: "Mantenimiento Programado",
  mensaje: "Recordatorio de mantenimiento para vehículo",
  vehiculo: { id: 1 }, // Opcional
  user: { id: 2 }      // Opcional
};
```

### Eliminar notificación
```javascript
// DELETE /api/notifications/{id}
const deleteNotification = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};
```

### Marcar como leída
```javascript
// PUT /api/notifications/{id}/mark-read
const markNotificationAsRead = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/mark-read`, {
    method: 'PUT'
  });
  return response.ok;
};
```

### Marcar todas como leídas
```javascript
// PUT /api/notifications/mark-all-read
const markAllNotificationsAsRead = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
    method: 'PUT'
  });
  return response.ok;
};
```

### Filtros de notificaciones

#### Notificaciones no leídas
```javascript
// GET /api/notifications/unread
const getUnreadNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/unread`);
  return await response.json();
};
```

#### Contador de no leídas
```javascript
// GET /api/notifications/unread/count
const getUnreadCount = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/unread/count`);
  const data = await response.json();
  return data.count;
};
```

#### Por tipo
```javascript
// GET /api/notifications/type/{tipo}
const getNotificationsByType = async (tipo) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/type/${tipo}`);
  return await response.json();
};
// Tipos disponibles: "alert", "maintenance", "fuel", "system", "quote", "user", "vehicle", "sale"
```

#### Por prioridad
```javascript
// GET /api/notifications/priority/{prioridad}
const getNotificationsByPriority = async (prioridad) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/priority/${prioridad}`);
  return await response.json();
};
// Prioridades disponibles: "alta", "media", "baja"
```

#### Por vehículo
```javascript
// GET /api/notifications/vehicle/{vehiculoId}
const getNotificationsByVehicle = async (vehiculoId) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/vehicle/${vehiculoId}`);
  return await response.json();
};
```

#### Por cotización
```javascript
// GET /api/notifications/quote/{quoteId}
const getNotificationsByQuote = async (quoteId) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/quote/${quoteId}`);
  return await response.json();
};
```

#### Por usuario
```javascript
// GET /api/notifications/user/{userId}
const getNotificationsByUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userId}`);
  return await response.json();
};
```

#### Estadísticas de notificaciones
```javascript
// GET /api/notifications/stats
const getNotificationStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/stats`);
  return await response.json();
};
```

---

## 👨‍💼 API de Asesores (`/api/advisors`)

### Obtener asesores activos
```javascript
// GET /api/advisors
// GET /api/advisors/active (alternativo)
const getActiveAdvisors = async () => {
  const response = await fetch(`${API_BASE_URL}/api/advisors`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener asesores');
  }
  
  return await response.json();
};
```

---

## 📁 API de Subida de Archivos (`/api/upload`)

### Subir archivo
```javascript
// POST /api/upload
const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al subir archivo');
  }
  
  return result;
};

// Tipos disponibles: "vehicle", "avatar", "user", "document", "general"
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Imagen subida exitosamente a Cloudinary",
  "url": "https://res.cloudinary.com/dqkdflqyp/image/upload/v1234567890/hino-vehicles/abc123.jpg",
  "publicId": "hino-vehicles/abc123",
  "originalName": "vehiculo.jpg",
  "size": 245760,
  "format": "jpg",
  "type": "vehicle",
  "folder": "hino-vehicles",
  "thumbnailUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_150,h_150/v1234567890/hino-vehicles/abc123.jpg",
  "mediumUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_400,h_300/v1234567890/hino-vehicles/abc123.jpg",
  "largeUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_800,h_600/v1234567890/hino-vehicles/abc123.jpg"
}
```

### Eliminar archivo
```javascript
// DELETE /api/upload?imageUrl={url}
const deleteFile = async (imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/api/upload?imageUrl=${encodeURIComponent(imageUrl)}`, {
    method: 'DELETE'
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al eliminar archivo');
  }
  
  return result;
};
```

### Obtener URLs optimizadas
```javascript
// GET /api/upload/optimize?imageUrl={url}
const getOptimizedUrls = async (imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/api/upload/optimize?imageUrl=${encodeURIComponent(imageUrl)}`);
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al generar URLs optimizadas');
  }
  
  return result.urls;
};
```

---

## 👤 API de Avatares de Usuario (`/api/users/{userId}/avatar`)

### Subir avatar de usuario
```javascript
// POST /api/users/{userId}/avatar
const uploadUserAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/avatar`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al subir avatar');
  }
  
  return result;
};
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Avatar actualizado exitosamente",
  "userId": 1,
  "avatarUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/v1234567890/hino-avatars/user123.jpg",
  "publicId": "hino-avatars/user123",
  "originalName": "avatar.jpg",
  "size": 102400,
  "format": "jpg",
  "thumbnailUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_50,h_50/v1234567890/hino-avatars/user123.jpg",
  "smallUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_100,h_100/v1234567890/hino-avatars/user123.jpg",
  "mediumUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_200,h_200/v1234567890/hino-avatars/user123.jpg",
  "largeUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_400,h_400/v1234567890/hino-avatars/user123.jpg"
}
```

### Eliminar avatar de usuario
```javascript
// DELETE /api/users/{userId}/avatar
const deleteUserAvatar = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/avatar`, {
    method: 'DELETE'
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al eliminar avatar');
  }
  
  return result;
};
```

### Obtener información del avatar
```javascript
// GET /api/users/{userId}/avatar/info
const getUserAvatarInfo = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/avatar/info`);
  return await response.json();
};
```

### Obtener URLs optimizadas del avatar
```javascript
// GET /api/users/{userId}/avatar/optimize
const getOptimizedAvatarUrls = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/avatar/optimize`);
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al generar URLs optimizadas');
  }
  
  return result.urls;
};
```

### Listar usuarios disponibles
```javascript
// GET /api/users/list
const getAvailableUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/list`);
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Error al obtener usuarios');
  }
  
  return result.users;
};
```

---

## 🏥 API de Salud del Sistema (`/api/health`)

### Verificación general de salud
```javascript
// GET /api/health
const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return await response.json();
};
```

**Respuesta:**
```json
{
  "status": "UP",
  "database": "CONNECTED",
  "vehicleCount": 25,
  "notificationCount": 12,
  "timestamp": 1642234567890
}
```

### Verificación de base de datos
```javascript
// GET /api/health/database
const databaseCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health/database`);
  return await response.json();
};
```

### Verificación de usuario específico
```javascript
// GET /api/health/users/{userId}
const checkUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/health/users/${userId}`);
  return await response.json();
};
```

---

## 🛠️ Utilidades y Helpers para Frontend

### Configuración base de API
```javascript
// config/api.js
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG;
```

### Cliente HTTP personalizado
```javascript
// utils/apiClient.js
import API_CONFIG from '../config/api';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: API_CONFIG.HEADERS,
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {}, // Dejar que el navegador establezca Content-Type para FormData
      body: formData
    });
  }
}

export default new ApiClient();
```

### Servicios específicos
```javascript
// services/vehicleService.js
import ApiClient from '../utils/apiClient';

export const vehicleService = {
  getAll: () => ApiClient.get('/api/vehicles'),
  getById: (id) => ApiClient.get(`/api/vehicles/${id}`),
  create: (data) => ApiClient.post('/api/vehicles', data),
  update: (id, data) => ApiClient.put(`/api/vehicles/${id}`, data),
  delete: (id) => ApiClient.delete(`/api/vehicles/${id}`),
  getByType: (type) => ApiClient.get(`/api/vehicles/type/${type}`),
  getByStatus: (status) => ApiClient.get(`/api/vehicles/status/${status}`),
  search: (query) => ApiClient.get(`/api/vehicles/search?q=${encodeURIComponent(query)}`),
  getStats: () => ApiClient.get('/api/vehicles/stats')
};

// services/userService.js
import ApiClient from '../utils/apiClient';

export const userService = {
  getAll: () => ApiClient.get('/api/users'),
  getById: (id) => ApiClient.get(`/api/users/${id}`),
  getByEmail: (email) => ApiClient.get(`/api/users/email/${encodeURIComponent(email)}`),
  create: (data) => ApiClient.post('/api/users', data),
  update: (id, data) => ApiClient.put(`/api/users/${id}`, data),
  delete: (id) => ApiClient.delete(`/api/users/${id}`),
  getByRole: (role) => ApiClient.get(`/api/users/role/${role}`),
  getActiveAdvisors: () => ApiClient.get('/api/users/advisors/active'),
  search: (query) => ApiClient.get(`/api/users/search?q=${encodeURIComponent(query)}`),
  getStats: () => ApiClient.get('/api/users/stats'),
  uploadAvatar: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return ApiClient.upload(`/api/users/${userId}/avatar`, formData);
  },
  deleteAvatar: (userId) => ApiClient.delete(`/api/users/${userId}/avatar`),
  getAvatarInfo: (userId) => ApiClient.get(`/api/users/${userId}/avatar/info`)
};

// services/quoteService.js
import ApiClient from '../utils/apiClient';

export const quoteService = {
  getAll: () => ApiClient.get('/api/quotes'),
  getById: (id) => ApiClient.get(`/api/quotes/${id}`),
  create: (data) => ApiClient.post('/api/quotes', data),
  update: (id, data) => ApiClient.put(`/api/quotes/${id}`, data),
  delete: (id) => ApiClient.delete(`/api/quotes/${id}`),
  assignAdvisor: (quoteId, advisorId) => ApiClient.put(`/api/quotes/${quoteId}/assign/${advisorId}`),
  getByStatus: (status) => ApiClient.get(`/api/quotes/status/${status}`),
  getByAdvisor: (advisorId) => ApiClient.get(`/api/quotes/advisor/${advisorId}`),
  getUnassigned: () => ApiClient.get('/api/quotes/unassigned'),
  search: (query) => ApiClient.get(`/api/quotes/search?q=${encodeURIComponent(query)}`),
  getStats: () => ApiClient.get('/api/quotes/stats')
};

// services/notificationService.js
import ApiClient from '../utils/apiClient';

export const notificationService = {
  getAll: () => ApiClient.get('/api/notifications'),
  getById: (id) => ApiClient.get(`/api/notifications/${id}`),
  create: (data) => ApiClient.post('/api/notifications', data),
  delete: (id) => ApiClient.delete(`/api/notifications/${id}`),
  markAsRead: (id) => ApiClient.put(`/api/notifications/${id}/mark-read`),
  markAllAsRead: () => ApiClient.put('/api/notifications/mark-all-read'),
  getUnread: () => ApiClient.get('/api/notifications/unread'),
  getUnreadCount: () => ApiClient.get('/api/notifications/unread/count'),
  getByType: (type) => ApiClient.get(`/api/notifications/type/${type}`),
  getByUser: (userId) => ApiClient.get(`/api/notifications/user/${userId}`),
  getStats: () => ApiClient.get('/api/notifications/stats')
};

// services/fileService.js
import ApiClient from '../utils/apiClient';

export const fileService = {
  upload: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return ApiClient.upload('/api/upload', formData);
  },
  delete: (imageUrl) => ApiClient.delete(`/api/upload?imageUrl=${encodeURIComponent(imageUrl)}`),
  getOptimizedUrls: (imageUrl) => ApiClient.get(`/api/upload/optimize?imageUrl=${encodeURIComponent(imageUrl)}`)
};
```

### Hook personalizado para manejo de estado
```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Ejemplo de uso:
// const { data: vehicles, loading, error, refetch } = useApi(vehicleService.getAll);
```

### Componente de manejo de errores
```javascript
// components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Utilidades de validación
```javascript
// utils/validation.js
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  phone: (phone) => {
    const re = /^\+?[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength: (value, min) => {
    return value && value.length >= min;
  },
  
  maxLength: (value, max) => {
    return value && value.length <= max;
  },
  
  positiveNumber: (value) => {
    return !isNaN(value) && parseFloat(value) > 0;
  },
  
  year: (value) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(value);
    return year >= 1900 && year <= currentYear + 5;
  }
};

export const validateVehicle = (vehicle) => {
  const errors = {};
  
  if (!validators.required(vehicle.modelo)) {
    errors.modelo = 'El modelo es obligatorio';
  }
  
  if (!validators.required(vehicle.tipo)) {
    errors.tipo = 'El tipo es obligatorio';
  }
  
  if (!validators.required(vehicle.categoria)) {
    errors.categoria = 'La categoría es obligatoria';
  }
  
  if (!validators.positiveNumber(vehicle.precio)) {
    errors.precio = 'El precio debe ser un número positivo';
  }
  
  if (!validators.year(vehicle.año)) {
    errors.año = 'El año debe ser válido';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUser = (user) => {
  const errors = {};
  
  if (!validators.required(user.nombre)) {
    errors.nombre = 'El nombre es obligatorio';
  }
  
  if (!validators.email(user.email)) {
    errors.email = 'El email debe ser válido';
  }
  
  if (user.telefono && !validators.phone(user.telefono)) {
    errors.telefono = 'El teléfono debe ser válido';
  }
  
  if (!validators.required(user.rol)) {
    errors.rol = 'El rol es obligatorio';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Constantes y enums
```javascript
// constants/enums.js
export const VEHICLE_TYPES = {
  CAMION: 'camion',
  BUS: 'bus'
};

export const VEHICLE_STATUS = {
  DISPONIBLE: 'disponible',
  RESERVADO: 'reservado',
  VENDIDO: 'vendido'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  ASESOR: 'asesor',
  SUPERVISOR: 'supervisor',
  VENDEDOR: 'vendedor'
};

export const USER_STATUS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido'
};

export const QUOTE_STATUS = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

export const QUOTE_PRIORITY = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
};

export const NOTIFICATION_TYPES = {
  ALERT: 'alert',
  MAINTENANCE: 'maintenance',
  FUEL: 'fuel',
  SYSTEM: 'system',
  QUOTE: 'quote',
  USER: 'user',
  VEHICLE: 'vehicle',
  SALE: 'sale'
};

export const NOTIFICATION_PRIORITY = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
};

export const FILE_TYPES = {
  VEHICLE: 'vehicle',
  AVATAR: 'avatar',
  USER: 'user',
  DOCUMENT: 'document',
  GENERAL: 'general'
};
```

---

## 🔧 Configuración de Variables de Entorno

### Para desarrollo local (.env.local)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
REACT_APP_CLOUDINARY_CLOUD_NAME=dqkdflqyp
```

### Para producción (.env.production)
```env
REACT_APP_API_URL=https://tu-backend-url.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_CLOUDINARY_CLOUD_NAME=dqkdflqyp
```

---

## 🚨 Manejo de Errores

### Códigos de estado HTTP comunes
- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Solicitud incorrecta (datos inválidos)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Estructura de respuestas de error
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "message": "Detalles adicionales del error",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Manejo de errores en el frontend
```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Error de respuesta del servidor
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data.error || 'Datos inválidos';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error interno del servidor';
      default:
        return data.error || 'Error desconocido';
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Error de configuración
    return error.message || 'Error inesperado';
  }
};
```

---

## 📱 Ejemplos de Implementación en React

### Componente de lista de vehículos
```jsx
// components/VehicleList.jsx
import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import { useApi } from '../hooks/useApi';

const VehicleList = () => {
  const { data: vehicles, loading, error, refetch } = useApi(vehicleService.getAll);
  const [filter, setFilter] = useState('');

  const filteredVehicles = vehicles?.filter(vehicle =>
    vehicle.modelo.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.tipo.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  if (loading) return <div>Cargando vehículos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="vehicle-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar vehículos..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={refetch}>Actualizar</button>
      </div>
      
      <div className="vehicles-grid">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="vehicle-card">
            {vehicle.imagenUrl && (
              <img src={vehicle.imagenUrl} alt={vehicle.modelo} />
            )}
            <h3>{vehicle.modelo}</h3>
            <p>Tipo: {vehicle.tipo}</p>
            <p>Precio: ${vehicle.precio.toLocaleString()}</p>
            <p>Estado: {vehicle.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
```

### Componente de subida de avatar
```jsx
// components/AvatarUpload.jsx
import React, { useState } from 'react';
import { userService } from '../services/userService';

const AvatarUpload = ({ userId, currentAvatarUrl, onAvatarUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const result = await userService.uploadAvatar(userId, file);
      
      if (result.success) {
        onAvatarUpdate(result.avatarUrl);
      } else {
        setError(result.message || 'Error al subir avatar');
      }
    } catch (err) {
      setError(err.message || 'Error al subir avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploading(true);
      setError(null);
      
      const result = await userService.deleteAvatar(userId);
      
      if (result.success) {
        onAvatarUpdate(null);
      } else {
        setError(result.message || 'Error al eliminar avatar');
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        {currentAvatarUrl ? (
          <img src={currentAvatarUrl} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">Sin avatar</div>
        )}
      </div>
      
      <div className="avatar-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          id="avatar-input"
          style={{ display: 'none' }}
        />
        
        <label htmlFor="avatar-input" className="upload-button">
          {uploading ? 'Subiendo...' : 'Cambiar Avatar'}
        </label>
        
        {currentAvatarUrl && (
          <button
            onClick={handleDeleteAvatar}
            disabled={uploading}
            className="delete-button"
          >
            Eliminar
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AvatarUpload;
```

### Componente de notificaciones
```jsx
// components/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error al cargar contador:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, leido: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, leido: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  if (loading) return <div>Cargando notificaciones...</div>;

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>Notificaciones ({unreadCount} sin leer)</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>
      
      <div className="notification-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${!notification.leido ? 'unread' : ''}`}
            onClick={() => !notification.leido && markAsRead(notification.id)}
          >
            <div className="notification-content">
              <h4>{notification.titulo}</h4>
              <p>{notification.mensaje}</p>
              <small>
                {new Date(notification.createdAt).toLocaleString()}
              </small>
            </div>
            <div className={`priority-indicator ${notification.prioridad}`}>
              {notification.prioridad}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
```

---

## 🎯 Mejores Prácticas

### 1. Manejo de Estados de Carga
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Siempre manejar estados de carga y error
const handleApiCall = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await apiCall();
    // Procesar resultado
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. Debounce para Búsquedas
```javascript
import { useMemo, useState, useEffect } from 'react';
import { debounce } from 'lodash';

const useDebounceSearch = (searchFunction, delay = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchFunction(searchQuery);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay),
    [searchFunction, delay]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return { query, setQuery, results, loading };
};
```

### 3. Cache de Datos
```javascript
// utils/cache.js
class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new SimpleCache();
```

### 4. Interceptores de Request/Response
```javascript
// utils/interceptors.js
export const addRequestInterceptor = (config) => {
  // Agregar token de autenticación si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Agregar timestamp para evitar cache
  if (config.method === 'GET') {
    const separator = config.url.includes('?') ? '&' : '?';
    config.url += `${separator}_t=${Date.now()}`;
  }
  
  return config;
};

export const addResponseInterceptor = (response) => {
  // Manejar respuestas exitosas
  return response;
};

export const addErrorInterceptor = (error) => {
  // Manejar errores globalmente
  if (error.response?.status === 401) {
    // Redirigir a login si no está autenticado
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
};
```

---

## 📋 Checklist de Implementación

### ✅ Configuración Inicial
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias necesarias
- [ ] Configurar cliente HTTP
- [ ] Implementar manejo de errores global

### ✅ Servicios de API
- [ ] Implementar servicio de vehículos
- [ ] Implementar servicio de usuarios
- [ ] Implementar servicio de cotizaciones
- [ ] Implementar servicio de notificaciones
- [ ] Implementar servicio de archivos

### ✅ Componentes UI
- [ ] Lista de vehículos con filtros
- [ ] Formulario de vehículos
- [ ] Lista de usuarios
- [ ] Subida de avatares
- [ ] Centro de notificaciones
- [ ] Formulario de cotizaciones

### ✅ Funcionalidades Avanzadas
- [ ] Búsqueda con debounce
- [ ] Cache de datos
- [ ] Paginación
- [ ] Ordenamiento
- [ ] Filtros múltiples
- [ ] Actualización en tiempo real

### ✅ Testing y Optimización
- [ ] Tests unitarios de servicios
- [ ] Tests de integración
- [ ] Optimización de imágenes
- [ ] Lazy loading
- [ ] Error boundaries

---

## 🔗 URLs de Referencia

- **Backend Local**: http://localhost:8080
- **Documentación Swagger**: http://localhost:8080/swagger-ui.html (si está configurado)
- **Health Check**: http://localhost:8080/api/health
- **Cloudinary**: https://cloudinary.com/documentation

---

Esta documentación cubre todos los endpoints disponibles en tu backend de Hino Connect y proporciona ejemplos completos de implementación para el frontend. Asegúrate de adaptar las URLs y configuraciones según tu entorno específico.