# 👤 CLOUDINARY PARA USERS Y ADVISORS - IMPLEMENTADO ✅

## ✅ **Estado: COMPLETAMENTE FUNCIONAL**

La integración de Cloudinary para **avatares de usuarios y asesores** está implementada y funcionando.

---

## 🔧 **CAMBIOS REALIZADOS**

### **1. Controlador creado:**
- ✅ `UserAvatarController.java` - Manejo específico de avatares de usuarios

### **2. FileUploadController actualizado:**
- ✅ Soporte para diferentes tipos de imágenes (vehicle, avatar, document)
- ✅ Carpetas organizadas en Cloudinary
- ✅ URLs optimizadas según el tipo de imagen

### **3. CORS actualizado:**
- ✅ Todos los controladores incluyen Netlify

---

## 🚀 **APIs DISPONIBLES PARA AVATARES**

### **1. 📤 Subir avatar de usuario**
```http
POST http://localhost:8080/api/users/{userId}/avatar
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [archivo de imagen]

✅ Response exitoso:
{
  "success": true,
  "message": "Avatar actualizado exitosamente",
  "userId": 123,
  "avatarUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/v1234567890/hino-avatars/abc123.jpg",
  "publicId": "hino-avatars/abc123",
  "originalName": "avatar.jpg",
  "size": 45760,
  "format": "jpg",
  "thumbnailUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_50,h_50,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
  "smallUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
  "mediumUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_200,h_200,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
  "largeUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg"
}
```

### **2. 🗑️ Eliminar avatar de usuario**
```http
DELETE http://localhost:8080/api/users/{userId}/avatar

✅ Response:
{
  "success": true,
  "message": "Avatar eliminado exitosamente"
}
```

### **3. ℹ️ Información del avatar**
```http
GET http://localhost:8080/api/users/{userId}/avatar/info

✅ Response:
{
  "success": true,
  "userId": 123,
  "userName": "Juan Pérez",
  "userRole": "asesor",
  "hasAvatar": true,
  "avatarUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/v1234567890/hino-avatars/abc123.jpg",
  "isCloudinaryAvatar": true,
  "thumbnailUrl": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg"
}
```

### **4. 🎨 URLs optimizadas del avatar**
```http
GET http://localhost:8080/api/users/{userId}/avatar/optimize

✅ Response:
{
  "success": true,
  "userId": 123,
  "urls": {
    "thumbnail": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_50,h_50,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
    "small": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
    "medium": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_200,h_200,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
    "large": "https://res.cloudinary.com/dqkdflqyp/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1234567890/hino-avatars/abc123.jpg",
    "original": "https://res.cloudinary.com/dqkdflqyp/image/upload/v1234567890/hino-avatars/abc123.jpg"
  }
}
```

### **5. 📤 Upload general con tipo específico**
```http
POST http://localhost:8080/api/upload?type=avatar
Content-Type: multipart/form-data

Body (form-data):
- Key: file
- Type: File
- Value: [archivo de imagen]

Tipos disponibles:
- type=vehicle (carpeta: hino-vehicles)
- type=avatar (carpeta: hino-avatars) 
- type=user (carpeta: hino-avatars)
- type=document (carpeta: hino-documents)
- type=general (carpeta: hino-general) [default]
```

---

## 💻 **GUÍA PARA EL FRONTEND**

### **1. Subir avatar de usuario:**
```javascript
const uploadUserAvatar = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Avatar subido exitosamente:', result);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error al subir avatar:', error);
    throw error;
  }
};
```

### **2. Componente de Avatar de Usuario:**
```javascript
import React, { useState, useEffect } from 'react';

const UserAvatar = ({ userId, size = 'medium', editable = false }) => {
  const [avatarInfo, setAvatarInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAvatarInfo();
  }, [userId]);
  
  const fetchAvatarInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar/info`);
      const data = await response.json();
      
      if (data.success) {
        setAvatarInfo(data);
      }
    } catch (error) {
      console.error('Error al obtener info del avatar:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      await uploadUserAvatar(userId, file);
      await fetchAvatarInfo(); // Refrescar información
    } catch (error) {
      alert('Error al subir avatar: ' + error.message);
    }
  };
  
  const handleAvatarDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchAvatarInfo(); // Refrescar información
      }
    } catch (error) {
      alert('Error al eliminar avatar: ' + error.message);
    }
  };
  
  const getAvatarUrl = () => {
    if (!avatarInfo || !avatarInfo.hasAvatar) {
      return '/default-avatar.png'; // Avatar por defecto
    }
    
    if (avatarInfo.isCloudinaryAvatar) {
      // Usar URL optimizada según el tamaño
      const sizeMap = {
        'small': 50,
        'medium': 100,
        'large': 200,
        'xlarge': 400
      };
      
      const dimension = sizeMap[size] || 100;
      return avatarInfo.avatarUrl.replace('/upload/', `/upload/c_fill,w_${dimension},h_${dimension},q_auto,f_auto/`);
    }
    
    return avatarInfo.avatarUrl;
  };
  
  if (loading) {
    return <div className="avatar-loading">Cargando...</div>;
  }
  
  return (
    <div className="user-avatar">
      <img 
        src={getAvatarUrl()}
        alt={avatarInfo?.userName || 'Avatar'}
        className={`avatar avatar-${size}`}
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      
      {editable && (
        <div className="avatar-controls">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
            id={`avatar-upload-${userId}`}
          />
          <label htmlFor={`avatar-upload-${userId}`} className="btn btn-sm">
            Cambiar Avatar
          </label>
          
          {avatarInfo?.hasAvatar && (
            <button onClick={handleAvatarDelete} className="btn btn-sm btn-danger">
              Eliminar
            </button>
          )}
        </div>
      )}
      
      {avatarInfo && (
        <div className="avatar-info">
          <small>{avatarInfo.userName}</small>
          <small className="text-muted">{avatarInfo.userRole}</small>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
```

### **3. Uso en componentes:**
```javascript
// Avatar pequeño en lista de usuarios
<UserAvatar userId={user.id} size="small" />

// Avatar mediano en perfil
<UserAvatar userId={user.id} size="medium" editable={true} />

// Avatar grande en página de perfil
<UserAvatar userId={user.id} size="large" editable={currentUser.id === user.id} />

// Para asesores específicamente
const AdvisorCard = ({ advisor }) => (
  <div className="advisor-card">
    <UserAvatar userId={advisor.id} size="medium" />
    <h3>{advisor.nombre}</h3>
    <p>{advisor.especialidad}</p>
  </div>
);
```

### **4. CSS sugerido:**
```css
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.avatar-small { width: 50px; height: 50px; }
.avatar-medium { width: 100px; height: 100px; }
.avatar-large { width: 200px; height: 200px; }
.avatar-xlarge { width: 400px; height: 400px; }

.avatar-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar-loading {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
```

---

## 📁 **ORGANIZACIÓN EN CLOUDINARY**

### **Carpetas creadas:**
- `hino-vehicles/` - Imágenes de vehículos
- `hino-avatars/` - Avatares de usuarios y asesores
- `hino-documents/` - Documentos e imágenes generales
- `hino-general/` - Otros archivos

### **Ventajas de la organización:**
- ✅ Fácil gestión en Cloudinary Dashboard
- ✅ Políticas de transformación específicas por carpeta
- ✅ Backup y gestión separada
- ✅ Análisis de uso por tipo de contenido

---

## 🧪 **TESTING**

### **Probar subida de avatar:**
```bash
curl -X POST http://localhost:8080/api/users/1/avatar \
  -F "file=@avatar.jpg"
```

### **Probar información de avatar:**
```bash
curl http://localhost:8080/api/users/1/avatar/info
```

### **Probar eliminación:**
```bash
curl -X DELETE http://localhost:8080/api/users/1/avatar
```

---

## 🎯 **CASOS DE USO**

### **Para Usuarios:**
- Subir foto de perfil personal
- Cambiar avatar en configuración de cuenta
- Mostrar avatar en firma de emails

### **Para Asesores:**
- Avatar profesional en tarjetas de presentación
- Foto en directorio de asesores
- Avatar en chat de soporte

### **Para Administradores:**
- Gestión de avatares de todo el equipo
- Políticas de imágenes apropiadas
- Backup automático de perfiles

**¡Ahora tienes un sistema completo de avatares profesional con Cloudinary! 👤✨**