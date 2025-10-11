import { NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'

// GET /api/vehicles/stats - Get vehicle statistics
export async function GET() {
  try {
    const stats = await VehicleService.getVehicleStats()
    
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching vehicle stats:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener las estadísticas de vehículos."
    }, { status: 500 })
  }
}