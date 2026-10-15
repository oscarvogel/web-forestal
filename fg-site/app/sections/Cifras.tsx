import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { facts } from '../content/home'
import { EASE_IN, registerEases } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const format = (value: number) => Math.round(value).toLocaleString('es-AR')

/** The final numbers are in the HTML; motion only counts up to them once. */
export default function Cifras() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    registerEases()
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
        const target = Number(node.dataset.count)
        const state = { value: 0 }
        gsap.to(state, {
          value: target,
          duration: 2,
          ease: EASE_IN,
          scrollTrigger: { trigger: node, start: 'top 85%', once: true },
          onUpdate: () => {
            node.textContent = format(state.value)
          },
        })
        node.textContent = format(0)
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="cifras-titulo" className="bg-forest px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <h2 id="cifras-titulo" className="eyebrow font-sans tracking-[0.14em] text-caption">El grupo en cifras</h2>
      <ul className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-[1fr_1.7fr_1fr_1fr]">
        {facts.map((fact) => (
          <li key={fact.label} className="border-b border-line py-10 sm:pr-8 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0">
            <p className="font-display text-[clamp(3.5rem,6.2vw,7rem)] leading-none font-semibold tracking-[-0.06em] tabular-nums">
              <span data-count={fact.value}>{format(fact.value)}</span>
              <span className="text-signal">{fact.suffix}</span>
            </p>
            <p className="mt-4 text-ink-soft">{fact.label}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
