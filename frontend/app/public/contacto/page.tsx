"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Phone, Mail, MapPin, Send, Truck, Bus, Wrench, User, Building, MessageCircle, 
  CheckCircle, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Check, 
  Calendar, Fuel, Gauge, Star
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { Vehicle } from "@/types/vehicle"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

const quoteSchema = z.object({
  clienteNombre: z.string().min(2, "El nombre es requerido"),
  clienteEmail: z.string().email("Email inválido"),
  clienteTelefono: z.string().min(6, "Teléfono inválido"),
  empresa: z.string().optional(),
  tipoVehiculo: z.string().min(1, "Selecciona un tipo de vehículo"),
  mensaje: z.string().min(10, "Por favor proporciona más detalles"),
})

const contactSchema = z.object({
  cliente_nombre: z.string().min(2, "El nombre es requerido"),
  cliente_email: z.string().email("Email inválido"),
  cliente_telefono: z.string().min(6, "Teléfono inválido"),
  asunto: z.string().min(5, "El asunto es requerido"),
  mensaje: z.string().min(10, "Por favor proporciona más detalles"),
})

type QuoteFormData = z.infer<typeof quoteSchema>
type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"cotizacion" | "contacto">("cotizacion")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  
  const quoteForm = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      tipoVehiculo: "",
    },
  })
  
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      asunto: "",
    },
  })

  // Cargar vehículos desde la API
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setVehiclesLoading(true)
        const data = await apiClient.getVehicles()
        setVehicles(data)
        setFilteredVehicles(data)
      } catch (error) {
        console.error("Error loading vehicles:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los vehículos disponibles.",
          variant: "destructive",
        })
      } finally {
        setVehiclesLoading(false)
      }
    }

    loadVehicles()
  }, [])

  // Filtrar vehículos por tipo
  useEffect(() => {
    if (selectedVehicleType === "") {
      setFilteredVehicles(vehicles)
    } else {
      setFilteredVehicles(vehicles.filter(v => v.tipo === selectedVehicleType))
    }
  }, [selectedVehicleType, vehicles])

  const vehicleTypes = [
    { id: "", name: "Todos los vehículos", icon: Wrench },
    { id: "camion", name: "Camiones", icon: Truck },
    { id: "bus", name: "Buses", icon: Bus },
  ]

  const steps = [
    { number: 1, title: "Información Personal", description: "Datos de contacto" },
    { number: 2, title: "Seleccionar Vehículo", description: "Elige tu vehículo ideal" },
    { number: 3, title: "Detalles y Confirmación", description: "Mensaje y envío" },
  ]

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onQuoteSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      // Preparar datos según tu estructura de backend
      const quoteData = {
        clienteNombre: data.clienteNombre,
        clienteEmail: data.clienteEmail,
        clienteTelefono: data.clienteTelefono,
        empresa: data.empresa || "",
        tipoVehiculo: selectedVehicle ? `${selectedVehicle.modelo} - ${selectedVehicle.categoria}` : data.tipoVehiculo,
        mensaje: data.mensaje,
        estado: "pendiente",
        prioridad: "media"
      }
      
      // Enviar cotización a la API real
      await apiClient.createQuote(quoteData)
      
      setIsSubmitted(true)
      toast({
        title: "Solicitud enviada",
        description: "Hemos recibido tu solicitud de cotización. Un asesor se contactará contigo pronto.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error submitting quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      setTimeout(() => {
        setIsSubmitted(true)
        toast({
          title: "Mensaje enviado",
          description: "Hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.",
        })
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor inténtalo de nuevo.",
        variant: "destructive",
      })
      console.error("Error submitting contact:", error)
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    quoteForm.reset()
    contactForm.reset()
    setIsSubmitted(false)
    setCurrentStep(1)
    setSelectedVehicle(null)
    setSelectedVehicleType("")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (isSubmitted) {
    return (
      <>
        
        <div className="min-h-screen bg-background">
          <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">¡Gracias por tu solicitud!</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Hemos recibido tu información y un asesor se contactará contigo pronto.
              </p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Solicitud recibida correctamente</h2>
                <p className="text-muted-foreground mb-8">
                  {activeTab === "cotizacion" 
                    ? "Hemos recibido tu solicitud de cotización. Un asesor especializado se pondrá en contacto contigo en las próximas 24 horas hábiles."
                    : "Hemos recibido tu mensaje. Nos pondremos en contacto contigo a la brevedad posible."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetForm} variant="outline">
                    Enviar otra solicitud
                  </Button>
                  <Button onClick={() => router.push("/")}>
                    Volver al inicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  return (
    <>
      
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Solicita una cotización personalizada o contáctanos para cualquier consulta.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>Nuestras oficinas y canales de comunicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Teléfono</h3>
                      <p className="text-muted-foreground">+51 1 614-6400</p>
                      <p className="text-sm text-muted-foreground">Lun-Vie: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">ventas@hinoperu.com.pe</p>
                      <p className="text-sm text-muted-foreground">Soporte: soporte@hino.com.pe</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Dirección</h3>
                      <p className="text-muted-foreground">Av. Argentina 2833, Callao</p>
                      <p className="text-muted-foreground">Lima, Perú</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Horario de Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Lunes - Viernes</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sábado</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingo</span>
                      <span>Cerrado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex border-b">
                    <button
                      className={`pb-3 px-4 font-medium ${activeTab === "cotizacion" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("cotizacion")}
                    >
                      Solicitar Cotización
                    </button>
                    <button
                      className={`pb-3 px-4 font-medium ${activeTab === "contacto" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                      onClick={() => setActiveTab("contacto")}
                    >
                      Contacto General
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === "cotizacion" ? (
                    <div>
                      {/* Progress Steps */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                currentStep >= step.number 
                                  ? "bg-primary border-primary text-white" 
                                  : "border-muted-foreground text-muted-foreground"
                              }`}>
                                {currentStep > step.number ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <span className="text-sm font-medium">{step.number}</span>
                                )}
                              </div>
                              <div className="ml-3 hidden sm:block">
                                <p className={`text-sm font-medium ${
                                  currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                                }`}>
                                  {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                              </div>
                              {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${
                                  currentStep > step.number ? "bg-primary" : "bg-muted"
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)}>
                        {/* Paso 1: Información Personal */}
                        {currentStep === 1 && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="clienteNombre">Nombre Completo *</Label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="clienteNombre"
                                      placeholder="Tu nombre completo"
                                      className="pl-10"
                                      {...quoteForm.register("clienteNombre")}
                                    />
                                  </div>
                                  {quoteForm.formState.errors.clienteNombre && (
                                    <p className="text-sm text-red-500">{quoteForm.formState.errors.clienteNombre.message}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="clienteEmail">Email *</Label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="clienteEmail"
                                      type="email"
                                      placeholder="tu@email.com"
                                      className="pl-10"
                                      {...quoteForm.register("clienteEmail")}
                                    />
                                  </div>
                                  {quoteForm.formState.errors.clienteEmail && (
                                    <p className="text-sm text-red-500">{quoteForm.formState.errors.clienteEmail.message}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="clienteTelefono">Teléfono *</Label>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="clienteTelefono"
                                      placeholder="+51 999 888 777"
                                      className="pl-10"
                                      {...quoteForm.register("clienteTelefono")}
                                    />
                                  </div>
                                  {quoteForm.formState.errors.clienteTelefono && (
                                    <p className="text-sm text-red-500">{quoteForm.formState.errors.clienteTelefono.message}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="empresa">Empresa (Opcional)</Label>
                                  <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="empresa"
                                      placeholder="Nombre de tu empresa"
                                      className="pl-10"
                                      {...quoteForm.register("empresa")}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Paso 2: Seleccionar Vehículo */}
                        {currentStep === 2 && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Selecciona tu Vehículo Ideal</h3>
                              
                              {/* Filtros por tipo */}
                              <div className="mb-6">
                                <Label className="text-sm font-medium mb-3 block">Filtrar por tipo:</Label>
                                <div className="flex gap-3">
                                  {vehicleTypes.map((type) => {
                                    const Icon = type.icon
                                    return (
                                      <Button
                                        key={type.id}
                                        type="button"
                                        variant={selectedVehicleType === type.id ? "default" : "outline"}
                                        onClick={() => setSelectedVehicleType(type.id)}
                                        className="flex items-center gap-2"
                                      >
                                        <Icon className="w-4 h-4" />
                                        {type.name}
                                      </Button>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Carrusel de vehículos */}
                              {vehiclesLoading ? (
                                <div className="text-center py-12">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-muted-foreground">Cargando vehículos disponibles...</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {filteredVehicles.map((vehicle) => (
                                    <Card 
                                      key={vehicle.id} 
                                      className={`cursor-pointer transition-all hover:shadow-lg ${
                                        selectedVehicle?.id === vehicle.id 
                                          ? "ring-2 ring-primary bg-primary/5" 
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setSelectedVehicle(vehicle)
                                        quoteForm.setValue("tipoVehiculo", `${vehicle.modelo} - ${vehicle.categoria}`)
                                      }}
                                    >
                                      <div className="relative">
                                        <img
                                          src={vehicle.imagen_url || "/placeholder.svg"}
                                          alt={vehicle.modelo}
                                          className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                        <div className="absolute top-2 right-2">
                                          {vehicle.estado === "disponible" ? (
                                            <Badge className="bg-green-500">Disponible</Badge>
                                          ) : (
                                            <Badge variant="secondary">No Disponible</Badge>
                                          )}
                                        </div>
                                        {selectedVehicle?.id === vehicle.id && (
                                          <div className="absolute top-2 left-2">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                              <Check className="w-5 h-5 text-white" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <CardContent className="p-4">
                                        <h4 className="font-semibold text-lg mb-2">{vehicle.modelo}</h4>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{vehicle.año}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Fuel className="w-4 h-4" />
                                            <span>{vehicle.motor}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Gauge className="w-4 h-4" />
                                            <span>{vehicle.capacidad}</span>
                                          </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t">
                                          <div className="flex items-center justify-between">
                                            <Badge variant="outline">{vehicle.categoria}</Badge>
                                            <span className="text-lg font-bold text-primary">
                                              {formatPrice(vehicle.precio)}
                                            </span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}

                              {filteredVehicles.length === 0 && !vehiclesLoading && (
                                <div className="text-center py-12">
                                  <p className="text-muted-foreground">No hay vehículos disponibles para este filtro.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Paso 3: Detalles y Confirmación */}
                        {currentStep === 3 && selectedVehicle && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Detalles y Confirmación</h3>
                              
                              {/* Resumen del vehículo seleccionado */}
                              <Card className="mb-6">
                                <CardContent className="p-4">
                                  <div className="flex gap-4">
                                    <img
                                      src={selectedVehicle.imagen_url || "/placeholder.svg"}
                                      alt={selectedVehicle.modelo}
                                      className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-lg">{selectedVehicle.modelo}</h4>
                                      <p className="text-muted-foreground">{selectedVehicle.categoria}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm">
                                        <span>{selectedVehicle.año}</span>
                                        <span>•</span>
                                        <span>{selectedVehicle.motor}</span>
                                        <span>•</span>
                                        <span>{selectedVehicle.capacidad}</span>
                                      </div>
                                      <div className="mt-2">
                                        <span className="text-xl font-bold text-primary">
                                          {formatPrice(selectedVehicle.precio)}
                                        </span>
                                        <span className="text-muted-foreground ml-2">precio de referencia</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <div className="space-y-2">
                                <Label htmlFor="mensaje">Mensaje y Requerimientos *</Label>
                                <div className="relative">
                                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Textarea
                                    id="mensaje"
                                    placeholder="Cuéntanos más sobre tus necesidades: cantidad de vehículos, financiamiento, plazos de entrega, uso específico, etc..."
                                    rows={6}
                                    className="pl-10"
                                    {...quoteForm.register("mensaje")}
                                  />
                                </div>
                                {quoteForm.formState.errors.mensaje && (
                                  <p className="text-sm text-red-500">{quoteForm.formState.errors.mensaje.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Incluye información sobre: cantidad deseada, presupuesto, financiamiento, plazos, uso específico del vehículo, etc.
                                </p>
                              </div>

                              {/* Resumen de confirmación */}
                              <Card className="bg-muted/30">
                                <CardHeader>
                                  <CardTitle className="text-base">Resumen de tu Solicitud</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Contacto:</span>
                                      <p>{quoteForm.watch("clienteNombre")}</p>
                                      <p>{quoteForm.watch("clienteEmail")}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Vehículo:</span>
                                      <p>{selectedVehicle.modelo}</p>
                                      <p className="text-primary font-semibold">{formatPrice(selectedVehicle.precio)}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Anterior
                          </Button>

                          {currentStep < 3 ? (
                            <Button
                              type="button"
                              onClick={nextStep}
                              disabled={
                                (currentStep === 2 && !selectedVehicle) ||
                                (currentStep === 1 && (!quoteForm.watch("clienteNombre") || !quoteForm.watch("clienteEmail") || !quoteForm.watch("clienteTelefono")))
                              }
                              className="flex items-center gap-2"
                            >
                              Siguiente
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              type="submit" 
                              disabled={isSubmitting || !quoteForm.watch("mensaje")} 
                              className="flex items-center gap-2"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Enviar Cotización
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Formulario de contacto general (sin cambios)
                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="contact_nombre">Nombre Completo *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="contact_nombre"
                                placeholder="Tu nombre completo"
                                className="pl-10"
                                {...contactForm.register("cliente_nombre")}
                              />
                            </div>
                            {contactForm.formState.errors.cliente_nombre && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.cliente_nombre.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact_email">Email *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="contact_email"
                                type="email"
                                placeholder="tu@email.com"
                                className="pl-10"
                                {...contactForm.register("cliente_email")}
                              />
                            </div>
                            {contactForm.formState.errors.cliente_email && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.cliente_email.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact_telefono">Teléfono *</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="contact_telefono"
                                placeholder="+51 999 888 777"
                                className="pl-10"
                                {...contactForm.register("cliente_telefono")}
                              />
                            </div>
                            {contactForm.formState.errors.cliente_telefono && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.cliente_telefono.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="asunto">Asunto *</Label>
                            <Input
                              id="asunto"
                              placeholder="¿Sobre qué deseas contactarnos?"
                              {...contactForm.register("asunto")}
                            />
                            {contactForm.formState.errors.asunto && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.asunto.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact_mensaje">Mensaje *</Label>
                          <div className="relative">
                            <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              id="contact_mensaje"
                              placeholder="Escribe tu mensaje aquí..."
                              rows={5}
                              className="pl-10"
                              {...contactForm.register("mensaje")}
                            />
                          </div>
                          {contactForm.formState.errors.mensaje && (
                            <p className="text-sm text-red-500">{contactForm.formState.errors.mensaje.message}</p>
                          )}
                        </div>
                      </div>

                      <CardFooter className="px-0 pb-0 pt-6">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Enviando...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Enviar Mensaje
                            </div>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}