import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { AppProvider } from '@/lib/context/AppContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'HINO Connect - Sistema de Gestión',
  description: 'Sistema de gestión integral para HINO',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <ErrorBoundary>
          <AppProvider>
            {children}
          </AppProvider>
        </ErrorBoundary>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
