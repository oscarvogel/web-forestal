// Shared motion vocabulary, ported from the Eleventy site's src/js/motion-kit.js.
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import type { CSSProperties } from 'react'

/**
 * Gate for the pinned rails and the scrubbed scenes.
 *
 * Antes exigia min-width: 1024px, y eso dejaba sin efectos a cualquier ventana
 * chica o pantalla de portatil, aunque el sitio funciona bien ahi. La restriccion
 * no era tecnica: los rails se reordenan con data-[motion=on] (w-max y
 * min(58vw, 62rem)), o sea que el layout se adapta solo a cualquier ancho.
 *
 * Lo que si rompe el efecto es el TACTIL, donde un rail horizontal fijado pelea
 * con el desplazamiento con inercia. Por eso se mantiene pointer: fine.
 *
 * prefers-reduced-motion ya no se consulta: por decision del proyecto las
 * animaciones no dependen de la preferencia del sistema operativo. Lo blinda
 * scripts/check-motion-policy.mjs, que falla el build si vuelve a aparecer.
 */
export const motionAllowed = '(pointer: fine)'

/**
 * El video del hero pesa 2,8 MB. Ahi el ancho si importa: en una pantalla chica
 * se come el ancho de banda sin aportar mucho, asi que sigue exigiendo un
 * minimo razonable.
 */
export const heroVideoAllowed = '(min-width: 768px) and (pointer: fine)'

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
