import PageIntro from '../components/PageIntro'
import Picture from '../components/Picture'
import CtaBand from '../components/CtaBand'
import { services } from '../content/servicios'
import { pageMeta, site } from '../lib/seo'

export const meta = () =>
  pageMeta({
    title: `Servicios Forestales | ${site.name}`,
    description: 'Servicios forestales de cosecha, transporte, biomasa, caminos, playas de acopio y consultoría para la cadena foresto-industrial.',
    path: '/servicios/',
    image: '/images/actualizadas/transporte-forestal.png',
  })

export default function Servicios() {
  return (
    <>
      <PageIntro eyebrow="Servicios" title="Nuestras capacidades." lead="Soluciones forestales para cada etapa de la cadena foresto-industrial, con maquinaria, personas y planificación." />
      <section aria-label="Catálogo de servicios" className="bg-night px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <ul className="border-t border-line">
          {services.map((service, index) => (
            <li key={service.slug} className="border-b border-line">
              <a href={service.url} className="group grid gap-6 py-10 md:grid-cols-12 md:items-center lg:py-12">
                <span className="eyebrow text-number md:col-span-1">{service.number}</span>
                <div className={`overflow-hidden bg-forest md:col-span-4 ${index % 2 ? 'md:order-last' : ''}`} data-anim="media">
                  <Picture
                    src={service.image}
                    alt=""
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-fg-out)] group-hover:scale-105"
                  />
                </div>
                <div className="md:col-span-7">
                  <h2 className="text-[clamp(2.25rem,4.4vw,4.5rem)] transition-colors group-hover:text-focus">{service.title}</h2>
                  <p className="mt-5 max-w-xl text-ink-soft">{service.summary}</p>
                  <span className="ink-link mt-6">Conocer el servicio <span aria-hidden="true">→</span></span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  )
}
