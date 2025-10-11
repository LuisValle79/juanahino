import { NextResponse } from 'next/server'
import { UserService } from '@/services/userService'

// POST /api/auth/login - Authenticate user
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: "Email y contraseña son requeridos."
      }, { status: 400 })
    }
    
    // Authenticate user
    const user = await UserService.authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "Credenciales incorrectas."
      }, { status: 401 })
    }
    
    // Return user data (without password hash)
    const { password_hash, ...userData } = user
    
    return NextResponse.json({ 
      success: true, 
      message: "Autenticación exitosa.",
      user: userData
    })
  } catch (error) {
    console.error("Error during authentication:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema durante la autenticación."
    }, { status: 500 })
  }
}