import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { motionAllowed, stagger } from '../lib/motion'
import type { Service } from '../content/servicios'

gsap.registerPlugin(ScrollTrigger)

/** Full-bleed opening for a service: the photo settles back as the page scrolls (desktop only). */
export default function ServiceOpening({ service }: { service: Service }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add(motionAllowed, () => {
      gsap.to(el.querySelector('img'), { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="servicio-titulo" className="relative flex min-h-[92svh] items-end overflow-hidden bg-forest">
      <div className="absolute inset-0">
        <Picture src={service.image} alt="" eager className="h-full w-full object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/20" />
      <div className="relative grid w-full gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pb-16">
        <div className="lg:col-span-8">
          <nav aria-label="Ruta" className="intro eyebrow text-caption">
            <a className="hover:text-ink" href="/servicios/">Servicios</a> <span aria-hidden="true">/</span> <span>{service.number}</span>
          </nav>
          <h1 id="servicio-titulo" className="intro mt-6 text-[clamp(3rem,8vw,8.5rem)] leading-[0.92]" style={stagger(1)}>
            {`${service.title}.`}
          </h1>
        </div>
        <div className="intro flex flex-col justify-end gap-6 lg:col-span-4" style={stagger(3)}>
          <p className="max-w-md text-lg leading-relaxed text-ink-soft">{service.summary}</p>
          <div className="flex flex-wrap items-center gap-6">
            <a className="btn" href={`/?servicio=${service.slug}#contacto`}>Consultar <span aria-hidden="true">→</span></a>
            <a className="ink-link" href="#alcance">Ver alcance <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
    </section>
  )
}
