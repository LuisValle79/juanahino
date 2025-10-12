import { NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types/vehicle'

// GET /api/vehicles/[id] - Get a specific vehicle by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de vehículo inválido."
      }, { status: 400 })
    }
    
    const vehicle = await VehicleService.getVehicleById(id)
    
    if (!vehicle) {
      return NextResponse.json({ 
        success: false, 
        message: "Vehículo no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener el vehículo."
    }, { status: 500 })
  }
}

// PUT /api/vehicles/[id] - Update a specific vehicle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de vehículo inválido."
      }, { status: 400 })
    }
    
    const data = await request.json()
    
    const vehicle = await VehicleService.updateVehicle(id, data)
    
    if (!vehicle) {
      return NextResponse.json({ 
        success: false, 
        message: "Vehículo no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Vehículo actualizado exitosamente.",
      vehicle
    })
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al actualizar el vehículo."
    }, { status: 500 })
  }
}

// DELETE /api/vehicles/[id] - Delete a specific vehicle
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de vehículo inválido."
      }, { status: 400 })
    }
    
    const deleted = await VehicleService.deleteVehicle(id)
    
    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: "Vehículo no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Vehículo eliminado exitosamente."
    })
  } catch (error: any) {
    console.error("Error deleting vehicle:", error)
    
    // Handle specific error types
    if (error.message && error.message.includes("No se puede eliminar")) {
      return NextResponse.json({ 
        success: false, 
        message: error.message
      }, { status: 409 }) // Conflict
    }
    
    // For other errors, still consider it a success if the vehicle was actually deleted
    try {
      const stillExists = await VehicleService.getVehicleById(parseInt(params.id))
      if (!stillExists) {
        return NextResponse.json({ 
          success: true, 
          message: "Vehículo eliminado exitosamente."
        })
      }
    } catch (checkError) {
      console.error("Error checking if vehicle still exists:", checkError)
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al eliminar el vehículo."
    }, { status: 500 })
  }
}
