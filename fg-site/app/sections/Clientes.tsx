import { useState } from 'react'
import LogoLoop, { type LogoItem } from '../components/reactbits/LogoLoop'
import PauseButton from '../components/PauseButton'
import clientes from '../content/clientes.json'

// The client files are JPEGs wrapped in SVG with their own white ground, so each sits on a white tile.
const logos: LogoItem[] = clientes.clientes.map((c) => ({ src: c.logo, alt: c.alt, title: c.alt }))

export default function Clientes() {
  const [paused, setPaused] = useState(false)
  return (
    <section aria-labelledby="clientes-titulo" className="bg-cream py-10 text-ink-dark lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <h2 id="clientes-titulo" className="eyebrow font-sans tracking-[0.14em] text-ink-dark-muted">
          Trabajamos para la industria forestal de la región
        </h2>
        <div className="flex items-center gap-4">
          <p className="eyebrow font-sans tracking-[0.14em] text-ink-dark-muted">{logos.length} clientes</p>
          <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="la cinta de clientes" className="text-ink-dark hover:bg-ink-dark/5" />
        </div>
      </div>
      <LogoLoop
        logos={logos}
        speed={45}
        gap={12}
        logoHeight={96}
        fadeOut
        fadeOutColor="#f1eee6"
        pauseOnHover
        paused={paused}
        ariaLabel="Clientes de Forestal Garuhapé"
        renderItem={(item) => {
          const logo = item as Extract<LogoItem, { src: string }>
          return (
            <span className="group flex h-24 w-48 items-center justify-center bg-white">
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-11 max-w-[150px] object-contain grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </span>
          )
        }}
      />
    </section>
  )
}
