import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from './smooth'
import { EASE_IN, registerEases } from './motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * The page's single motion vocabulary, opt-in via data-anim:
 *   lines   text rises line by line out of a mask
 *   media   a frame unclips upward while its image settles from a slight zoom
 *   fade    small copy lifts in
 *   stagger direct children lift in one after another
 * Same curve and trigger point everywhere. DOM defaults are the final state, so reduced motion just skips this.
 */
export function useReveals() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    registerEases()
    const at = (el: Element) => ({ trigger: el, start: 'top 88%', once: true })
    // Anything already on screen at load stays as rendered: hiding it for an entrance would delay LCP.
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight
    const targets = (anim: string) => gsap.utils.toArray<HTMLElement>(`[data-anim="${anim}"]`).filter(below)

    const ctx = gsap.context(() => {
      targets('lines').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true, // re-split when fonts load or the width changes
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: EASE_IN, stagger: 0.08, scrollTrigger: at(el) }),
        })
      })

      targets('media').forEach((el) => {
        gsap
          .timeline({ scrollTrigger: at(el), defaults: { duration: 1.4, ease: EASE_IN } })
          .from(el, { clipPath: 'inset(100% 0% 0% 0%)' })
          .from(el.querySelector('img'), { scale: 1.15 }, 0)
      })

      targets('fade').forEach((el) => {
        gsap.from(el, { y: 16, opacity: 0, duration: 0.9, ease: EASE_IN, scrollTrigger: at(el) })
      })

      targets('stagger').forEach((el) => {
        gsap.from(el.children, { y: 24, opacity: 0, duration: 0.9, ease: EASE_IN, stagger: 0.07, scrollTrigger: at(el) })
      })
    })
    return () => ctx.revert()
  }, [])
}
