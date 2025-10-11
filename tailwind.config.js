/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎯 Paleta corporativa HINO Connect (sin gradientes)
        'hino-red': '#DC2626',        // Rojo principal
        'hino-dark': '#8B0A1F',       // Rojo profundo corporativo
        'hino-light': '#FDE8EA',      // Fondo claro para hover o resaltados
        'hino-yellow': '#FFD700',     // Amarillo para advertencias o badges
        'hino-blue': '#005EB8',       // Azul profesional para botones secundarios
        'hino-green': '#28A745',      // Verde para estados positivos (éxito)

        // 🎨 Colores neutros complementarios
        'hino-gray': '#F5F6F7',       // Fondo general de la intranet
        'hino-border': '#E5E7EB',     // Bordes sutiles
        'hino-text': '#1F2937',       // Texto principal (gris oscuro)
        'hino-subtext': '#6B7280',    // Texto secundario (gris medio)
        'hino-hover': '#F3F4F6',      // Hover claro para tarjetas o filas

        // ⚙️ Estados de interfaz
        'hino-error': '#DC2626',      // Error / eliminar
        'hino-warning': '#FBBF24',    // Advertencia
        'hino-success': '#16A34A',    // Confirmaciones
        'hino-info': '#2563EB',       // Información / azul notificación
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Fuente moderna y profesional
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.05)', // Sombras sutiles para un look limpio
        'card': '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
