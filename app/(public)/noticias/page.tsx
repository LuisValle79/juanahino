import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"

const noticias = [
  {
    id: 1,
    titulo: "HINO lanza nueva Serie 500 con tecnología híbrida",
    categoria: "Lanzamiento",
    fecha: "15 de Marzo, 2025",
    resumen:
      "La nueva generación de camiones Serie 500 incorpora tecnología híbrida para mayor eficiencia y menor impacto ambiental.",
    imagen: "/hino-500-hybrid-launch.jpg",
    destacada: true,
  },
  {
    id: 2,
    titulo: "Récord de ventas en el primer trimestre de 2025",
    categoria: "Empresa",
    fecha: "10 de Marzo, 2025",
    resumen: "HINO Perú alcanza cifras históricas con más de 500 unidades vendidas en los primeros tres meses del año.",
    imagen: "/hino-sales-record-celebration.jpg",
    destacada: false,
  },
  {
    id: 3,
    titulo: "Nuevo centro de servicio en Arequipa",
    categoria: "Expansión",
    fecha: "5 de Marzo, 2025",
    resumen:
      "Inauguramos nuestro nuevo centro de servicio técnico en Arequipa para brindar mejor atención al sur del país.",
    imagen: "/hino-service-center-arequipa.jpg",
    destacada: false,
  },
  {
    id: 4,
    titulo: "HINO recibe certificación ISO 14001",
    categoria: "Sostenibilidad",
    fecha: "28 de Febrero, 2025",
    resumen:
      "Nuestra empresa obtiene la certificación internacional en gestión ambiental, reafirmando nuestro compromiso con el planeta.",
    imagen: "/hino-iso-certification.jpg",
    destacada: false,
  },
  {
    id: 5,
    titulo: "Programa de financiamiento especial para MYPES",
    categoria: "Promoción",
    fecha: "20 de Febrero, 2025",
    resumen: "Lanzamos un programa de financiamiento con tasas preferenciales para micro y pequeñas empresas.",
    imagen: "/hino-financing-program.jpg",
    destacada: false,
  },
  {
    id: 6,
    titulo: "HINO participa en Expo Transporte 2025",
    categoria: "Eventos",
    fecha: "15 de Febrero, 2025",
    resumen: "Presentamos nuestra línea completa de vehículos en la feria de transporte más importante del país.",
    imagen: "/hino-expo-transport-booth.jpg",
    destacada: false,
  },
]

export default function NoticiasPage() {
  const noticiaDestacada = noticias.find((n) => n.destacada)
  const otrasNoticias = noticias.filter((n) => !n.destacada)

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Noticias y Novedades</h1>
          <p className="text-xl max-w-2xl mx-auto">Mantente informado sobre las últimas novedades de HINO</p>
        </div>
      </section>

      {/* Featured News */}
      {noticiaDestacada && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Noticia Destacada</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={noticiaDestacada.imagen || "/placeholder.svg"}
                    alt={noticiaDestacada.titulo}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">{noticiaDestacada.categoria}</Badge>
                </div>
                <CardContent className="flex flex-col justify-center p-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{noticiaDestacada.fecha}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{noticiaDestacada.titulo}</h3>
                  <p className="text-muted-foreground text-lg mb-6">{noticiaDestacada.resumen}</p>
                  <Link href={`/noticias/${noticiaDestacada.id}`}>
                    <Button size="lg">
                      Leer Más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Other News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Todas las Noticias</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otrasNoticias.map((noticia) => (
              <Card key={noticia.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={noticia.imagen || "/placeholder.svg"}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary">{noticia.categoria}</Badge>
                </div>

                <CardContent className="pt-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{noticia.fecha}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{noticia.titulo}</h3>
                  <p className="text-muted-foreground line-clamp-3">{noticia.resumen}</p>
                </CardContent>

                <CardFooter>
                  <Link href={`/noticias/${noticia.id}`} className="w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      Leer Más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
