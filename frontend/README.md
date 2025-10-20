# Hino Connect Frontend

Frontend de la aplicación Hino Connect desarrollado con Next.js 14, React 18 y TypeScript.

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js 18+** instalado
- **npm** o **yarn** instalado
- **Backend ejecutándose** en `http://localhost:8080`

### Instalación y Ejecución

1. **Instalar dependencias:**
```bash
cd frontend
npm install
# o
yarn install
```

2. **Configurar variables de entorno:**
```bash
# Verificar que .env.local contenga:
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Ejecutar en modo desarrollo:**
```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🔧 Configuración de API

### Variables de Entorno (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Cliente API (lib/api.ts)
El cliente API está configurado para conectarse automáticamente con el backend:

```typescript
import { apiClient } from '@/lib/api';

// Ejemplos de uso
const vehicles = await apiClient.getVehicles();
const users = await apiClient.getUsers();
const advisors = await apiClient.getActiveAdvisors();
const quotes = await apiClient.getQuotes();
```

### Hooks Personalizados (hooks/useApi.ts)
```typescript
import { useActiveAdvisors, useVehicles, useUsers } from '@/hooks/useApi';

function MyComponent() {
  const { data: advisors, loading, error } = useActiveAdvisors();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {advisors?.map(advisor => (
        <div key={advisor.id}>{advisor.nombre}</div>
      ))}
    </div>
  );
}
```

## 📋 Endpoints Disponibles

### Vehículos
- `apiClient.getVehicles()` - Obtener todos los vehículos
- `apiClient.getVehicleById(id)` - Obtener vehículo por ID
- `apiClient.createVehicle(data)` - Crear nuevo vehículo
- `apiClient.updateVehicle(id, data)` - Actualizar vehículo
- `apiClient.deleteVehicle(id)` - Eliminar vehículo
- `apiClient.getVehicleStats()` - Estadísticas de vehículos

### Usuarios
- `apiClient.getUsers()` - Obtener todos los usuarios
- `apiClient.getUserById(id)` - Obtener usuario por ID
- `apiClient.createUser(data)` - Crear nuevo usuario
- `apiClient.updateUser(id, data)` - Actualizar usuario
- `apiClient.deleteUser(id)` - Eliminar usuario
- `apiClient.getUserStats()` - Estadísticas de usuarios

### Asesores
- `apiClient.getActiveAdvisors()` - Obtener asesores activos (principal)
- `apiClient.getAdvisors()` - Obtener asesores (alternativo)
- `apiClient.getActiveAdvisorsAlt()` - Obtener asesores activos (alternativo)

### Cotizaciones
- `apiClient.getQuotes()` - Obtener todas las cotizaciones
- `apiClient.getQuoteById(id)` - Obtener cotización por ID
- `apiClient.createQuote(data)` - Crear nueva cotización
- `apiClient.updateQuote(id, data)` - Actualizar cotización
- `apiClient.deleteQuote(id)` - Eliminar cotización
- `apiClient.assignAdvisor(quoteId, advisorId)` - Asignar asesor
- `apiClient.getUnassignedQuotes()` - Cotizaciones sin asignar
- `apiClient.getQuoteStats()` - Estadísticas de cotizaciones

### Notificaciones
- `apiClient.getNotifications()` - Obtener todas las notificaciones
- `apiClient.getUnreadNotifications()` - Obtener notificaciones no leídas
- `apiClient.markNotificationAsRead(id)` - Marcar como leída
- `apiClient.markAllNotificationsAsRead()` - Marcar todas como leídas
- `apiClient.createNotification(data)` - Crear notificación
- `apiClient.deleteNotification(id)` - Eliminar notificación

### Autenticación
- `apiClient.login(email, password)` - Iniciar sesión
- `apiClient.logout()` - Cerrar sesión

### Health Check
- `apiClient.healthCheck()` - Verificar estado del backend

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                     # App Router de Next.js 14
│   ├── (admin)/            # Rutas protegidas de administración
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── users/          # Gestión de usuarios
│   │   ├── fleet/          # Gestión de flota
│   │   └── quotes/         # Gestión de cotizaciones
│   ├── public/             # Páginas públicas
│   │   ├── asesores/       # Lista de asesores
│   │   └── contacto/       # Formulario de contacto
│   ├── login/              # Página de login
│   └── vehicles/           # Catálogo de vehículos
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de UI (shadcn/ui)
│   ├── public-nav.tsx      # Navegación pública
│   └── public-footer.tsx   # Footer público
├── lib/                    # Utilidades y configuración
│   ├── api.ts              # Cliente API
│   ├── utils.ts            # Utilidades generales
│   └── context/            # Contextos de React
├── hooks/                  # Hooks personalizados
│   └── useApi.ts           # Hooks para API
├── .env.local              # Variables de entorno
└── next.config.js          # Configuración de Next.js
```

## 🔗 Conexión con Backend

### Verificar Conexión
```typescript
// Verificar que el backend esté funcionando
const health = await apiClient.healthCheck();
console.log('Backend status:', health);
```

### Manejo de Errores
```typescript
try {
  const data = await apiClient.getVehicles();
  console.log('Vehículos:', data);
} catch (error) {
  console.error('Error al obtener vehículos:', error.message);
}
```

### Ejemplo Completo de Componente
```typescript
'use client'
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await apiClient.getVehicles();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Cargando vehículos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Vehículos Disponibles</h1>
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          <h3>{vehicle.modelo}</h3>
          <p>Precio: ${vehicle.precio}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Ejecutar linter

# Verificación
npm run type-check   # Verificar tipos de TypeScript
```

## 🔧 Solución de Problemas

### Error: "fetch failed" o "connection refused"
**Solución:**
1. Verificar que el backend esté ejecutándose en `http://localhost:8080`
2. Verificar que `NEXT_PUBLIC_API_URL` esté configurado correctamente
3. Verificar que no haya firewall bloqueando el puerto

### Error: "CORS policy"
**Solución:**
1. Verificar que el frontend esté ejecutándose en `http://localhost:3000`
2. El backend debe estar configurado para aceptar requests desde este origen

### Error: "404 Not Found" en endpoints
**Solución:**
1. Verificar que el backend tenga todos los controladores necesarios
2. Verificar que los endpoints estén correctamente mapeados
3. Usar `apiClient.healthCheck()` para verificar conectividad

### Variables de entorno no funcionan
**Solución:**
1. Verificar que el archivo `.env.local` esté en la raíz del proyecto frontend
2. Reiniciar el servidor de desarrollo después de cambiar variables
3. Las variables deben empezar con `NEXT_PUBLIC_` para estar disponibles en el cliente

## 📝 Notas Importantes

1. **Puerto del Frontend:** Debe ejecutarse en puerto 3000
2. **Puerto del Backend:** Debe estar disponible en puerto 8080
3. **Variables de Entorno:** Usar `NEXT_PUBLIC_` para variables del cliente
4. **CORS:** El backend solo acepta requests desde localhost:3000
5. **Hot Reload:** Los cambios se reflejan automáticamente en desarrollo

## 🆘 Comandos de Emergencia

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Verificar conexión con backend
curl http://localhost:8080/api/health

# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL
```

## 📞 Contacto

Si tienes problemas con el frontend, verifica:
1. ✅ Node.js 18+ instalado
2. ✅ Dependencias instaladas (`npm install`)
3. ✅ Variables de entorno configuradas
4. ✅ Backend ejecutándose en puerto 8080
5. ✅ Frontend ejecutándose en puerto 3000