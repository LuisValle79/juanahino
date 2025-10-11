import { NextResponse } from 'next/server'
import { UserService } from '@/services/userService'
import { User } from '@/types/user'

// GET /api/users/[id] - Get a specific user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de usuario inválido."
      }, { status: 400 })
    }
    
    const user = await UserService.getUserById(id)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "Usuario no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener el usuario."
    }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de usuario inválido."
      }, { status: 400 })
    }
    
    const data = await request.json()
    
    // Remove fields that shouldn't be updated directly
    const { id: userId, created_at, updated_at, ventas, fecha_ingreso, password_hash, ...updateData } = data
    
    const user = await UserService.updateUser(id, updateData)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "Usuario no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Usuario actualizado exitosamente.",
      user
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al actualizar el usuario."
    }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "ID de usuario inválido."
      }, { status: 400 })
    }
    
    const deleted = await UserService.deleteUser(id)
    
    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: "Usuario no encontrado."
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Usuario eliminado exitosamente."
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al eliminar el usuario."
    }, { status: 500 })
  }
}