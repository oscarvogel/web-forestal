import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import FlowingMenu from './reactbits/FlowingMenu'
import { lenis } from '../lib/smooth'
import { site } from '../content/home'

const items = [
  { href: '/servicios/', label: 'Servicios', image: '/img/cosecha-forestal-480.webp' },
  { href: '/consultoria/', label: 'Consultoría', image: '/img/consultoria-forestal-480.webp' },
  { href: '/nosotros/', label: 'Nosotros', image: '/img/flota-camiones-480.webp' },
  { href: '/nosotros/#sgi', label: 'Calidad y SGC', image: '/img/caminos-forestales-480.webp' },
  { href: '/#contacto', label: 'Contacto', image: '/img/transporte-forestal-480.webp' },
]

/**
 * Floating chips instead of a solid bar: they read on dark, cream and photo sections alike,
 * and leave the hero full-bleed. The menu is a modal sheet; the rest of the page is inert while it is open.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const page = [document.getElementById('contenido'), document.querySelector('footer')]
    page.forEach((node) => node?.toggleAttribute('inert', open))
    if (open) lenis?.stop()
    else lenis?.start()
    if (!open) return

    gsap.fromTo(sheet.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out' })
    gsap.from(sheet.current!.querySelectorAll('[data-menu-row]'), { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.15 })
    sheet.current?.querySelector('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-start justify-between p-4 sm:p-5 lg:px-8">
      <a href="/" aria-label={`${site.name}, inicio`} className="pointer-events-auto rounded-[3px] bg-night/70 px-3 py-2 backdrop-blur-md">
        <img src="/images/fg-negative.svg" alt="" width="215" height="116" className="h-9 w-auto sm:h-11" />
      </a>

      <div className="pointer-events-auto flex items-center gap-2">
        <a href="/#contacto" className={`btn hidden py-3 text-sm ring-1 ring-night/25 sm:inline-flex ${open ? 'invisible' : ''}`}>
          Consultar <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-[2px] bg-night/70 px-4 py-3 text-sm font-semibold backdrop-blur-md hover:bg-forest"
        >
          {open ? 'Cerrar' : 'Menú'}
          <span aria-hidden="true" className="relative block h-2.5 w-4">
            <span className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      <div
        ref={sheet}
        id="menu-principal"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!open}
        className="pointer-events-auto fixed inset-0 -z-10 flex flex-col justify-between overflow-y-auto bg-forest px-5 pt-28 pb-8 sm:px-8 lg:px-12"
        data-lenis-prevent
      >
        <div data-menu-row>
          <FlowingMenu items={items.map((item) => ({ ...item, onSelect: close }))} />
        </div>
        <div data-menu-row className="mt-10 grid gap-6 text-sm text-ink-soft sm:grid-cols-3">
          <a className="ink-link w-fit" href={`mailto:${site.email}`}>{site.email}</a>
          <a className="ink-link w-fit" href="tel:+5493743485849">{site.telephone}</a>
          <a className="ink-link w-fit" href="https://forestalparaguay.com/" target="_blank" rel="noopener noreferrer">
            Forestal Paraguay <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
      </div>
    </header>
  )
}
