import { useEffect, useRef } from 'react'

// Port of the Eleventy site's src/js/lottie.js: the runtime is its own chunk, fetched only when an
// animation scrolls into view. Reduced motion shows the finished drawing instead of playing it.
let runtime: Promise<typeof import('lottie-web')['default']> | undefined
const loadRuntime = () =>
  (runtime ??= import('lottie-web/build/player/lottie_light').then((m) => (m.default ?? m) as typeof import('lottie-web')['default']))

type Props = { name: string; delay?: number; className?: string; autoplay?: 'view' | 'mount' }

export default function Lottie({ name, delay = 0, className, autoplay = 'view' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let animation: import('lottie-web').AnimationItem | undefined
    let timer = 0
    let cancelled = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mount = async () => {
      try {
        const lottie = await loadRuntime()
        if (cancelled) return
        animation = lottie.loadAnimation({
          container: node,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: `/animations/${name}.json`,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        })
      } catch (error) {
        console.warn('No se pudo cargar la animación; el contenido sigue disponible sin ella.', error)
        return
      }
      animation.addEventListener('data_failed', () => node.replaceChildren())
      animation.addEventListener('DOMLoaded', () => {
        if (reduced) animation!.goToAndStop(animation!.totalFrames - 1, true)
        else timer = window.setTimeout(() => animation!.play(), delay)
      })
    }

    if (autoplay === 'mount') {
      mount()
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        mount()
      }, { threshold: 0.5 })
      observer.observe(node)
      return () => {
        cancelled = true
        observer.disconnect()
        window.clearTimeout(timer)
        animation?.destroy()
      }
    }
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      animation?.destroy()
    }
  }, [name, delay, autoplay])

  return <span ref={ref} className={className} aria-hidden="true" />
}
