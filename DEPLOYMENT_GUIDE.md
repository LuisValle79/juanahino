# 🚀 Guía de Despliegue - HINO Connect

## 📋 Configuración Actual

### Backend (Render)
- **URL:** https://hino-connect-backend.onrender.com
- **Puerto:** 8080
- **Base de datos:** PostgreSQL (Render)

### Frontend (Netlify)
- **URL:** https://hinoconnect-v2.netlify.app
- **Framework:** Next.js 14
- **Build:** Static Export

---

## 🔧 Configuración del Backend (Render)

### Variables de Entorno Requeridas:

```env
# Frontend Configuration
FRONTEND_URL=https://hinoconnect-v2.netlify.app

# Server Configuration
PORT=8080
JAVA_OPTS=-Xmx512m -Xms256m

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dyxf6yb4b
CLOUDINARY_API_KEY=798423798488993
CLOUDINARY_API_SECRET=ruz_E9HAtpKbiyubcPDT_0v1oMk

# Production Environment
ENVIRONMENT=production
BACKEND_URL=https://hino-connect-backend.onrender.com

# Database (Render PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database
```

### Configuración CORS en Spring Boot:

Asegúrate de que tu `@CrossOrigin` incluya la URL de Netlify:

```java
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "http://127.0.0.1:3000", 
    "https://hinoconnect-v2.netlify.app"
})
```

---

## 🌐 Configuración del Frontend (Netlify)

### 1. Variables de Entorno en Netlify Dashboard:

Ve a: **Site Settings > Environment Variables** y agrega:

```env
NEXT_PUBLIC_API_URL=https://hino-connect-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://hinoconnect-v2.netlify.app
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyxf6yb4b
NEXT_PUBLIC_CLOUDINARY_API_KEY=798423798488993
NEXT_PUBLIC_CLOUDINARY_API_SECRET=ruz_E9HAtpKbiyubcPDT_0v1oMk
NEXT_PUBLIC_VERCEL_ANALYTICS_DISABLED=false
```

### 2. Build Settings en Netlify:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

### 3. Deploy Settings:

- **Branch:** main
- **Auto-deploy:** Enabled
- **Build hooks:** Optional

---

## 🔍 Verificación de Despliegue

### 1. Backend Health Check:
```bash
curl https://hino-connect-backend.onrender.com/api/health
```

Respuesta esperada:
```json
{
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": 1234567890
}
```

### 2. Frontend Connection Test:
- Ve a: https://hinoconnect-v2.netlify.app
- Verifica el indicador de conexión en la esquina superior derecha
- Debe mostrar "Conectado" en verde

### 3. API Endpoints Test:
```bash
# Usuarios
curl https://hino-connect-backend.onrender.com/api/users

# Vehículos
curl https://hino-connect-backend.onrender.com/api/vehicles

# Asesores
curl https://hino-connect-backend.onrender.com/api/advisors/active
```

---

## 🚨 Troubleshooting

### Problema: CORS Error
**Solución:** Verificar que la URL de Netlify esté en `@CrossOrigin`

### Problema: 404 en API calls
**Solución:** Verificar que `NEXT_PUBLIC_API_URL` termine en `/api`

### Problema: Imágenes no cargan
**Solución:** Verificar variables de Cloudinary en ambos servicios

### Problema: Build fails en Netlify
**Solución:** 
1. Verificar que todas las variables de entorno estén configuradas
2. Revisar logs de build en Netlify Dashboard
3. Verificar que `package.json` tenga todos los dependencies

---

## 📊 Monitoreo

### Backend (Render):
- **Logs:** Render Dashboard > Logs
- **Metrics:** CPU, Memory, Response time
- **Health:** `/api/health` endpoint

### Frontend (Netlify):
- **Deploy logs:** Netlify Dashboard > Deploys
- **Analytics:** Built-in Netlify Analytics
- **Functions:** Si usas Netlify Functions

---

## 🔄 Proceso de Deploy

### Backend:
1. Push código a GitHub
2. Render auto-deploys desde main branch
3. Verificar logs en Render Dashboard
4. Test health endpoint

### Frontend:
1. Push código a GitHub
2. Netlify auto-deploys desde main branch
3. Verificar build logs
4. Test sitio en producción

---

## 📝 Checklist de Despliegue

### Pre-Deploy:
- [ ] Variables de entorno configuradas en Render
- [ ] Variables de entorno configuradas en Netlify
- [ ] CORS configurado correctamente
- [ ] Base de datos migrada
- [ ] Cloudinary configurado

### Post-Deploy:
- [ ] Health check del backend funciona
- [ ] Frontend carga correctamente
- [ ] API calls funcionan
- [ ] Imágenes de Cloudinary cargan
- [ ] Redes sociales funcionan
- [ ] Notificaciones funcionan
- [ ] Login/logout funciona

### Testing:
- [ ] Crear usuario
- [ ] Subir avatar
- [ ] Crear vehículo
- [ ] Generar cotización
- [ ] Verificar notificaciones
- [ ] Test en móvil
- [ ] Test en diferentes navegadores

---

## 🆘 Contactos de Emergencia

- **Render Support:** https://render.com/docs
- **Netlify Support:** https://docs.netlify.com
- **Cloudinary Support:** https://cloudinary.com/documentation

---

## 📈 Optimizaciones Futuras

1. **CDN:** Configurar Cloudinary CDN
2. **Caching:** Implementar Redis en Render
3. **Monitoring:** Agregar Sentry o similar
4. **Performance:** Optimizar imágenes y assets
5. **Security:** Implementar rate limiting