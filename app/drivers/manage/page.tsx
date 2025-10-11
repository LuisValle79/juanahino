"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function ManageDriversPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const drivers = [
    {
      id: 1,
      name: "Carlos Mendoza",
      email: "carlos.mendoza@empresa.com",
      phone: "+51 987 654 321",
      license: "A2B-123456",
      vehicle: "HINO-001",
      status: "active",
      experience: "8 años",
      location: "Lima, Perú",
    },
    {
      id: 2,
      name: "Ana García",
      email: "ana.garcia@empresa.com",
      phone: "+51 987 654 322",
      license: "A2B-789012",
      vehicle: "HINO-045",
      status: "active",
      experience: "5 años",
      location: "Callao, Perú",
    },
    {
      id: 3,
      name: "Roberto Silva",
      email: "roberto.silva@empresa.com",
      phone: "+51 987 654 323",
      license: "A2B-345678",
      vehicle: "Sin asignar",
      status: "available",
      experience: "12 años",
      location: "San Isidro, Perú",
    },
    {
      id: 4,
      name: "María López",
      email: "maria.lopez@empresa.com",
      phone: "+51 987 654 324",
      license: "A2B-901234",
      vehicle: "HINO-123",
      status: "maintenance",
      experience: "3 años",
      location: "Miraflores, Perú",
    },
  ]

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "available":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "En Ruta"
      case "available":
        return "Disponible"
      case "maintenance":
        return "En Descanso"
      default:
        return "Inactivo"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Gestionar Conductores</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conductor o vehículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Conductor
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{drivers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Ruta</p>
                    <p className="text-2xl font-bold text-green-600">
                      {drivers.filter((d) => d.status === "active").length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {drivers.filter((d) => d.status === "available").length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Descanso</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {drivers.filter((d) => d.status === "maintenance").length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/generic-placeholder-icon.png?height=48&width=48`} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {driver.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <CardDescription>{driver.experience} de experiencia</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(driver.status)}>{getStatusText(driver.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{driver.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{driver.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{driver.location}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Licencia:</span>
                      <span className="text-sm text-muted-foreground">{driver.license}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Vehículo:</span>
                      <span
                        className={`text-sm font-medium ${
                          driver.vehicle === "Sin asignar" ? "text-muted-foreground" : "text-primary"
                        }`}
                      >
                        {driver.vehicle}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron conductores</h3>
              <p className="text-sm text-muted-foreground">
                Intenta con otros términos de búsqueda o agrega un nuevo conductor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
