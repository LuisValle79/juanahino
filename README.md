# Hino Connect Intranet

## Descripción del Proyecto

Hino Connect Intranet es un sistema de gestión empresarial integral desarrollado para Hino Motors, diseñado para optimizar la administración de flota de vehículos, gestión de usuarios, cotizaciones y notificaciones. Esta plataforma permite una gestión eficiente de los recursos empresariales mediante una interfaz intuitiva y funcionalidades avanzadas.

El sistema está construido con tecnologías modernas y sigue las mejores prácticas de desarrollo web, garantizando un rendimiento óptimo, seguridad y escalabilidad.

## Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework de React con App Router para renderizado del lado del servidor
- **TypeScript** - Tipado estático para mayor seguridad y mantenibilidad
- **Tailwind CSS** - Framework de estilos CSS utility-first
- **React Server Components** - Para renderizado eficiente del lado del servidor
- **Shadcn UI** - Componentes UI reutilizables basados en Radix UI

### Backend
- **API Routes de Next.js** - Endpoints RESTful para la comunicación cliente-servidor
- **Servicios TypeScript** - Lógica de negocio encapsulada en servicios reutilizables
- **PostgreSQL** - Base de datos relacional para almacenamiento de datos
- **node-postgres (pg)** - Cliente PostgreSQL para Node.js

### Herramientas y Utilidades
- **Zod** - Validación de esquemas y tipado en tiempo de ejecución
- **React Hook Form** - Gestión de formularios con validación
- **Recharts** - Visualización de datos y gráficos
- **Lucide React** - Conjunto de iconos SVG optimizados para React

## Arquitectura del Sistema

El proyecto sigue una arquitectura basada en servicios con separación clara de responsabilidades:

```
hino-connect-intranet/
├── app/                    # Páginas y rutas de la aplicación
│   ├── (admin)/           # Área administrativa protegida
│   ├── public/            # Páginas públicas accesibles
│   └── api/              # Endpoints API RESTful
├── components/            # Componentes reutilizables de UI
├── services/              # Servicios de lógica de negocio
├── types/                 # Definiciones de tipos TypeScript
├── lib/                   # Utilidades y configuración
├── database/              # Scripts de base de datos
└── ...
```

## APIs Disponibles

### API de Vehículos
- `GET /api/vehicles` - Obtener todos los vehículos
- `GET /api/vehicles?type=camion` - Filtrar vehículos por tipo
- `GET /api/vehicles?status=disponible` - Filtrar vehículos por estado
- `POST /api/vehicles` - Crear un nuevo vehículo
- `GET /api/vehicles/[id]` - Obtener un vehículo específico por ID
- `PUT /api/vehicles/[id]` - Actualizar un vehículo específico
- `DELETE /api/vehicles/[id]` - Eliminar un vehículo específico

### API de Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear un nuevo usuario
- `GET /api/users/[id]` - Obtener un usuario específico por ID
- `PUT /api/users/[id]` - Actualizar un usuario específico
- `DELETE /api/users/[id]` - Eliminar un usuario específico

### API de Cotizaciones
- `GET /api/quotes` - Obtener todas las cotizaciones
- `POST /api/quotes` - Actualizar estado o asignar asesor a una cotización

### API de Notificaciones
- `GET /api/notifications` - Obtener todas las notificaciones
- `POST /api/notifications/mark-read` - Marcar notificaciones como leídas

### API Pública
- `GET /api/public/vehicles` - Obtener vehículos disponibles para el público
- `GET /api/public/advisors` - Obtener lista de asesores
- `POST /api/auth/login` - Autenticación de usuarios

## Características Principales

### Gestión de Flota
- Catálogo completo de vehículos Hino (camiones y buses)
- Control de inventario y estado de vehículos
- Gestión de imágenes y especificaciones técnicas
- Seguimiento de disponibilidad y stock

### Gestión de Usuarios
- Administración de perfiles de usuarios (administradores y asesores)
- Control de acceso basado en roles
- Seguimiento de rendimiento de asesores

### Sistema de Cotizaciones
- Recepción y procesamiento de solicitudes de cotización
- Asignación automática a asesores
- Seguimiento de estado de cotizaciones
- Priorización por urgencia

### Panel de Notificaciones
- Sistema de alertas en tiempo real
- Notificaciones automáticas por eventos del sistema
- Clasificación por prioridad y tipo

### Informes y Estadísticas
- Dashboards con métricas clave de negocio
- Gráficos de rendimiento y tendencias
- Reportes exportables

## Configuración del Entorno

### Requisitos Previos
- Node.js 18+ o superior
- PostgreSQL 13+ o Neon (PostgreSQL serverless)
- npm, yarn o pnpm

### Variables de Entorno
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hino_connect
AUTH_SECRET=hino-connect-secret-key
```

## Instalación y Desarrollo

1. Clonar el repositorio:
```bash
git clone <repositorio-url>
cd hino-connect-intranet
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Inicializar la base de datos:
```bash
npm run init-db
# o
pnpm init-db
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

6. Acceder a la aplicación:
```
http://localhost:3000
```

## Despliegue

El proyecto está optimizado para desplegarse en Vercel, aunque también puede ejecutarse en cualquier entorno compatible con Node.js.

## Seguridad

- Autenticación basada en tokens JWT
- Contraseñas almacenadas con hash seguro
- Validación de datos en todas las entradas
- Protección contra ataques comunes

## Contribución

1. Crear una rama para tu función (`git checkout -b feature/AmazingFeature`)
2. Realizar tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Publicar la rama (`git push origin feature/AmazingFeature`)
4. Abrir un Pull Request

## Licencia

Este proyecto es propiedad de Hino Motors y está destinado exclusivamente para uso interno.

## Contacto

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo de Hino Connect.