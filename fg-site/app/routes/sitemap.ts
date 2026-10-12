import { pages } from '../content/paths'
import site from '../content/site.json'

// Prerendered at build time to build/client/sitemap.xml.
export function loader() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map((p) => `  <url>\n    <loc>${site.url}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`)
    .join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
