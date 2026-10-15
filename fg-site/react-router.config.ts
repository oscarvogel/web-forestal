import type { Config } from '@react-router/dev/config'
import { pages } from './app/content/paths'

// Static HTML per route (SEO) served by the existing Apache host, next to enviar_mensaje.php.
// Unknown URLs get __spa-fallback.html (see public/.htaccess), which renders the root ErrorBoundary as a 404.
export default {
  ssr: false,
  prerender: [...pages.map((p) => p.path), '/sitemap.xml', '/robots.txt', '/llms.txt'],
} satisfies Config
