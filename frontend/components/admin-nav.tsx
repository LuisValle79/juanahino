"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, Truck, Users, FileText, Bell, LogOut, 
  Menu, X, BarChart3, Wrench, ShoppingCart, Car 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/NotificationCenter"
import { useNotifications } from "@/hooks/useNotifications"

// Define the type for navigation items
interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}

export function AdminNav() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const { user, logout } = useAuth()
  const { unreadCount, refresh } = useNotifications()

  const navItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/fleet", icon: Truck, label: "Flota de Vehículos" },
    { href: "/vehicles", icon: Car, label: "Vehículos" },
    { href: "/users", icon: Users, label: "Usuarios" },
    { href: "/quotes", icon: FileText, label: "Cotizaciones" },
    // Removed inventory as it's redundant with vehicles for vehicle sales business
    { href: "/maintenance/schedule", icon: Wrench, label: "Mantenimiento" },
    { href: "/reports", icon: BarChart3, label: "Reportes" },
    { href: "/notifications", icon: Bell, label: "Notificaciones" },
    // Added logout option in sidebar 
    { href: "#", icon: LogOut, label: "Salir", onClick: logout },
  ]

  const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "Administrador"
      case "asesor": return "Asesor"
      case "driver": return "Conductor"
      default: return "Usuario"
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D71920] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-neutral-900">HINO Connect</div>
              <div className="text-xs text-neutral-600">Intranet</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-neutral-600 hover:text-[#D71920] hover:bg-[#D71920]/10"
            onClick={() => setIsNotificationCenterOpen(true)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          <Link href="/" target="_blank">
            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-[#D71920] hover:bg-[#D71920]/10">
              Ver Sitio Público
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-600 hover:text-[#D71920] hover:bg-[#D71920]/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-[#111111] border-r border-[#2A2A2A] shadow-xl z-40">
        {/* User Profile Section */}
        <div className="p-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-[#D71920]/60">
              <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Usuario"} />
              <AvatarFallback className="bg-[#1E1E1E] text-white font-medium">
                {user?.name ? getUserInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || "Usuario"}</div>
              <div className="text-xs text-neutral-400 truncate">{user?.email || "usuario@hino.com"}</div>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#D71920]/15 text-[#D71920] border border-[#D71920]/30">
            {getUserRoleBadge(user?.role || "user")}
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            // Handle logout item separately
            if (item.href === "#") {
              return (
                <button
                  key={item.label}
                  onClick={() => item.onClick?.()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 text-[#C5C5C5] hover:bg-[#1E1E1E] hover:text-white text-left"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 ${
                  isActive 
                    ? "bg-[#D71920] text-white font-medium" 
                    : "text-[#C5C5C5] hover:bg-[#1E1E1E] hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A]">
          <div className="text-xs text-neutral-500 text-center">
            © {new Date().getFullYear()} HINO Motors
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setIsSidebarOpen(false)} />
          <div className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-[#111111] border-r border-[#2A2A2A] z-50 shadow-2xl">
            <div className="p-4 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 border-2 border-[#D71920]/60">
                  <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Usuario"} />
                  <AvatarFallback className="bg-[#1E1E1E] text-white font-medium">
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{user?.name || "Usuario"}</div>
                  <div className="text-xs text-neutral-400 truncate">{user?.email || "usuario@hino.com"}</div>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#D71920]/15 text-[#D71920] border border-[#D71920]/30">
                {getUserRoleBadge(user?.role || "user")}
              </span>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                
                // Handle logout item separately
                if (item.href === "#") {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick?.()  // <-- Add optional chaining here
                        setIsSidebarOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 text-[#C5C5C5] hover:bg-[#1E1E1E] hover:text-white text-left"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 ${
                      isActive 
                        ? "bg-[#D71920] text-white font-medium" 
                        : "text-[#C5C5C5] hover:bg-[#1E1E1E] hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A]">
              <div className="text-xs text-neutral-500 text-center">
                © {new Date().getFullYear()} HINO Motors
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onNotificationUpdate={refresh}
      />
    </>
  )
}
