import { NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types/vehicle'

// GET /api/public/vehicles - Get all active vehicles for public display
export async function GET() {
  try {
    // Get vehicles with "disponible" status (active vehicles)
    const vehicles = await VehicleService.getVehiclesByStatus('disponible')
    
    return NextResponse.json({ success: true, vehicles })
  } catch (error) {
    console.error("Error fetching active vehicles:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener los vehículos disponibles."
    }, { status: 500 })
  }
}