import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper function to verify auth token
function isAuthenticated(request: NextRequest): boolean {
  try {
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      return false
    }
    
    // Decode and validate token
    const userData = JSON.parse(atob(token.value))
    if (userData.email && userData.role && userData.name) {
      return true
    }
    
    return false
  } catch (e) {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/dashboard']
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  )

  if (isProtectedRoute) {
    // Verificar si está autenticado
    if (!isAuthenticated(request)) {
      // Redirigir al login si no está autenticado
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Permitir el acceso a todas las demás rutas (incluyendo las rutas públicas)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}