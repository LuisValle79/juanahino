import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type React from "react"
import AdminClientLayout from "./layout.client"

// Helper function to verify auth token server-side
function isAuthenticated() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')
    
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication server-side
  if (!isAuthenticated()) {
    redirect('/login?redirect=/dashboard')
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  )
}
