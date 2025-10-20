"use client"

import { useState, useEffect } from 'react'

interface User {
  email: string
  role: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
      
      if (authCookie) {
        const token = authCookie.split('=')[1]
        const userData = JSON.parse(atob(token))
        setUser(userData)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout,
    checkAuth
  }
}