import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MapaGrupo, { PIN_AR } from '../components/MapaGrupo'
import Picture from '../components/Picture'
import { foundingYear, group } from '../content/home'
import { desktopMotion, EASE_IN, EASE_MOVE, registerEases, stagger } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const VIDEO = '/video/hero-cinematic.mp4'

/**
 * Signature opening: the group on the map (Garuhapé as casa matriz), then the camera dives into Misiones and the
 * pin opens into the forest video. Without desktop motion the same DOM stays a static two-part stack.
 */
export default function HeroGrupo() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const toggleVideo = useRef<() => void>(() => {})
  const [videoState, setVideoState] = useState<'off' | 'playing' | 'paused'>('off')
  const [status, setStatus] = useState('')

  useLayoutEffect(() => {
    const el = root.current!
    registerEases()
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()

    mm.add({ desktop: desktopMotion, motion: '(prefers-reduced-motion: no-preference)' }, (context) => {
      const { desktop, motion } = context.conditions!
      if (!motion) return

      gsap
        .timeline({ defaults: { ease: EASE_IN } })
        .from(q('[data-outline]'), { strokeDashoffset: 1, duration: 2.2, stagger: 0.1, ease: EASE_MOVE }, 0)
        .from(q('[data-outline]'), { fillOpacity: 0, duration: 1.2 }, 1.1)
        .from(q('[data-pin]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.2, ease: 'back.out(2)' }, 1.3)
        .from(q('[data-fade-svg]'), { autoAlpha: 0, duration: 0.8 }, 1.7)

      if (!desktop) return
      el.dataset.motion = 'on'
      const stage = q('[data-stage]')[0]
      const pin = q('[data-pin-ar]')[0]
      // The dive scales around the pin, so its screen position is stable: the reveal circle opens from there.
      const center = () => {
        const s = stage.getBoundingClientRect()
        const p = pin.getBoundingClientRect()
        return `${p.left + p.width / 2 - s.left}px ${p.top + p.height / 2 - s.top}px`
      }
      const cover = () => Math.hypot(window.innerWidth, window.innerHeight)

      const hero = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true } })
      hero
        .to(q('[data-copy]'), { yPercent: -18, autoAlpha: 0, ease: 'power1.in', duration: 0.3 }, 0)
        .to(q('[data-context]'), { autoAlpha: 0, duration: 0.2 }, 0.02)
        .to(q('[data-world]'), { scale: 8, svgOrigin: `${PIN_AR.x} ${PIN_AR.y}`, ease: 'power2.in', duration: 0.55 }, 0)
        // 110m outlines turn coarse up close: the land dissolves so the circle opens on night, not on a flat polygon.
        .to(q('[data-outline]'), { fillOpacity: 0, ease: 'none', duration: 0.25 }, 0.08)
        .to(q('[data-outline]'), { strokeOpacity: 0, ease: 'none', duration: 0.15 }, 0.3)
        .fromTo(
          q('[data-media]'),
          { clipPath: () => `circle(0px at ${center()})` },
          { clipPath: () => `circle(${cover()}px at ${center()})`, ease: 'power2.in', duration: 0.4 },
          0.3,
        )
        // fromTo, not from: invalidateOnRefresh re-records from-tweens and would lose their start state.
        .fromTo(q('[data-media-inner]'), { scale: 1.35 }, { scale: 1, ease: 'power1.out', duration: 0.5 }, 0.3)
      // One tween per element instead of stagger: a staggered target that hasn't started yet shows its pre-tween state.
      q('[data-tagline]').forEach((node, i) => {
        hero.fromTo(node, { yPercent: 115 }, { yPercent: 0, duration: 0.18, ease: EASE_IN, immediateRender: true }, 0.7 + i * 0.04)
      })
      q('[data-tagline-fade]').forEach((node, i) => {
        hero.fromTo(node, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15, immediateRender: true }, 0.78 + i * 0.04)
      })
      hero.to({}, { duration: 0.12 })

      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  // Port of the Eleventy setupHomeVideo: desktop motion only, never with data-saver; pauses off-screen or in a hidden
  // tab, remembers a manual pause, and falls back to the poster with an announcement if the file fails.
  useEffect(() => {
    const v = video.current!
    const el = root.current!
    const eligible = window.matchMedia(desktopMotion)
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    let enabled = false
    let visible = false
    let userPaused = false

    const fail = () => {
      enabled = false
      v.pause()
      v.removeAttribute('src')
      v.load()
      setVideoState('off')
      setStatus('La imagen de la operación sigue visible. El video no está disponible.')
    }
    const sync = () => {
      if (!enabled || userPaused || !visible || document.hidden) {
        v.pause()
        return
      }
      v.play().catch((error: DOMException) => {
        if (error.name !== 'AbortError') fail()
      })
    }
    const configure = () => {
      const next = eligible.matches && !connection?.saveData
      if (next === enabled) return
      enabled = next
      if (enabled) {
        v.src = VIDEO
        v.load()
      } else {
        v.pause()
        v.removeAttribute('src')
        v.load()
        setVideoState('off')
      }
      sync()
    }
    const onPlaying = () => enabled && setVideoState('playing')
    const onPause = () => enabled && setVideoState('paused')
    const onError = () => enabled && fail()
    toggleVideo.current = () => {
      userPaused = !v.paused
      sync()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(el)
    v.addEventListener('playing', onPlaying)
    v.addEventListener('pause', onPause)
    v.addEventListener('error', onError)
    document.addEventListener('visibilitychange', sync)
    eligible.addEventListener('change', configure)
    connection?.addEventListener('change', configure)
    configure()
    return () => {
      observer.disconnect()
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', sync)
      eligible.removeEventListener('change', configure)
      connection?.removeEventListener('change', configure)
    }
  }, [])

  return (
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-titulo"
      className="group/hero relative bg-night data-[motion=on]:h-[340svh]"
    >
      <div data-stage className="relative group-data-[motion=on]/hero:sticky group-data-[motion=on]/hero:top-0 group-data-[motion=on]/hero:h-svh group-data-[motion=on]/hero:overflow-hidden">
        {/* Layer A: the group */}
        <div className="relative grid min-h-svh grid-cols-1 gap-8 px-5 pt-28 pb-10 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pt-32 group-data-[motion=on]/hero:absolute group-data-[motion=on]/hero:inset-0 group-data-[motion=on]/hero:min-h-0 group-data-[motion=on]/hero:pt-28 group-data-[motion=on]/hero:pb-10">
          <div data-copy className="relative z-10 flex flex-col justify-between gap-10 lg:col-span-7">
            <div>
              <p className="intro eyebrow text-caption">
                Grupo forestal · Argentina / Paraguay · Desde {foundingYear}
              </p>
              <h1 id="hero-titulo" className="mt-6 text-[clamp(3.6rem,10.4vw,11.5rem)] leading-[0.86]">
                <span className="block overflow-hidden pb-[0.06em]"><span className="intro-line" style={stagger(1)}>Forestal</span></span>
                <span className="block overflow-hidden pb-[0.06em]"><span className="intro-line text-focus" style={stagger(2)}>Garuhapé.</span></span>
              </h1>
              <p className="intro mt-8 max-w-md text-lg leading-relaxed text-ink-soft" style={stagger(4)}>
                Casa matriz de un grupo de tres empresas dedicado, desde {foundingYear}, a la consultoría y los servicios forestales mecanizados.
              </p>
            </div>

            <ol className="grid max-w-2xl grid-cols-1 border-t border-line sm:grid-cols-3">
              {group.map((company, index) => (
                <li key={company.name} className="intro border-b border-line py-4 sm:border-b-0 sm:pr-6" style={stagger(5 + index)}>
                  <p className="eyebrow text-number">0{index + 1}</p>
                  <p className={`mt-2 font-display text-base font-semibold tracking-tight ${index === 0 ? 'text-ink' : 'text-ink-soft'}`}>
                    {company.href ? (
                      <a className="ink-link text-base" href={company.href} target="_blank" rel="noopener noreferrer">
                        {company.name}
                        <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (abre en otra pestaña)</span>
                      </a>
                    ) : (
                      company.name
                    )}
                  </p>
                  <p className="mt-1 text-sm text-caption">{company.place ? `${company.role} · ${company.place}` : company.role}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative lg:col-span-5">
            <MapaGrupo className="mx-auto h-auto max-h-[70svh] w-full overflow-visible lg:absolute lg:inset-0 lg:h-full lg:max-h-none" />
          </div>

          <a
            href="#servicios"
            className="eyebrow absolute right-5 bottom-6 hidden text-caption sm:block lg:right-12 group-data-[motion=on]/hero:hidden"
          >
            Ver la operación ↓
          </a>
          <p aria-hidden="true" className="intro eyebrow absolute right-12 bottom-8 hidden text-caption group-data-[motion=on]/hero:block">
            Desplazar para entrar al monte ↓
          </p>
        </div>

        {/* Layer B: into the forest */}
        <div
          data-media
          className="relative min-h-[92svh] overflow-hidden bg-forest group-data-[motion=on]/hero:absolute group-data-[motion=on]/hero:inset-0 group-data-[motion=on]/hero:min-h-0"
        >
          <div data-media-inner className="absolute inset-0">
            <Picture
              src="/images/actualizadas/cosecha-forestal.png"
              alt="Maquinaria forestal trabajando entre plantaciones"
              className="h-full w-full object-cover"
            />
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoState === 'off' ? 'opacity-0' : 'opacity-100'}`}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/10" aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 grid gap-8 px-5 pb-10 sm:px-8 lg:grid-cols-12 lg:px-12 lg:pb-14">
            <p className="font-display text-[clamp(3rem,8.2vw,9rem)] leading-[0.9] font-semibold tracking-[-0.05em] lg:col-span-8">
              <span className="block overflow-hidden pb-[0.05em]"><span data-tagline className="block">Del bosque</span></span>
              <span className="block overflow-hidden pb-[0.05em]"><span data-tagline className="block">a la industria.</span></span>
            </p>
            <div className="flex flex-col justify-end gap-6 lg:col-span-4">
              <p data-tagline-fade className="max-w-sm text-lg leading-relaxed text-ink-soft">
                Integramos personas, maquinaria y planificación para la cadena forestoindustrial.
              </p>
              <div data-tagline-fade className="flex flex-wrap items-center gap-6">
                <a className="btn" href="#servicios">
                  Conocer servicios <span aria-hidden="true">→</span>
                </a>
                <a className="ink-link" href="#contacto">
                  Consultar <span aria-hidden="true">↗</span>
                </a>
                {videoState !== 'off' && (
                  <button
                    type="button"
                    onClick={() => toggleVideo.current()}
                    aria-pressed={videoState === 'paused'}
                    className="eyebrow text-caption hover:text-ink"
                  >
                    {videoState === 'paused' ? 'Reproducir video' : 'Pausar video'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  )
}
