import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Award, Users, TrendingUp } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre HINO</h1>
          <p className="text-xl max-w-2xl mx-auto">Líderes en la venta de camiones y buses comerciales en Perú</p>
        </div>
      </section>

      {/* Historia Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Nuestra Historia</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                HINO Motors es una empresa japonesa con más de 75 años de experiencia en la fabricación de vehículos
                comerciales. En Perú, nos hemos consolidado como líderes en la venta de camiones y buses, ofreciendo
                soluciones de transporte confiables y eficientes para empresas de todos los tamaños.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Nuestra presencia en el mercado peruano se caracteriza por el compromiso con la calidad, la innovación
                tecnológica y el servicio excepcional. Cada vehículo HINO está diseñado con la precisión y excelencia
                que caracteriza a la ingeniería japonesa.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Hoy, somos el socio preferido de miles de empresas en todo el país, ayudándolas a impulsar sus
                operaciones con vehículos que combinan durabilidad, eficiencia y tecnología de vanguardia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Proporcionar soluciones de transporte comercial de clase mundial que impulsen el crecimiento de
                  nuestros clientes, ofreciendo vehículos confiables, eficientes y respaldados por un servicio
                  excepcional que supere las expectativas del mercado peruano.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la marca líder y más confiable en vehículos comerciales en Perú, reconocida por nuestra innovación
                  tecnológica, compromiso con la sostenibilidad y por ser el socio estratégico preferido de las empresas
                  que buscan excelencia en transporte.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calidad</h3>
                <p className="text-muted-foreground">
                  Compromiso inquebrantable con la excelencia en cada vehículo y servicio que ofrecemos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confianza</h3>
                <p className="text-muted-foreground">
                  Construimos relaciones duraderas basadas en la transparencia y el cumplimiento de promesas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovación</h3>
                <p className="text-muted-foreground">
                  Incorporamos constantemente tecnología de vanguardia para mejorar el rendimiento y eficiencia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">75+</div>
              <p className="text-white/80">Años de Experiencia</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <p className="text-white/80">Vehículos Vendidos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <p className="text-white/80">Satisfacción del Cliente</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-white/80">Soporte Técnico</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para ser parte de nuestra historia?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Únete a miles de empresas que confían en HINO para impulsar su crecimiento
          </p>
          <Link href="/contacto">
            <Button size="lg">Contáctanos Hoy</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}