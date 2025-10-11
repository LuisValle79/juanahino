import { NextResponse } from 'next/server'
import { UserService } from '@/services/userService'
import { User } from '@/types/user'

// GET /api/public/advisors - Get all active advisors for public display
export async function GET() {
  try {
    // First get all users with "asesor" role
    const allAdvisors = await UserService.getUsersByRole('asesor')
    
    // Filter to only include active advisors
    const activeAdvisors = allAdvisors.filter(advisor => advisor.estado === 'activo')
    
    return NextResponse.json({ success: true, advisors: activeAdvisors })
  } catch (error) {
    console.error("Error fetching active advisors:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al obtener los asesores activos."
    }, { status: 500 })
  }
}