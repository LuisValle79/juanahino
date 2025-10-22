import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Bus, Award, Users, TrendingUp, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <img
          src="/modern-red-hino-truck-on-highway.jpg"
          alt="HINO Truck"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Tu Hino y tú más conectados que nunca</h1>
          <p className="text-xl md:text-2xl mb-8 text-pretty max-w-3xl mx-auto">
            Líderes en venta de camiones y buses comerciales. Calidad, confianza y tecnología al servicio de tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public/catalogo">
              <Button size="lg" className="text-lg px-8">
                Ver Catálogo
              </Button>
            </Link>
            <Link href="/public/contacto">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-primary"
              >
                Solicitar Cotización
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Por qué elegir HINO?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
                <p className="text-muted-foreground">
                  Vehículos de la más alta calidad con tecnología japonesa reconocida mundialmente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Asesoría Especializada</h3>
                <p className="text-muted-foreground">
                  Equipo de asesores expertos para ayudarte a encontrar el vehículo perfecto para tu negocio.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Soporte Total</h3>
                <p className="text-muted-foreground">
                  Servicio post-venta, repuestos originales y mantenimiento especializado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nuestros Vehículos</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Descubre nuestra amplia gama de camiones y buses comerciales
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/red-hino-commercial-truck.jpg"
                  alt="Camiones HINO"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Truck className="h-8 w-8 mb-2" />
                  <h3 className="text-2xl font-bold">Camiones</h3>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Camiones de carga ligera, mediana y pesada para todo tipo de operaciones comerciales.
                </p>
                <Link href="/public/catalogo?tipo=camion">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Camiones
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/modern-hino-bus.jpg"
                  alt="Buses HINO"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Bus className="h-8 w-8 mb-2" />
                  <h3 className="text-2xl font-bold">Buses</h3>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Buses urbanos e interurbanos con la mejor tecnología y confort para pasajeros.
                </p>
                <Link href="/public/catalogo?tipo=bus">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Buses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para impulsar tu negocio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y descubre cómo HINO puede ayudarte a llevar tu operación al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public/contacto">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                Contactar Asesor
              </Button>
            </Link>
            <Link href="/public/catalogo">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}