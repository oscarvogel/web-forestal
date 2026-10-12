import Picture from './Picture'
import { serviceBySlug, type Service } from '../content/servicios'

/** Scope + technical detail, shared by service pages and Consultoría. */
export function Scope({ service, heading = 'Alcance del servicio.' }: { service: Service; heading?: string }) {
  return (
    <section id="alcance" aria-labelledby="alcance-titulo" className="bg-night px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-caption" data-anim="fade">Qué incluye</p>
          <h2 id="alcance-titulo" className="mt-5 text-[clamp(2.5rem,4.6vw,4.75rem)]" data-anim="lines">{heading}</h2>
          <p className="mt-8 max-w-md text-ink-soft" data-anim="fade">{service.description}</p>
        </div>
        <div className="lg:col-span-7">
          <ol className="border-t border-line" data-anim="stagger">
            {service.scope.map((item, index) => (
              <li key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7 text-xl leading-snug lg:text-2xl">
                <span className="eyebrow pt-2 text-number">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
          <details className="group mt-10 border border-line open:bg-forest/40">
            <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-semibold [&::-webkit-details-marker]:hidden">
              Información técnica del servicio
              <span aria-hidden="true" className="text-2xl leading-none text-caption transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-4 px-6 pb-6 text-ink-soft">
              {service.technical.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}

/** Two neighbouring capabilities plus the full catalog. */
export function Related({ service }: { service: Service }) {
  const related = service.related.map((slug) => serviceBySlug(slug)!)
  return (
    <section aria-labelledby="relacionados-titulo" className="bg-forest px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 id="relacionados-titulo" className="text-[clamp(2.5rem,5vw,5rem)]" data-anim="lines">Capacidades que conectan.</h2>
        <a className="ink-link" href="/servicios/">Todos los servicios <span aria-hidden="true">↗</span></a>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {related.map((item) => (
          <li key={item.slug}>
            <a href={item.url} className="group block">
              <div className="overflow-hidden bg-night">
                <Picture src={item.image} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[var(--ease-fg-out)] group-hover:scale-105" />
              </div>
              <p className="mt-5 flex items-baseline justify-between gap-4">
                <span className="font-display text-3xl font-semibold tracking-[-0.04em]">{item.title}</span>
                <span aria-hidden="true" className="text-caption transition-transform group-hover:translate-x-1">→</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
