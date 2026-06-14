/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Escala invertida: Convierte el tema oscuro en un tema claro "Blanco Plateado"
        slate: {
          950: '#ffffff', // Blanco puro (antes negro puro)
          900: '#f8f9fa', // Blanco plateado base para el fondo principal
          800: '#e9ecef', // Plateado claro para tarjetas
          700: '#dee2e6', // Plateado para bordes
          600: '#ced4da',
          500: '#adb5bd',
          400: '#6c757d', // Textos secundarios
          300: '#495057', // Etiquetas (labels)
          200: '#111111', // Textos principales (casi negro puro)
          100: '#000000', // Títulos destacados (negro puro)
          50:  '#000000', // Negro puro
        },
        // Azul para acentos principales
        indigo: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#2563eb', // Más oscuro para mejor contraste en textos
          500: '#3b82f6', // Azul principal
          600: '#1d4ed8', // Botones (hover)
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0a192f',
        },
        // Verde oscuro para contrastar en modo claro
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#16a34a', // Verde oscuro para mejor contraste en textos ($45,200)
          500: '#22c55e', 
          600: '#15803d', // Botones
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
          950: '#02180b',
        }
      }
    },
  },
  plugins: [],
}
