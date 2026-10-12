import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// FORESTAL_PHP_PORT=8090 forwards the contact form to a local `php -S`, like the Eleventy dev script did.
const phpPort = process.env.FORESTAL_PHP_PORT

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: phpPort ? { proxy: { '/enviar_mensaje.php': `http://127.0.0.1:${phpPort}` } } : undefined,
})
