import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from '../components/Picture'
import ScrollVelocity from '../components/reactbits/ScrollVelocity'
import PauseButton from '../components/PauseButton'
import { capabilities, foundingYear } from '../content/home'
import { desktopMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

/** Cream pause: the year rewinds from today to the founding year as the section scrolls past. */
export default function Trayectoria() {
  const root = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(false)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(desktopMotion, () => {
      const year = q('[data-year]')[0]
      const clock = { value: new Date().getFullYear() }
      // Start from today; the HTML keeps the founding year for no-JS, mobile and reduced motion.
      year.textContent = String(clock.value)
      gsap.to(clock, {
        value: foundingYear,
        ease: 'none',
        // Tied to the number itself (not the tall section) so it lands on the founding year while still in view.
        scrollTrigger: { trigger: year, start: 'top 90%', end: 'top 35%', scrub: 0.5 },
        onUpdate: () => {
          year.textContent = String(Math.round(clock.value))
        },
      })
      gsap.fromTo(q('[data-fleet] img'), { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: { trigger: q('[data-fleet]')[0], start: 'top bottom', end: 'bottom top', scrub: true } })
      return () => {
        year.textContent = String(foundingYear)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="trayectoria" aria-labelledby="trayectoria-titulo" className="overflow-hidden bg-cream pt-24 text-ink-dark lg:pt-32">
      <div className="grid gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-ink-dark-muted" data-anim="fade">Trayectoria · Desde</p>
          <p
            data-year
            className="font-display text-[clamp(7rem,24vw,24rem)] leading-[0.8] font-bold tracking-[-0.07em] text-forest tabular-nums"
          >
            {foundingYear}
          </p>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5">
          <h2 id="trayectoria-titulo" className="text-[clamp(2rem,3.4vw,3.5rem)] text-forest" data-anim="lines">
            Más de tres décadas conectando personas, maquinaria y planificación.
          </h2>
          <p className="max-w-md text-ink-dark-muted" data-anim="fade">
            Forestal Garuhapé SA, Forestal Paraguay SA y Foresvia SA integran un grupo dedicado a la consultoría y los servicios forestales mecanizados en Argentina y Paraguay.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-10 px-5 sm:px-8 lg:mt-24 lg:grid-cols-12 lg:px-12">
        <figure data-fleet className="overflow-hidden lg:col-span-8">
          <Picture src="/images/flota_camiones.png" alt="Flota de camiones de Forestal Garuhapé" sizes="(min-width: 1024px) 66vw, 100vw" className="aspect-[16/9] h-full w-full object-cover" />
        </figure>
        <div className="flex flex-col justify-end gap-5 border-t border-line-dark pt-6 lg:col-span-4" data-anim="stagger">
          <p className="eyebrow text-ink-dark-muted">Transporte</p>
          <p className="font-display text-2xl leading-snug font-semibold tracking-[-0.03em] text-forest">
            Primera empresa forestal argentina en implementar el transporte con bitrenes forestales.
          </p>
          <a className="ink-link w-fit" href="/nosotros/">Conocer la empresa <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <div className="mt-20 flex justify-end border-t border-line-dark px-5 pt-3 sm:px-8 lg:mt-28 lg:px-12">
        <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="la cinta de servicios" className="text-ink-dark hover:bg-ink-dark/5" />
      </div>
      <ScrollVelocity paused={paused} className="pb-6">
        {capabilities.map((c) => (
          <span key={c.slug} className="flex items-center font-display text-[clamp(3rem,8vw,8rem)] leading-none font-bold tracking-[-0.05em] text-forest">
            <span className="px-[0.35em]">{c.title}</span>
            <span className="text-[0.4em] text-brand">●</span>
          </span>
        ))}
      </ScrollVelocity>
    </section>
  )
}
