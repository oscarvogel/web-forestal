import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// FORESTAL_PHP_PORT=8090 forwards the contact form to a local `php -S`, like the Eleventy dev script did.
const phpPort = process.env.FORESTAL_PHP_PORT

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: phpPort ? { proxy: { '/enviar_mensaje.php': `http://127.0.0.1:${phpPort}` } } : undefined,
  // El prerender levanta un preview server en un puerto aleatorio y le pega con fetch.
  // Con el host por defecto escucha en IPv6 (::1) y el fetch de Node sale por
  // 127.0.0.1: ECONNREFUSED y el build falla. Atado a 127.0.0.1 queda determinista.
  preview: { host: '127.0.0.1' },
})
