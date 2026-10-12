import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('servicios', 'routes/servicios.tsx'),
  route('servicios/:slug', 'routes/servicio.tsx'),
  route('consultoria', 'routes/consultoria.tsx'),
  route('nosotros', 'routes/nosotros.tsx'),
  route('trabaja', 'routes/trabaja.tsx'),
  route('privacidad', 'routes/privacidad.tsx'),
  route('terminos', 'routes/terminos.tsx'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route('robots.txt', 'routes/robots.ts'),
  route('llms.txt', 'routes/llms.ts'),
] satisfies RouteConfig
