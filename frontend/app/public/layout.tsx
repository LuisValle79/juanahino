import type React from "react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { SocialFloatingIcons } from "@/components/SocialFloatingIcons"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
      
      {/* Iconos flotantes de redes sociales - Solo en páginas públicas */}
      <SocialFloatingIcons />
    </>
  )
}