# Hino Connect Intranet - Base de Datos

## Configuración de la Base de Datos

Este proyecto utiliza PostgreSQL como base de datos. Puedes usar una instalación local de PostgreSQL o Neon (PostgreSQL serverless).

### Opción 1: Usar Neon (Recomendado)

1. Visita [Neon](https://neon.tech/) y crea una cuenta gratuita
2. Crea un nuevo proyecto de PostgreSQL
3. Copia la cadena de conexión (Connection String)
4. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL=tu_cadena_de_conexion_de_neon
AUTH_SECRET=hino-connect-secret-key
```

### Opción 2: Instalación Local de PostgreSQL

1. Instala PostgreSQL en tu sistema:
   - Windows: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. Inicia el servicio de PostgreSQL:
   - Windows: Inicia el servicio desde Servicios
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. Crea la base de datos:
```bash
createdb hino_connect
```

4. Crea un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hino_connect
AUTH_SECRET=hino-connect-secret-key
```

## Creación del Esquema de Base de Datos

1. Asegúrate de tener instaladas las dependencias del proyecto:
```bash
npm install
# o
yarn install
# o
pnpm install
```

2. Ejecuta el script de creación del esquema:
```bash
psql -d hino_connect -f database/schema.sql
```

O si estás usando Neon, puedes ejecutar el contenido del archivo `database/schema.sql` en el editor de Neon.

## Estructura de la Base de Datos

La base de datos incluye las siguientes tablas:

1. **vehicles** - Flota de vehículos
2. **users** - Usuarios del sistema (administradores y asesores)
3. **quotes** - Solicitudes de cotización
4. **notifications** - Notificaciones del sistema
5. **vehicle_images** - Imágenes adicionales de vehículos
6. **quote_attachments** - Archivos adjuntos a cotizaciones

## Tipos de Datos Personalizados

El esquema define los siguientes tipos enumerados:

- `vehicle_type`: camion, bus
- `vehicle_status`: disponible, reservado, vendido
- `quote_status`: pendiente, en-proceso, enviada, cerrada
- `quote_priority`: alta, media, baja
- `user_role`: admin, asesor
- `user_status`: activo, inactivo
- `notification_type`: alert, maintenance, fuel, system, quote
- `notification_priority`: alta, media, baja

## Índices

Se han creado índices en las columnas más consultadas para mejorar el rendimiento:

- Índices en vehículos por tipo y estado
- Índices en usuarios por rol y estado
- Índices en cotizaciones por estado y prioridad
- Índices en notificaciones por estado y tipo

## Datos de Ejemplo

El script incluye datos de ejemplo para:

- Vehículos (5 modelos de camiones y buses)
- Usuarios (5 usuarios: 3 asesores y 2 administradores)
- Cotizaciones (4 solicitudes de ejemplo)
- Notificaciones (3 notificaciones de ejemplo)

## Servicios

El proyecto incluye servicios para interactuar con la base de datos:

- `VehicleService` - Gestión de vehículos
- `UserService` - Gestión de usuarios
- `QuoteService` - Gestión de cotizaciones
- `NotificationService` - Gestión de notificaciones

## Tipos TypeScript

Se han definido tipos TypeScript para cada entidad:

- `Vehicle` - Vehículo
- `User` - Usuario
- `Quote` - Cotización
- `Notification` - Notificación

## Desarrollo

Para desarrollar con la base de datos:

1. Asegúrate de que el archivo `.env` está configurado correctamente
2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

3. Las páginas administrativas usarán automáticamente la base de datos para:
   - Mostrar y gestionar la flota de vehículos
   - Administrar usuarios
   - Revisar y asignar cotizaciones
   - Ver y gestionar notificaciones

## Problemas Comunes

### Conexión a la Base de Datos

Si tienes problemas de conexión:

1. Verifica que la cadena de conexión en `.env` es correcta
2. Asegúrate de que el servicio de PostgreSQL está corriendo
3. Verifica que las credenciales son correctas

### Permisos

Si recibes errores de permisos:

1. Asegúrate de que el usuario de la base de datos tiene permisos suficientes
2. En Neon, verifica que estás usando la cadena de conexión correcta

## Seguridad

- Nunca commitees archivos `.env` al repositorio
- Usa variables de entorno para almacenar credenciales sensibles
- El archivo `.env.example` muestra el formato esperado sin credenciales reales