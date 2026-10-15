// Per-page meta + JSON-LD, ported from the Eleventy components/meta.njk.
import site from '../content/site.json'
import { services } from '../content/servicios'
import images from '../content/images.json'

type Page = {
  title: string
  description: string
  path: string // with trailing slash, e.g. /servicios/
  image?: string // an /images/... source from content (resolved to its generated webp)
  type?: 'website' | 'article'
  breadcrumb?: { name: string; path: string }[] // between Inicio and this page
  extra?: object[] // page-specific JSON-LD
}

const manifest = images as Record<string, { slug: string; widths: number[] }>
const absolute = (path: string) => `${site.url}${path}`

/** Social image: the generated 1280px webp of a page photo (OG needs an absolute URL, not a srcset). */
export function ogImage(src = '/images/actualizadas/cosecha-forestal.png') {
  const image = manifest[src]
  if (!image) return absolute('/images/fg-negative.svg')
  const width = image.widths.find((w) => w >= 1200) ?? image.widths[image.widths.length - 1]
  return absolute(`/img/${image.slug}-${width}.webp`)
}

const organization = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${site.url}/#organization`,
  name: site.name,
  legalName: site.name,
  url: site.url,
  logo: absolute('/images/fg-negative.svg'),
  foundingDate: site.foundingYear,
  description: site.defaultDescription,
  email: site.email,
  telephone: site.telephone,
  areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
  knowsAbout: site.keywords,
  contactPoint: { '@type': 'ContactPoint', telephone: site.telephone, email: site.email, contactType: 'Atención comercial', areaServed: 'AR', availableLanguage: 'es-AR' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios forestales',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.description, url: absolute(s.url), provider: { '@id': `${site.url}/#organization` } },
    })),
  },
}

const website = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url, inLanguage: 'es-AR', publisher: { '@id': `${site.url}/#organization` } }

export function pageMeta({ title, description, path, image, type = 'article', breadcrumb = [], extra = [] }: Page) {
  const url = absolute(path)
  const imageUrl = ogImage(image)
  const isHome = path === '/'
  const trail = [{ name: 'Inicio', path: '/' }, ...breadcrumb, ...(isHome ? [] : [{ name: title.split(' | ')[0], path }])]
  const ld = [
    organization,
    website,
    { '@context': 'https://schema.org', '@type': type === 'article' ? 'Article' : 'WebPage', name: title, headline: title, description, url, image: imageUrl, inLanguage: 'es-AR', isPartOf: { '@id': `${site.url}/#website` }, publisher: { '@id': `${site.url}/#organization` } },
    ...(isHome ? [] : [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absolute(item.path) })) }]),
    ...extra,
  ]
  return [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: site.name },
    { name: 'robots', content: 'index, follow' },
    { tagName: 'link', rel: 'canonical', href: url },
    { tagName: 'link', rel: 'alternate', hrefLang: 'es-AR', href: url },
    { property: 'og:locale', content: 'es_AR' },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    ...ld.map((data) => ({ 'script:ld+json': data })),
  ]
}

export { site, absolute }
