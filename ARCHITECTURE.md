# Arquitectura del Sistema Hino Connect

## Visión General

Hino Connect Intranet es un sistema de gestión empresarial para Hino que permite administrar la flota de vehículos, usuarios, cotizaciones y notificaciones. La arquitectura sigue un patrón de servicios que interactúan con una base de datos PostgreSQL para almacenar y recuperar información.

## Componentes Principales

### 1. Capa de Presentación (Frontend)
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Componentes UI** basados en Radix UI
- **React Server Components** y Client Components

### 2. Capa de Servicios (Backend)
- **Servicios TypeScript** para lógica de negocio
- **Conexión a PostgreSQL** usando node-postgres
- **Validación de datos** con Zod
- **Formularios** con React Hook Form

### 3. Capa de Datos (Base de Datos)
- **PostgreSQL** (compatible con Neon)
- **Esquema relacional** con claves foráneas
- **Tipos enumerados** para consistencia de datos
- **Índices** para optimización de consultas

## Flujo de Datos

### 1. Visualización de Vehículos
```
Usuario (Admin/Público) → Página de Vehículos → VehicleService → PostgreSQL → VehicleService → Página de Vehículos → Usuario
```

### 2. Gestión de Cotizaciones
```
Cliente (Público) → Formulario de Contacto → QuoteService → PostgreSQL
Administrador → Página de Cotizaciones → QuoteService → PostgreSQL → QuoteService → Página de Cotizaciones → Administrador
```

### 3. Notificaciones
```
Sistema → NotificationService → PostgreSQL
Administrador → Página de Notificaciones → NotificationService → PostgreSQL → NotificationService → Página de Notificaciones → Administrador
```

### 4. Gestión de Usuarios
```
Administrador → Página de Usuarios → UserService → PostgreSQL → UserService → Página de Usuarios → Administrador
```

## Estructura del Proyecto

```
hino-connect-intranet/
├── app/                    # Páginas de la aplicación
│   ├── (admin)/           # Páginas administrativas
│   ├── public/           # Páginas públicas
│   └── ...
├── components/            # Componentes reutilizables
├── services/              # Servicios de negocio
├── types/                 # Definiciones de tipos TypeScript
├── lib/                   # Utilidades y configuración
├── database/              # Scripts de base de datos
└── ...
```

## Servicios

### VehicleService
Gestiona todas las operaciones relacionadas con vehículos:
- `getAllVehicles()` - Obtiene todos los vehículos
- `getVehicleById(id)` - Obtiene un vehículo por ID
- `createVehicle(vehicle)` - Crea un nuevo vehículo
- `updateVehicle(id, vehicle)` - Actualiza un vehículo
- `deleteVehicle(id)` - Elimina un vehículo
- `getVehicleStats()` - Obtiene estadísticas de vehículos

### UserService
Gestiona todas las operaciones relacionadas con usuarios:
- `getAllUsers()` - Obtiene todos los usuarios
- `getUserById(id)` - Obtiene un usuario por ID
- `createUser(user)` - Crea un nuevo usuario
- `updateUser(id, user)` - Actualiza un usuario
- `deleteUser(id)` - Elimina un usuario
- `getUserStats()` - Obtiene estadísticas de usuarios

### QuoteService
Gestiona todas las operaciones relacionadas con cotizaciones:
- `getAllQuotes()` - Obtiene todas las cotizaciones
- `getQuoteById(id)` - Obtiene una cotización por ID
- `createQuote(quote)` - Crea una nueva cotización
- `updateQuote(id, quote)` - Actualiza una cotización
- `deleteQuote(id)` - Elimina una cotización
- `assignAdvisor(quoteId, advisorId)` - Asigna un asesor a una cotización
- `getQuoteStats()` - Obtiene estadísticas de cotizaciones

### NotificationService
Gestiona todas las operaciones relacionadas con notificaciones:
- `getAllNotifications()` - Obtiene todas las notificaciones
- `getNotificationById(id)` - Obtiene una notificación por ID
- `createNotification(notification)` - Crea una nueva notificación
- `markAsRead(id)` - Marca una notificación como leída
- `markAllAsRead()` - Marca todas las notificaciones como leídas
- `deleteNotification(id)` - Elimina una notificación
- `getNotificationStats()` - Obtiene estadísticas de notificaciones

## Tipos de Datos

### Vehicle
```typescript
interface Vehicle {
  id: number
  modelo: string
  tipo: 'camion' | 'bus'
  categoria: string
  precio: number
  capacidad: string
  motor: string
  año: number
  estado: 'disponible' | 'reservado' | 'vendido'
  stock: number
  imagen_url: string
  descripcion?: string
  created_at: Date
  updated_at: Date
}
```

### User
```typescript
interface User {
  id: number
  nombre: string
  email: string
  telefono: string
  rol: 'admin' | 'asesor'
  especialidad: string
  estado: 'activo' | 'inactivo'
  ventas: number
  fecha_ingreso: Date
  avatar_url: string
  password_hash: string
  created_at: Date
  updated_at: Date
}
```

### Quote
```typescript
interface Quote {
  id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  empresa: string
  tipo_vehiculo: string
  mensaje: string
  estado: 'pendiente' | 'en-proceso' | 'enviada' | 'cerrada'
  prioridad: 'alta' | 'media' | 'baja'
  asesor_asignado_id: number | null
  asesor_nombre?: string
  created_at: Date
  updated_at: Date
}
```

### Notification
```typescript
interface Notification {
  id: number
  tipo: 'alert' | 'maintenance' | 'fuel' | 'system' | 'quote'
  prioridad: 'alta' | 'media' | 'baja'
  titulo: string
  mensaje: string
  vehiculo_id: number | null
  quote_id: number | null
  vehiculo_modelo?: string
  quote_cliente?: string
  leido: boolean
  created_at: Date
  updated_at: Date
}
```

## Integración con Neon

El sistema está diseñado para funcionar con Neon, un servicio de PostgreSQL serverless. Para integrar con Neon:

1. Crear una cuenta en [neon.tech](https://neon.tech)
2. Crear un proyecto de PostgreSQL
3. Obtener la cadena de conexión
4. Configurar la variable de entorno `DATABASE_URL`

## Seguridad

- Las contraseñas se almacenan con hash
- Las sesiones se manejan con tokens JWT
- Las variables sensibles se almacenan en variables de entorno
- Validación de datos en todas las entradas

## Escalabilidad

- Uso de índices en columnas frecuentemente consultadas
- Separación de preocupaciones en servicios
- Componentes reutilizables
- Arquitectura basada en servicios

## Mantenimiento

- Scripts de base de datos versionados
- Tipos TypeScript para consistencia
- Servicios con responsabilidades únicas
- Documentación clara de la arquitectura