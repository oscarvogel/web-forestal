import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from '../components/Picture'
import { narrative } from '../content/home'
import { desktopMotion, EASE_MOVE } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const total = String(narrative.length).padStart(2, '0')

/** Three scenes stacked in one sticky frame; each wipes up over the last (desktop). Elsewhere they simply stack. */
export default function Operacion() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(desktopMotion, () => {
      el.dataset.motion = 'on'
      const scenes = q('[data-scene]')
      const counter = q('[data-count]')[0]
      const caption = q('[data-caption]')[0]
      let current = -1
      const show = (index: number) => {
        if (index === current) return
        current = index
        counter.textContent = narrative[index].number
        caption.textContent = narrative[index].title
      }
      const tl = gsap.timeline({
        defaults: { ease: EASE_MOVE },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => show(Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length))),
        },
      })
      scenes.forEach((scene, i) => {
        if (i === 0) return
        const previous = scenes[i - 1]
        tl.fromTo(scene, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, i - 1 + 0.25)
          .fromTo(scene.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 1, immediateRender: true }, '<')
          .to(previous.querySelector('img'), { scale: 1.08, yPercent: -4, duration: 1 }, '<')
          .to(previous.querySelector('[data-copy]'), { y: -60, autoAlpha: 0, duration: 0.5 }, '<')
        // One tween per line: staggered children that haven't started would show their pre-tween state mid-scrub.
        scene.querySelectorAll('[data-copy] > *').forEach((node, n) => {
          tl.fromTo(node, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, immediateRender: true }, i - 1 + 0.75 + n * 0.06)
        })
      })
      tl.to({}, { duration: 0.25 })
      gsap.fromTo(q('[data-fill]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } })
      show(0)
      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="operacion" aria-labelledby="operacion-titulo" className="bg-night">
      <div className="grid gap-6 px-5 pt-24 pb-14 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 lg:pt-32">
        <div className="lg:col-span-8">
          <p className="eyebrow text-caption" data-anim="fade">Cómo operamos</p>
          <h2 id="operacion-titulo" className="mt-5 text-[clamp(2.75rem,6.4vw,6.5rem)]" data-anim="lines">
            De la planificación al abastecimiento.
          </h2>
        </div>
        <p className="max-w-sm text-ink-soft lg:col-span-4 lg:justify-self-end" data-anim="fade">
          Un recorrido entre el análisis, el trabajo en campo y la organización del recurso en industria.
        </p>
      </div>

      <div ref={root} className="group/op relative data-[motion=on]:h-[360svh]">
        <div className="group-data-[motion=on]/op:sticky group-data-[motion=on]/op:top-0 group-data-[motion=on]/op:h-svh group-data-[motion=on]/op:overflow-hidden">
          {narrative.map((scene) => (
            <article
              key={scene.id}
              id={scene.id}
              data-scene
              aria-labelledby={`escena-${scene.id}`}
              className="relative flex min-h-[86svh] items-end overflow-hidden group-data-[motion=on]/op:absolute group-data-[motion=on]/op:inset-0 group-data-[motion=on]/op:min-h-0"
            >
              <div className="absolute inset-0">
                <Picture src={scene.image} alt={scene.alt} className="h-full w-full object-cover" />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/45 to-transparent" />
              <div data-copy className="relative z-10 max-w-3xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
                <p className="eyebrow text-focus">{scene.number} / {scene.title}</p>
                <h3 id={`escena-${scene.id}`} className="mt-5 text-[clamp(2.5rem,5vw,5.25rem)]">
                  {scene.lines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </h3>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{scene.copy}</p>
                <div className="mt-8 flex gap-8">
                  <a className="ink-link" href={scene.detail}>Conocer el servicio <span aria-hidden="true">↗</span></a>
                  <a className="ink-link" href={`/?servicio=${scene.service}#contacto`}>Consultar <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
          ))}

          <div aria-hidden="true" className="absolute right-12 bottom-14 z-20 hidden w-56 group-data-[motion=on]/op:block">
            <p className="flex items-baseline justify-end gap-2 font-display">
              <span data-count className="text-7xl font-semibold tracking-[-0.05em]">01</span>
              <span className="text-sm text-caption">/ {total}</span>
            </p>
            <div className="mt-3 h-px bg-ink/25"><div data-fill className="h-px origin-left bg-ink" /></div>
            <p data-caption className="mt-3 text-right text-sm text-ink-soft">{narrative[0].title}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
