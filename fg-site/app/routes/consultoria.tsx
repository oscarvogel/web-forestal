import ServiceOpening from '../components/ServiceOpening'
import { Related, Scope } from '../components/ServiceBody'
import Picture from '../components/Picture'
import CtaBand from '../components/CtaBand'
import { consultingAreas, serviceBySlug } from '../content/servicios'
import { absolute, pageMeta, site } from '../lib/seo'

const service = serviceBySlug('consultoria-forestal')!

export const meta = () =>
  pageMeta({
    title: `Consultoría Forestal | ${site.name}`,
    description: 'Servicios de consultoría forestal para planificación, supply chain, optimización operativa y toma de decisiones en la industria maderera.',
    path: '/consultoria/',
    image: service.image,
    breadcrumb: [{ name: 'Servicios', path: '/servicios/' }],
    extra: [{ '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.description, url: absolute('/consultoria/'), provider: { '@id': `${site.url}/#organization` } }],
  })

export default function Consultoria() {
  return (
    <>
      <ServiceOpening service={service} />
      <section aria-labelledby="areas-titulo" className="bg-night px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-caption" data-anim="fade">Planificación y análisis</p>
            <h2 id="areas-titulo" className="mt-5 text-[clamp(2.5rem,5vw,5rem)]" data-anim="lines">Áreas de consultoría.</h2>
          </div>
          <p className="max-w-sm text-ink-soft lg:col-span-4 lg:justify-self-end" data-anim="fade">
            Herramientas y equipos profesionales para colaborar con los procesos forestales y foresto-industriales.
          </p>
        </div>
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4" data-anim="stagger">
          {consultingAreas.map((area, index) => (
            <li key={area.title} className="bg-night p-6 lg:p-8">
              <Picture src={area.image} alt="" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="aspect-[16/9] w-full rounded-[2px] object-cover sm:aspect-square" />
              <p className="eyebrow mt-6 text-number">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-2xl tracking-[-0.03em]">{area.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{area.copy}</p>
            </li>
          ))}
        </ul>
      </section>
      <Scope service={service} heading="Enfoque de la consultoría." />
      <Related service={service} />
      <CtaBand title="Planifiquemos su abastecimiento." service={service.slug} />
    </>
  )
}
