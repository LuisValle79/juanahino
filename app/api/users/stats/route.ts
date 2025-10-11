import { NextResponse } from 'next/server'
import { UserService } from '@/services/userService'

// GET /api/users/stats - Get user statistics
export async function GET() {
  try {
    const stats = await UserService.getUserStats()
    
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener las estadísticas de usuarios."
    }, { status: 500 })
  }
}