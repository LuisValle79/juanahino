import { NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types/vehicle'

// GET /api/vehicles - Get all vehicles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    let vehicles: Vehicle[]
    
    if (type) {
      vehicles = await VehicleService.getVehiclesByType(type)
    } else if (status) {
      vehicles = await VehicleService.getVehiclesByStatus(status)
    } else {
      vehicles = await VehicleService.getAllVehicles()
    }
    
    return NextResponse.json({ success: true, vehicles })
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener los vehículos."
    }, { status: 500 })
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const vehicle = await VehicleService.createVehicle(data)
    
    return NextResponse.json({ 
      success: true, 
      message: "Vehículo creado exitosamente.",
      vehicle
    })
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al crear el vehículo."
    }, { status: 500 })
  }
}