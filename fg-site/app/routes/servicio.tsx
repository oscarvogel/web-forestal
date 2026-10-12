import { data } from 'react-router'
import type { Route } from './+types/servicio'
import ServiceOpening from '../components/ServiceOpening'
import { Related, Scope } from '../components/ServiceBody'
import Gallery from '../components/Gallery'
import CtaBand from '../components/CtaBand'
import { serviceBySlug } from '../content/servicios'
import { absolute, pageMeta, site } from '../lib/seo'

// Consultoría has its own page (/consultoria/); every other service lives here.
const find = (slug: string | undefined) => {
  const service = serviceBySlug(slug)
  return service && service.slug !== 'consultoria-forestal' ? service : undefined
}

export function meta({ params }: Route.MetaArgs) {
  const service = find(params.slug)
  if (!service) return [{ title: `Página no encontrada | ${site.name}` }]
  return pageMeta({
    title: `${service.title} | Servicios Forestales | ${site.name}`,
    description: service.description,
    path: service.url,
    image: service.image,
    breadcrumb: [{ name: 'Servicios', path: '/servicios/' }],
    extra: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: absolute(service.url),
        provider: { '@id': `${site.url}/#organization` },
        areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
      },
    ],
  })
}

export default function Servicio({ params }: Route.ComponentProps) {
  const service = find(params.slug)
  if (!service) throw data('Servicio no encontrado', { status: 404 })
  return (
    <>
      <ServiceOpening service={service} />
      <Scope service={service} />
      <Gallery photos={service.gallery} />
      <Related service={service} />
      <CtaBand title={`¿Necesita ${service.title.toLowerCase()}?`} service={service.slug} />
    </>
  )
}
