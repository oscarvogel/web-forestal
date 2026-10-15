import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Adapted from reactbits.dev ScrollVelocity (originally motion/react) to GSAP: a looping band that drifts on its own,
// follows the scroll direction and speeds up with scroll velocity. Runs only while on screen.
export default function ScrollVelocity({ children, speed = 2.5, paused = false, className }: { children: ReactNode; speed?: number; paused?: boolean; className?: string }) {
  const band = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paused) return
    let x = Number(gsap.getProperty(track.current, 'xPercent')) || 0
    let direction = -1
    let boost = 0
    const wrap = gsap.utils.wrap(-50, 0)
    const scroll = ScrollTrigger.create({
      onUpdate: (self) => {
        direction = self.direction === 1 ? -1 : 1
        boost = gsap.utils.clamp(0, 25, Math.abs(self.getVelocity()) / 120)
      },
    })
    const tick = (_time: number, delta: number) => {
      boost *= 0.94
      x = wrap(x + direction * (speed + boost) * (delta / 1000))
      gsap.set(track.current, { xPercent: x })
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    })
    observer.observe(band.current!)
    return () => {
      observer.disconnect()
      gsap.ticker.remove(tick)
      scroll.kill()
    }
  }, [speed, paused])

  return (
    <div ref={band} className={`overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div ref={track} className="flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  )
}
