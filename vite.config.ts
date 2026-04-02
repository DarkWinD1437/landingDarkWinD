import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    server: {
      host: true, // Esto permite conexiones desde otros dispositivos en la red local
    },
    // Solo usamos el plugin SSL en `development` (npm run dev)
    plugins: [
      react(),
      tailwindcss(),
      command === 'serve' ? basicSsl() : null,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
