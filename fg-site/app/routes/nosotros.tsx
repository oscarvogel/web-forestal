import PageIntro from '../components/PageIntro'
import Picture from '../components/Picture'
import MapaGrupo from '../components/MapaGrupo'
import CtaBand from '../components/CtaBand'
import nosotros from '../content/nosotros.json'
import sgi from '../content/sgi.json'
import { foundingYear, group } from '../content/home'
import { pageMeta, site } from '../lib/seo'

export const meta = () =>
  pageMeta({
    title: `Nosotros | ${site.name}`,
    description: `Conozca la trayectoria, los servicios y el Sistema de Gestión de Calidad de ${site.name}.`,
    path: '/nosotros/',
    image: nosotros.imagen,
    type: 'website',
  })

export default function Nosotros() {
  return (
    <>
      <PageIntro
        eyebrow={`Desde ${foundingYear} · Argentina y Paraguay`}
        title="Forestal Garuhapé SA."
        lead="Empresa de servicios forestales, logística y consultoría para la cadena foresto-industrial."
      />

      <section aria-labelledby="empresa-titulo" className="bg-night px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <figure className="overflow-hidden lg:col-span-7" data-anim="media">
            <Picture src={nosotros.imagen} alt="Flota de camiones de Forestal Garuhapé" sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </figure>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="eyebrow text-caption" data-anim="fade">La empresa</p>
            <h2 id="empresa-titulo" className="mt-5 text-[clamp(2.25rem,3.8vw,3.75rem)]" data-anim="lines">Experiencia en la cadena foresto-industrial.</h2>
            <p className="mt-6 text-ink-soft" data-anim="fade">{nosotros.descripcion.replace(/:$/, '.')}</p>
            <blockquote className="mt-10 border-l-2 border-signal pl-6 font-display text-xl leading-snug tracking-[-0.02em]" data-anim="fade">
              <p className="eyebrow mb-3 font-sans text-caption">Visión</p>
              {nosotros.vision}.
            </blockquote>
          </div>
        </div>
      </section>

      <section aria-labelledby="grupo-titulo" className="bg-forest px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow text-caption" data-anim="fade">El grupo</p>
            <h2 id="grupo-titulo" className="mt-5 text-[clamp(2.5rem,5vw,5rem)]" data-anim="lines">Tres empresas. Dos países.</h2>
            <ol className="mt-12 border-t border-line" data-anim="stagger">
              {group.map((company, index) => (
                <li key={company.name} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
                  <span className="eyebrow pt-1.5 text-number">0{index + 1}</span>
                  <div>
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
                      {company.href ? (
                        <a className="hover:text-focus" href={company.href} target="_blank" rel="noopener noreferrer">
                          {company.name} <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span>
                        </a>
                      ) : (
                        company.name
                      )}
                    </p>
                    <p className="mt-1 text-caption">{company.place ? `${company.role} · ${company.place}` : company.role}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-6" data-anim="fade">
            <MapaGrupo className="mx-auto h-auto max-h-[80svh] w-full overflow-visible" />
          </div>
        </div>
      </section>

      <section aria-labelledby="areas-titulo" className="bg-night px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <p className="eyebrow text-caption" data-anim="fade">Áreas de trabajo</p>
        <h2 id="areas-titulo" className="mt-5 text-[clamp(2.5rem,5vw,5rem)]" data-anim="lines">Servicios y consultoría.</h2>
        <div className="mt-14 grid gap-14 md:grid-cols-2">
          {[
            { title: 'Servicios', items: nosotros.servicios, href: '/servicios/' },
            { title: 'Consultoría', items: nosotros.consultoria, href: '/consultoria/' },
          ].map((list) => (
            <div key={list.title}>
              <h3 className="flex items-baseline justify-between text-3xl tracking-[-0.03em]">
                {list.title}
                <a className="ink-link text-sm" href={list.href}>Ver detalle <span aria-hidden="true">→</span></a>
              </h3>
              <ul className="mt-6 border-t border-line" data-anim="stagger">
                {list.items.map((item) => (
                  <li key={item} className="border-b border-line py-4 text-lg text-ink-soft">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="sgi" aria-labelledby="sgc-titulo" className="bg-cream px-5 py-24 text-ink-dark sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-ink-dark-muted" data-anim="fade">Calidad · seguridad · mejora</p>
            <h2 id="sgc-titulo" className="mt-5 text-[clamp(2.5rem,5vw,5rem)] text-forest" data-anim="lines">{sgi.tituloSeccion}.</h2>
            <p className="mt-6 max-w-md text-ink-dark-muted" data-anim="fade">
              La gestión de calidad reúne los compromisos y prácticas compartidos en los servicios de la empresa.
            </p>
          </div>
          <ol className="grid gap-px bg-line-dark sm:grid-cols-2 lg:col-span-7" data-anim="stagger">
            {sgi.items.map((item, index) => (
              <li key={item.titulo} className="bg-cream p-8">
                <p className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 text-2xl tracking-[-0.03em] text-forest">{item.titulo}</h3>
                <p className="mt-3 text-ink-dark-muted">{item.descripcion}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
