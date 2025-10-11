import { NextResponse } from 'next/server'
import { UserService } from '@/services/userService'
import { User } from '@/types/user'

// GET /api/users - Get all users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    
    let users: User[]
    
    if (role) {
      users = await UserService.getUsersByRole(role)
    } else if (status) {
      users = await UserService.getUsersByStatus(status)
    } else {
      users = await UserService.getAllUsers()
    }
    
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener los usuarios."
    }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const user = await UserService.createUser({
      ...data,
      ventas: data.ventas || 0,
      fecha_ingreso: data.fecha_ingreso ? new Date(data.fecha_ingreso) : new Date()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: "Usuario creado exitosamente.",
      user
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al crear el usuario."
    }, { status: 500 })
  }
}