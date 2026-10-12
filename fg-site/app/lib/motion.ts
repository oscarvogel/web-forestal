// Shared motion vocabulary, ported from the Eleventy site's src/js/motion-kit.js.
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import type { CSSProperties } from 'react'

/** Only this case gets scrubbed, pinned scenes and the hero video. */
export const desktopMotion = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
export const EASE_IN = 'fgOut'
export const EASE_MOVE = 'fg'

let registered = false
export function registerEases() {
  if (registered) return
  registered = true
  gsap.registerPlugin(CustomEase)
  CustomEase.create(EASE_IN, '.05,.7,.1,1')
  CustomEase.create(EASE_MOVE, '.4,0,.2,1')
}

/** Delay index for the CSS .intro / .intro-line first-paint entrances (app.css). */
export const stagger = (index: number) => ({ '--i': index }) as CSSProperties
