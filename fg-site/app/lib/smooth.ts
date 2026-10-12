import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { desktopMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The live instance, so an open menu can pause page scrolling. */
export let lenis: Lenis | null = null

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    // DESIGN.md: smooth scrolling only for desktop with a fine pointer; touch keeps native scrolling.
    if (!window.matchMedia(desktopMotion).matches) return
    const instance = new Lenis({ lerp: 0.09, anchors: true })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => instance.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
