"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Building, Truck, Plus, Trash2, Calculator, Send } from "lucide-react"
import Link from "next/link"

export default function CreateQuotePage() {
  const [quoteData, setQuoteData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    validUntil: "",
    notes: "",
  })

  const [items, setItems] = useState([{ id: 1, vehicle: "", model: "", quantity: 1, unitPrice: 0, total: 0 }])

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id)) + 1
    setItems([...items, { id: newId, vehicle: "", model: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Cotización creada:", { quoteData, items, subtotal, igv, total })
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nueva Cotización</h1>
                <p className="text-xs text-muted-foreground">Crear propuesta comercial</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span>Información del Cliente</span>
                </CardTitle>
                <CardDescription>Datos del cliente para la cotización</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nombre/Empresa *</Label>
                    <Input
                      id="clientName"
                      placeholder="Transportes Lima SAC"
                      value={quoteData.clientName}
                      onChange={(e) => setQuoteData({ ...quoteData, clientName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="contacto@empresa.com"
                      value={quoteData.clientEmail}
                      onChange={(e) => setQuoteData({ ...quoteData, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Teléfono</Label>
                    <Input
                      id="clientPhone"
                      placeholder="+51 999 999 999"
                      value={quoteData.clientPhone}
                      onChange={(e) => setQuoteData({ ...quoteData, clientPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span>Vehículos Cotizados</span>
                    </CardTitle>
                    <CardDescription>Selecciona los vehículos para la cotización</CardDescription>
                  </div>
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Vehículo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Vehículo #{index + 1}</Badge>
                        {items.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Vehículo</Label>
                          <Select value={item.vehicle} onValueChange={(value) => updateItem(item.id, "vehicle", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hino-300">HINO 300 Series</SelectItem>
                              <SelectItem value="hino-500">HINO 500 Series</SelectItem>
                              <SelectItem value="hino-700">HINO 700 Series</SelectItem>
                              <SelectItem value="hino-bus">HINO Bus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Input
                            placeholder="Ej: 816 4x2"
                            value={item.model}
                            onChange={(e) => updateItem(item.id, "model", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Precio Unitario (S/)</Label>
                          <Input
                            type="number"
                            placeholder="150000"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total (S/)</Label>
                          <Input value={item.total.toLocaleString("es-PE")} readOnly className="bg-muted" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quote Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <span>Resumen de Cotización</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="validUntil">Válida Hasta</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={quoteData.validUntil}
                        onChange={(e) => setQuoteData({ ...quoteData, validUntil: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Términos y Condiciones</Label>
                      <Textarea
                        id="notes"
                        placeholder="Condiciones de pago, garantías, entrega..."
                        className="min-h-[120px]"
                        value={quoteData.notes}
                        onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">S/ {subtotal.toLocaleString("es-PE")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGV (18%):</span>
                        <span className="font-medium">S/ {igv.toLocaleString("es-PE")}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">S/ {total.toLocaleString("es-PE")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </Link>
              <div className="flex space-x-3">
                <Button type="button" variant="secondary">
                  <FileText className="w-4 h-4 mr-2" />
                  Guardar Borrador
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Crear y Enviar Cotización
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
