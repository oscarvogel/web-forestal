import { useRef, type MouseEvent } from 'react'
import { gsap } from 'gsap'

// Adapted from reactbits.dev FlowingMenu (GSAP): on hover a marquee band slides in from the edge the pointer
// entered and leaves through the edge it exits. Keyboard focus shows the band too; links stay plain anchors.
export type FlowingItem = { href: string; label: string; image: string; onSelect?: () => void }

const ease = { duration: 0.6, ease: 'expo.out' }

function Item({ href, label, image, onSelect }: FlowingItem) {
  const row = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  const edge = (event: MouseEvent | null) => {
    if (!event || !row.current) return 'top'
    const r = row.current.getBoundingClientRect()
    return event.clientY - r.top < r.height / 2 ? 'top' : 'bottom'
  }
  const enter = (event: MouseEvent | null) => {
    const from = edge(event) === 'top' ? '-101%' : '101%'
    gsap.timeline({ defaults: ease }).set(band.current, { y: from }).set(inner.current, { y: from === '-101%' ? '101%' : '-101%' }).to([band.current, inner.current], { y: '0%' })
  }
  const leave = (event: MouseEvent | null) => {
    const to = edge(event) === 'top' ? '-101%' : '101%'
    gsap.timeline({ defaults: ease }).to(band.current, { y: to }).to(inner.current, { y: to === '-101%' ? '101%' : '-101%' }, 0)
  }

  const copies = Array.from({ length: 4 }, (_, i) => (
    <div key={i} className="flex shrink-0 items-center">
      <span className="px-[2vw] font-display text-[clamp(2rem,4.6vw,4.5rem)] font-semibold tracking-[-0.04em] text-ink-dark">{label}</span>
      <img src={image} alt="" loading="lazy" decoding="async" className="h-[clamp(2.6rem,5vw,4.6rem)] w-[clamp(6rem,11vw,10rem)] rounded-full object-cover" />
    </div>
  ))

  return (
    <div ref={row} className="relative overflow-hidden border-t border-line">
      <a
        href={href}
        onClick={onSelect}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={() => enter(null)}
        onBlur={() => leave(null)}
        className="flex items-center justify-between py-[clamp(0.75rem,2.8vh,2.25rem)] font-display text-[clamp(2rem,4.6vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] outline-none focus-visible:text-focus"
      >
        {label}
        <span aria-hidden="true" className="text-[0.5em] text-caption">↗</span>
      </a>
      <div ref={band} aria-hidden="true" className="pointer-events-none absolute inset-0 translate-y-[101%] overflow-hidden bg-cream">
        <div ref={inner} className="flex h-full translate-y-[-101%] items-center">
          <div className="flex h-full w-max animate-[marquee_14s_linear_infinite] items-center">{copies}{copies}</div>
        </div>
      </div>
    </div>
  )
}

export default function FlowingMenu({ items }: { items: FlowingItem[] }) {
  return (
    <nav aria-label="Menú principal" className="border-b border-line">
      {items.map((item) => (
        <Item key={item.href} {...item} />
      ))}
    </nav>
  )
}
