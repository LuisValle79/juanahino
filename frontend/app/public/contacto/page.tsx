"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Send, Truck, Bus, Wrench, User, Building, MessageCircle, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

const quoteSchema = z.object({
  cliente_nombre: z.string().min(2, "El nombre es requerido"),
  cliente_email: z.string().email("Email inválido"),
  cliente_telefono: z.string().min(6, "Teléfono inválido"),
  empresa: z.string().optional(),
  tipo_vehiculo: z.string().min(1, "Selecciona un tipo de vehículo"),
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

const vehicleTypes = [
  { id: "Camión Ligero", name: "Camión Ligero", icon: Truck },
  { id: "Camión Mediano", name: "Camión Mediano", icon: Truck },
  { id: "Camión Pesado", name: "Camión Pesado", icon: Truck },
  { id: "Bus Urbano", name: "Bus Urbano", icon: Bus },
  { id: "Bus Interurbano", name: "Bus Interurbano", icon: Bus },
  { id: "Bus Premium", name: "Bus Premium", icon: Bus },
  { id: "Otro", name: "Otro", icon: Wrench },
]

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"cotizacion" | "contacto">("cotizacion")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const quoteForm = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      tipo_vehiculo: "",
    },
  })
  
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      asunto: "",
    },
  })

  const onQuoteSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      // Send quote data to backend API with required fields
      await apiClient.createQuote({
        ...data,
        estado: "pendiente",
        prioridad: "media"
      })
      
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
      // For demo purposes, we'll just show a success message
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
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
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
                <div className="w-20 h-20 bg-hino-red/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-hino-red" />
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
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Solicita una cotización o contáctanos para cualquier consulta.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        {/* Quote Form */}
        <div className="lg:col-span-2">
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
                <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="cliente_nombre">Nombre Completo *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cliente_nombre"
                            placeholder="Tu nombre completo"
                            className="pl-10"
                            {...quoteForm.register("cliente_nombre")}
                          />
                        </div>
                        {quoteForm.formState.errors.cliente_nombre && (
                          <p className="text-sm text-red-500">{quoteForm.formState.errors.cliente_nombre.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cliente_email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cliente_email"
                            type="email"
                            placeholder="tu@email.com"
                            className="pl-10"
                            {...quoteForm.register("cliente_email")}
                          />
                        </div>
                        {quoteForm.formState.errors.cliente_email && (
                          <p className="text-sm text-red-500">{quoteForm.formState.errors.cliente_email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cliente_telefono">Teléfono *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cliente_telefono"
                            placeholder="+51 999 888 777"
                            className="pl-10"
                            {...quoteForm.register("cliente_telefono")}
                          />
                        </div>
                        {quoteForm.formState.errors.cliente_telefono && (
                          <p className="text-sm text-red-500">{quoteForm.formState.errors.cliente_telefono.message}</p>
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

                    <div className="space-y-2">
                      <Label htmlFor="tipo_vehiculo">Tipo de Vehículo *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {vehicleTypes.map((vehicle) => {
                          const Icon = vehicle.icon
                          return (
                            <div
                              key={vehicle.id}
                              className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                                quoteForm.watch("tipo_vehiculo") === vehicle.id
                                  ? "border-primary bg-primary/10"
                                  : "border-muted hover:border-primary/50"
                              }`}
                              onClick={() => quoteForm.setValue("tipo_vehiculo", vehicle.id)}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <span className="text-sm">{vehicle.name}</span>
                            </div>
                          )
                        })}
                      </div>
                      <input
                        type="hidden"
                        {...quoteForm.register("tipo_vehiculo")}
                      />
                      {quoteForm.formState.errors.tipo_vehiculo && (
                        <p className="text-sm text-red-500">{quoteForm.formState.errors.tipo_vehiculo.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="mensaje"
                          placeholder="Cuéntanos más sobre tus necesidades..."
                          rows={4}
                          className="pl-10"
                          {...quoteForm.register("mensaje")}
                        />
                      </div>
                      {quoteForm.formState.errors.mensaje && (
                        <p className="text-sm text-red-500">{quoteForm.formState.errors.mensaje.message}</p>
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
                          Enviar Solicitud de Cotización
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
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
  )
}