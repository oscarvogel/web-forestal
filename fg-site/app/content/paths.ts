// Every public page: prerendered by react-router.config.ts and listed in sitemap.xml from this one list.
import servicios from './servicios.json'

export const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/servicios/', priority: '0.9', changefreq: 'monthly' },
  ...servicios
    .filter((s) => s.slug !== 'consultoria-forestal')
    .map((s) => ({ path: `/servicios/${s.slug}/`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/consultoria/', priority: '0.8', changefreq: 'monthly' },
  { path: '/nosotros/', priority: '0.7', changefreq: 'monthly' },
  { path: '/trabaja/', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacidad/', priority: '0.3', changefreq: 'yearly' },
  { path: '/terminos/', priority: '0.3', changefreq: 'yearly' },
]
