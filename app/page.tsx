"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Wrench, Users, Award } from "lucide-react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
          <div className="absolute inset-0 bg-[url('/modern-red-hino-truck-on-highway.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/70" />
          
          <div className="relative z-20 container mx-auto px-4 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-hino-red/20 backdrop-blur-sm rounded-full text-sm font-medium border border-hino-red/30">
                  Tecnología Japonesa - Servicio Peruano
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Tu Hino y tú más <span className="text-hino-red">conectados</span> que nunca
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 text-pretty max-w-3xl mx-auto font-light">
                Líderes en venta de camiones y buses comerciales. Calidad, confianza y tecnología al servicio de tu negocio.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/public/catalogo">
                  <Button size="lg" className="text-lg px-8 py-6 bg-hino-red hover:bg-hino-red/90">
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="/public/contacto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-primary"
                  >
                    Solicitar Cotización
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center p-1">
              <div className="w-2 h-2 bg-white rounded-full mt-1"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">+5000</div>
                <div className="text-lg opacity-90">Vehículos Vendidos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">+15</div>
                <div className="text-lg opacity-90">Años de Experiencia</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">+200</div>
                <div className="text-lg opacity-90">Asesores Expertos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-lg opacity-90">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir HINO?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubre las ventajas que hacen de HINO la mejor opción para tu negocio
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-hino-red/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-hino-red/20 transition-colors">
                    <Truck className="w-8 h-8 text-hino-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Tecnología Japonesa</h3>
                  <p className="text-muted-foreground">
                    Motores eficientes y duraderos con tecnología de vanguardia japonesa
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-hino-red/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-hino-red/20 transition-colors">
                    <Wrench className="w-8 h-8 text-hino-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Servicio Integral</h3>
                  <p className="text-muted-foreground">
                    Mantenimiento, repuestos y soporte técnico especializado
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-hino-red/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-hino-red/20 transition-colors">
                    <Users className="w-8 h-8 text-hino-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Asesoría Personalizada</h3>
                  <p className="text-muted-foreground">
                    Expertos que entienden tus necesidades y te guían en la elección
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-hino-red/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-hino-red/20 transition-colors">
                    <Award className="w-8 h-8 text-hino-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Calidad Certificada</h3>
                  <p className="text-muted-foreground">
                    Estándares internacionales de calidad y seguridad en cada vehículo
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Vehículos Destacados</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubre la gama de camiones y buses comerciales HINO
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="relative rounded-xl overflow-hidden group">
                <div className="bg-gradient-to-t from-black/80 to-transparent absolute inset-0 z-10" />
                <img 
                  src="/hino-300-series-white-truck.jpg" 
                  alt="HINO Serie 300" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                  <span className="inline-block px-3 py-1 bg-hino-red text-xs font-bold rounded-full mb-2">CAMIÓN LIGERO</span>
                  <h3 className="text-2xl font-bold mb-1">HINO Serie 300</h3>
                  <p className="mb-4 opacity-90">Ideal para distribución urbana</p>
                  <Link href="/public/catalogo?tipo=camion&categoria=Ligero">
                    <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden group">
                <div className="bg-gradient-to-t from-black/80 to-transparent absolute inset-0 z-10" />
                <img 
                  src="/hino-500-series-red-truck.jpg" 
                  alt="HINO Serie 500" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                  <span className="inline-block px-3 py-1 bg-hino-red text-xs font-bold rounded-full mb-2">CAMIÓN MEDIANO</span>
                  <h3 className="text-2xl font-bold mb-1">HINO Serie 500</h3>
                  <p className="mb-4 opacity-90">Potencia y eficiencia para tu negocio</p>
                  <Link href="/public/catalogo?tipo=camion&categoria=Mediano">
                    <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden group">
                <div className="bg-gradient-to-t from-black/80 to-transparent absolute inset-0 z-10" />
                <img 
                  src="/hino-urban-bus-white.jpg" 
                  alt="HINO Bus Urbano" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                  <span className="inline-block px-3 py-1 bg-hino-red text-xs font-bold rounded-full mb-2">BUS URBANO</span>
                  <h3 className="text-2xl font-bold mb-1">HINO AK Bus</h3>
                  <p className="mb-4 opacity-90">Comfort y eficiencia para transporte urbano</p>
                  <Link href="/public/catalogo?tipo=bus&categoria=Urbano">
                    <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/public/catalogo">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Ver Catálogo Completo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para impulsar tu negocio?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contáctanos hoy y descubre cómo HINO puede ayudarte a llevar tu operación al siguiente nivel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/public/contacto">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Contactar Asesor
                </Button>
              </Link>
              <Link href="/public/catalogo">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                >
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <PublicFooter />
    </>
  )
}