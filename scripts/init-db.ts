#!/usr/bin/env node

/**
 * Script para inicializar la base de datos con datos de ejemplo
 * 
 * Uso:
 *   npm run init-db
 *   # o
 *   yarn init-db
 *   # o
 *   pnpm init-db
 */

import { db } from '../lib/db'
import { VehicleService } from '../services/vehicleService'
import { UserService } from '../services/userService'
import { QuoteService } from '../services/quoteService'

async function initDatabase() {
  console.log('Inicializando base de datos con datos de ejemplo...')
  
  try {
    // Crear vehículos de ejemplo
    console.log('Creando vehículos de ejemplo...')
    const vehicles = [
      {
        modelo: "HINO Serie 300",
        tipo: "camion" as const,
        categoria: "Ligero",
        precio: 45000.00,
        capacidad: "3.5 - 5 toneladas",
        motor: "4.0L Diesel",
        año: 2025,
        estado: "disponible" as const,
        stock: 8,
        imagen_url: "/hino-300-series-white-truck.jpg",
        descripcion: "Camión ligero ideal para transporte de mercancías de corta distancia."
      },
      {
        modelo: "HINO Serie 500",
        tipo: "camion" as const,
        categoria: "Mediano",
        precio: 75000.00,
        capacidad: "8 - 12 toneladas",
        motor: "7.7L Diesel",
        año: 2025,
        estado: "disponible" as const,
        stock: 12,
        imagen_url: "/hino-500-series-red-truck.jpg",
        descripcion: "Camión mediano con excelente rendimiento para transporte regional."
      },
      {
        modelo: "HINO Serie 700",
        tipo: "camion" as const,
        categoria: "Pesado",
        precio: 120000.00,
        capacidad: "15 - 25 toneladas",
        motor: "13.0L Diesel",
        año: 2025,
        estado: "disponible" as const,
        stock: 5,
        imagen_url: "/hino-700-series-heavy-duty-truck.jpg",
        descripcion: "Camión pesado para transporte de larga distancia y carga pesada."
      },
      {
        modelo: "HINO AK Bus Urbano",
        tipo: "bus" as const,
        categoria: "Urbano",
        precio: 95000.00,
        capacidad: "40 - 50 pasajeros",
        motor: "7.7L Diesel",
        año: 2025,
        estado: "disponible" as const,
        stock: 6,
        imagen_url: "/hino-urban-bus-white.jpg",
        descripcion: "Bus urbano con tecnología de punta para transporte de pasajeros en ciudades."
      },
      {
        modelo: "HINO FC Bus Interurbano",
        tipo: "bus" as const,
        categoria: "Interurbano",
        precio: 135000.00,
        capacidad: "45 - 55 pasajeros",
        motor: "8.9L Diesel",
        año: 2025,
        estado: "reservado" as const,
        stock: 3,
        imagen_url: "/hino-intercity-bus-red.jpg",
        descripcion: "Bus interurbano con comodidades premium para viajes de media y larga distancia."
      }
    ]
    
    for (const vehicle of vehicles) {
      await VehicleService.createVehicle(vehicle)
    }
    console.log('✓ Vehículos creados')
    
    // Crear usuarios de ejemplo
    console.log('Creando usuarios de ejemplo...')
    const users = [
      {
        nombre: "Carlos Mendoza",
        email: "carlos.mendoza@hino.com.pe",
        telefono: "+51 999 888 777",
        rol: "asesor" as const,
        especialidad: "Camiones Pesados",
        estado: "activo" as const,
        avatar_url: "/professional-sales-advisor-man.jpg",
        password_hash: "hashed_password_1", // En una implementación real, usar bcrypt
        ventas: 0,
        fecha_ingreso: new Date()
      },
      {
        nombre: "María González",
        email: "maria.gonzalez@hino.com.pe",
        telefono: "+51 999 777 666",
        rol: "asesor" as const,
        especialidad: "Buses Urbanos",
        estado: "activo" as const,
        avatar_url: "/professional-sales-advisor-woman.jpg",
        password_hash: "hashed_password_2",
        ventas: 0,
        fecha_ingreso: new Date()
      },
      {
        nombre: "Roberto Silva",
        email: "roberto.silva@hino.com.pe",
        telefono: "+51 999 666 555",
        rol: "asesor" as const,
        especialidad: "Camiones Ligeros",
        estado: "activo" as const,
        avatar_url: "/professional-sales-advisor-man-suit.jpg",
        password_hash: "hashed_password_3",
        ventas: 0,
        fecha_ingreso: new Date()
      },
      {
        nombre: "Ana Torres",
        email: "ana.torres@hino.com.pe",
        telefono: "+51 999 555 444",
        rol: "admin" as const,
        especialidad: "Administración",
        estado: "activo" as const,
        avatar_url: "/professional-sales-advisor-woman-business.jpg",
        password_hash: "hashed_password_4",
        ventas: 0,
        fecha_ingreso: new Date()
      },
      {
        nombre: "Luis Valle",
        email: "luis.valle@hino.com.pe",
        telefono: "+51 999 444 333",
        rol: "admin" as const,
        especialidad: "Gerencia de Ventas",
        estado: "activo" as const,
        avatar_url: "/placeholder.svg",
        password_hash: "hashed_password_5",
        ventas: 0,
        fecha_ingreso: new Date()
      }
    ]
    
    for (const user of users) {
      await UserService.createUser(user)
    }
    console.log('✓ Usuarios creados')
    
    // Crear cotizaciones de ejemplo
    console.log('Creando cotizaciones de ejemplo...')
    const quotes = [
      {
        cliente_nombre: "Juan Pérez",
        cliente_email: "juan.perez@transportes.com",
        cliente_telefono: "+51 999 111 222",
        empresa: "Transportes Lima SAC",
        tipo_vehiculo: "Camión Pesado",
        mensaje: "Necesito cotización para 3 camiones pesados para transporte de carga",
        estado: "pendiente" as const,
        prioridad: "alta" as const,
        asesor_asignado_id: null
      },
      {
        cliente_nombre: "María González",
        cliente_email: "maria@logistica.com",
        cliente_telefono: "+51 999 222 333",
        empresa: "Logística del Sur",
        tipo_vehiculo: "Bus Urbano",
        mensaje: "Interesada en buses urbanos para transporte público",
        estado: "en-proceso" as const,
        prioridad: "media" as const,
        asesor_asignado_id: 1
      },
      {
        cliente_nombre: "Roberto Silva",
        cliente_email: "roberto@cargo.com",
        cliente_telefono: "+51 999 333 444",
        empresa: "Cargo Express",
        tipo_vehiculo: "Camión Mediano",
        mensaje: "Requiero información sobre camiones medianos",
        estado: "enviada" as const,
        prioridad: "baja" as const,
        asesor_asignado_id: 2
      },
      {
        cliente_nombre: "Ana Martínez",
        cliente_email: "ana@transporte.com",
        cliente_telefono: "+51 999 444 555",
        empresa: "Transporte Nacional",
        tipo_vehiculo: "Bus Interurbano",
        mensaje: "Necesito cotización urgente para buses interurbanos",
        estado: "pendiente" as const,
        prioridad: "alta" as const,
        asesor_asignado_id: null
      }
    ]
    
    for (const quote of quotes) {
      await QuoteService.createQuote(quote)
    }
    console.log('✓ Cotizaciones creadas')
    
    // Crear notificaciones de ejemplo relevantes para el negocio de venta de vehículos
    console.log('Creando notificaciones de ejemplo...')
    const notifications = [
      {
        tipo: "alert" as const,
        prioridad: "alta" as const,
        titulo: "Temperatura del motor elevada",
        mensaje: "El vehículo HINO-089 presenta temperatura del motor por encima del rango normal",
        vehiculo_id: 1,
        quote_id: null,
        user_id: null,
        leido: false
      },
      {
        tipo: "maintenance" as const,
        prioridad: "media" as const,
        titulo: "Mantenimiento programado próximo",
        mensaje: "El vehículo HINO-001 tiene mantenimiento programado para mañana",
        vehiculo_id: 2,
        quote_id: null,
        user_id: null,
        leido: false
      },
      {
        tipo: "fuel" as const,
        prioridad: "media" as const,
        titulo: "Nivel de combustible bajo",
        mensaje: "El vehículo HINO-045 tiene menos del 25% de combustible",
        vehiculo_id: 3,
        quote_id: null,
        user_id: null,
        leido: true
      },
      {
        tipo: "user" as const,
        prioridad: "media" as const,
        titulo: "Nuevo usuario registrado",
        mensaje: "Se ha registrado un nuevo usuario: Juan Pérez (asesor)",
        vehiculo_id: null,
        quote_id: null,
        user_id: 1,
        leido: false
      },
      {
        tipo: "vehicle" as const,
        prioridad: "media" as const,
        titulo: "Nuevo vehículo agregado",
        mensaje: "Se ha agregado un nuevo vehículo: HINO Serie 800",
        vehiculo_id: 1,
        quote_id: null,
        user_id: null,
        leido: false
      },
      {
        tipo: "sale" as const,
        prioridad: "alta" as const,
        titulo: "Venta completada",
        mensaje: "Se ha completado una venta de vehículo HINO Serie 500",
        vehiculo_id: 2,
        quote_id: null,
        user_id: null,
        leido: false
      },
      {
        tipo: "quote" as const,
        prioridad: "alta" as const,
        titulo: "Nueva cotización recibida",
        mensaje: "Nueva solicitud de cotización de Juan Pérez para Camión Pesado",
        vehiculo_id: null,
        quote_id: 1,
        user_id: null,
        leido: false
      }
    ]
    
    // Insertar notificaciones directamente ya que el servicio fue modificado
    for (const notification of notifications) {
      await db.query(
        `INSERT INTO notifications (tipo, prioridad, titulo, mensaje, vehiculo_id, quote_id, user_id, leido)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          notification.tipo,
          notification.prioridad,
          notification.titulo,
          notification.mensaje,
          notification.vehiculo_id,
          notification.quote_id,
          notification.user_id,
          notification.leido
        ]
      )
    }
    console.log('✓ Notificaciones creadas')
    
    console.log('\n✅ Base de datos inicializada con éxito!')
    console.log('\nDatos creados:')
    console.log('- 5 vehículos')
    console.log('- 5 usuarios (3 asesores, 2 administradores)')
    console.log('- 4 cotizaciones')
    console.log('- 7 notificaciones')
    
  } catch (error) {
    console.error('Error inicializando la base de datos:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

// Ejecutar si este archivo se llama directamente
if (require.main === module) {
  initDatabase()
}