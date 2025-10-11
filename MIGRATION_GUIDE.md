# Guía de Migración - Hino Connect Intranet

## Introducción

Esta guía explica cómo migrar el sistema Hino Connect Intranet para usar una base de datos PostgreSQL real en lugar de datos estáticos. La migración incluye la implementación de servicios de base de datos, actualización de páginas y configuración del entorno.

## Pasos de Migración

### 1. Configuración del Entorno

1. Crear un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hino_connect
AUTH_SECRET=hino-connect-secret-key
```

2. Instalar la dependencia de PostgreSQL:
```bash
npm install pg
# o
yarn add pg
# o
pnpm add pg
```

### 2. Creación de la Base de Datos

1. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE hino_connect;
```

2. Ejecutar el script de esquema:
```bash
psql -d hino_connect -f database/schema.sql
```

### 3. Actualización de Páginas

#### Página de Gestión de Flota (`app/(admin)/fleet/page.tsx`)

Cambios principales:
- Reemplazar datos estáticos con llamadas al `VehicleService`
- Agregar manejo de estado de carga
- Implementar funciones de eliminación con la base de datos

#### Página de Gestión de Usuarios (`app/(admin)/users/page.tsx`)

Cambios principales:
- Reemplazar datos estáticos con llamadas al `UserService`
- Agregar manejo de estado de carga
- Implementar funciones de eliminación con la base de datos

#### Página de Gestión de Cotizaciones (`app/(admin)/quotes/page.tsx`)

Cambios principales:
- Reemplazar datos estáticos con llamadas al `QuoteService`
- Agregar manejo de estado de carga
- Implementar funciones de asignación de asesores y cambio de estado

#### Página de Notificaciones (`app/(admin)/notifications/page.tsx`)

Cambios principales:
- Reemplazar datos estáticos con llamadas al `NotificationService`
- Agregar manejo de estado de carga
- Implementar funciones de marcar como leídas

### 4. Creación de Páginas Nuevas

#### Detalle de Vehículo (`app/public/catalogo/[id]/page.tsx`)

Nueva página que muestra los detalles de un vehículo específico, incluyendo:
- Información detallada del vehículo
- Imágenes
- Especificaciones técnicas
- Vehículos relacionados

#### Página de Contacto (`app/public/contacto/page.tsx`)

Nueva página que permite a los clientes solicitar cotizaciones:
- Formulario de contacto con validación
- Envío de solicitudes a la base de datos
- Confirmación de recepción

### 5. Configuración de Servicios

Los servicios se encuentran en el directorio `services/`:

- `VehicleService.ts` - Gestión de vehículos
- `UserService.ts` - Gestión de usuarios
- `QuoteService.ts` - Gestión de cotizaciones
- `NotificationService.ts` - Gestión de notificaciones

### 6. Tipos TypeScript

Los tipos se encuentran en el directorio `types/`:

- `vehicle.ts` - Tipos para vehículos
- `user.ts` - Tipos para usuarios
- `quote.ts` - Tipos para cotizaciones
- `notification.ts` - Tipos para notificaciones

## Verificación de la Migración

### 1. Verificar Conexión a la Base de Datos

Ejecutar el servidor de desarrollo y verificar que no hay errores de conexión:
```bash
npm run dev
```

### 2. Probar Funcionalidades

- [ ] Visualización de vehículos en el catálogo público
- [ ] Gestión de vehículos en el panel administrativo
- [ ] Creación de cotizaciones desde el formulario público
- [ ] Asignación de cotizaciones a asesores
- [ ] Visualización de notificaciones
- [ ] Gestión de usuarios administradores

### 3. Verificar Datos en la Base de Datos

Conectar a la base de datos y verificar que los datos se están almacenando correctamente:
```sql
-- Verificar vehículos
SELECT COUNT(*) FROM vehicles;

-- Verificar usuarios
SELECT COUNT(*) FROM users;

-- Verificar cotizaciones
SELECT COUNT(*) FROM quotes;

-- Verificar notificaciones
SELECT COUNT(*) FROM notifications;
```

## Resolución de Problemas

### Problemas de Conexión

1. Verificar que la cadena de conexión en `.env` es correcta
2. Asegurarse de que el servicio de PostgreSQL está corriendo
3. Verificar que las credenciales son correctas

### Problemas de Permisos

1. Asegurarse de que el usuario tiene permisos suficientes en la base de datos
2. Verificar que las tablas fueron creadas correctamente

### Problemas de Tipos

1. Verificar que los tipos enumerados fueron creados correctamente
2. Asegurarse de que los valores coinciden con las definiciones

## Consideraciones de Rendimiento

### Índices

Se han creado índices en las columnas más consultadas:
- `vehicles(tipo)`
- `vehicles(estado)`
- `users(rol)`
- `users(estado)`
- `quotes(estado)`
- `quotes(prioridad)`
- `notifications(leido)`
- `notifications(tipo)`

### Caching

Para mejorar el rendimiento en producción, considerar implementar:
- Caching de datos frecuentes
- Paginación en listados largos
- Optimización de consultas complejas

## Seguridad

### Variables de Entorno

- Nunca commitear archivos `.env`
- Usar `.env.example` para mostrar el formato esperado
- Validar variables de entorno en tiempo de ejecución

### Validación de Datos

- Validar todas las entradas del usuario
- Usar Zod para validación de esquemas
- Implementar límites en tamaño de datos

### Autenticación

- Proteger rutas administrativas con middleware
- Validar permisos de usuario
- Usar tokens JWT para sesiones

## Mantenimiento

### Actualizaciones de Esquema

Para futuras actualizaciones del esquema de base de datos:
1. Crear scripts de migración incrementales
2. Probar en entorno de desarrollo
3. Aplicar en producción con respaldo

### Monitoreo

- Monitorear tiempos de respuesta de consultas
- Registrar errores de base de datos
- Monitorear uso de recursos

## Conclusión

La migración a una base de datos real mejora significativamente la funcionalidad del sistema Hino Connect Intranet al permitir:

- Persistencia real de datos
- Operaciones CRUD completas
- Notificaciones en tiempo real
- Gestión de usuarios y permisos
- Seguimiento de cotizaciones

Esta guía proporciona todos los pasos necesarios para completar la migración exitosamente.