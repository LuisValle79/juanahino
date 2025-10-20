"use client"

import type React from "react"
import { AdminNav } from "@/components/admin-nav"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // El useEffect se encargará de la redirección
  }

  return (
    <>
      <AdminNav />
      <main className="lg:ml-64 pt-16 min-h-screen bg-neutral-50">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </>
  )
}