import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from '../components/Picture'
import { capabilities } from '../content/home'
import { motionAllowed } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

/** Six capabilities on one pinned horizontal rail (desktop); a plain vertical list everywhere else. */
export default function Capacidades() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(motionAllowed, () => {
      el.dataset.motion = 'on'
      const track = q('[data-track]')[0]
      const distance = () => track.scrollWidth - window.innerWidth
      const rail = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
      gsap.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true } })
      // Each photo drifts against the rail, so the frames read as windows rather than flat cards.
      q('[data-panel]').forEach((panel) => {
        gsap.fromTo(panel.querySelector('img'), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: rail, start: 'left right', end: 'right left', scrub: true } })
      })
      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="servicios" aria-labelledby="capacidades-titulo" className="group/cap relative overflow-hidden bg-forest py-20 lg:py-24 data-[motion=on]:flex data-[motion=on]:h-svh data-[motion=on]:flex-col data-[motion=on]:justify-center data-[motion=on]:py-0">
      <div className="mb-12 grid gap-6 px-5 sm:px-8 lg:mb-8 lg:grid-cols-12 lg:items-end lg:px-12">
        <div className="lg:col-span-9">
          <p className="eyebrow text-caption" data-anim="fade">Nuestros servicios</p>
          <h2 id="capacidades-titulo" className="mt-5 text-[clamp(2.75rem,6.4vw,6.5rem)] group-data-[motion=on]/cap:text-[clamp(2.75rem,4.6vw,5rem)]" data-anim="lines">
            Una operación. Seis capacidades.
          </h2>
        </div>
        <div className="flex flex-col gap-5 lg:col-span-3 lg:items-end" data-anim="fade">
          <p className="max-w-sm text-ink-soft lg:text-right">Servicios forestales en cada etapa, con maquinaria, personas y planificación.</p>
          <a className="ink-link" href="/servicios/">Todos los servicios <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <ol data-track className="grid gap-14 px-5 sm:px-8 md:grid-cols-2 lg:px-12 group-data-[motion=on]/cap:flex group-data-[motion=on]/cap:w-max group-data-[motion=on]/cap:gap-[3vw]">
        {capabilities.map((c) => (
          <li key={c.slug} data-panel className="group/panel group-data-[motion=on]/cap:w-[min(58vw,62rem)]">
            <a href={c.detail} className="block" aria-labelledby={`cap-${c.slug}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-night group-data-[motion=on]/cap:aspect-auto group-data-[motion=on]/cap:h-[46svh]">
                <Picture
                  src={c.image}
                  alt={c.alt}
                  sizes="(min-width: 1024px) 62vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full scale-[1.18] object-cover transition-[filter] duration-700 group-hover/panel:brightness-110"
                />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-night/60 to-transparent" />
                <span aria-hidden="true" className="absolute top-4 left-5 font-display text-[clamp(4rem,9vw,9rem)] leading-none font-bold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(247_247_246/0.75)]">
                  {c.number}
                </span>
              </div>
              <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
                <h3 id={`cap-${c.slug}`} className="text-[clamp(2.25rem,3.6vw,3.75rem)]">{c.title}</h3>
                <div>
                  <p className="eyebrow text-number">{c.caption}</p>
                  <p className="mt-3 max-w-md text-ink-soft">{c.summary}</p>
                  <span className="ink-link mt-5">Conocer {c.title.toLowerCase()} <span aria-hidden="true">↗</span></span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="mx-12 mt-10 hidden h-px bg-line group-data-[motion=on]/cap:block">
        <div data-progress className="h-px origin-left bg-focus" />
      </div>
    </section>
  )
}
