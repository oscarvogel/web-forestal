import { useEffect, useState } from 'react'
import { analyticsEnabled, OPEN_PREFERENCES, readChoice, saveChoice, type Choice } from '../lib/analytics'

/** Non-blocking consent card; accept and reject carry the same weight. Hidden when GA is not configured. */
export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!analyticsEnabled) return
    setOpen(readChoice() === null)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_PREFERENCES, reopen)
    return () => window.removeEventListener(OPEN_PREFERENCES, reopen)
  }, [])

  if (!open) return null
  const choose = (choice: Choice) => {
    saveChoice(choice)
    setOpen(false)
  }
  return (
    <section
      role="region"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-3 bottom-3 z-[85] max-w-md border border-line bg-forest/95 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:left-5 sm:bottom-5"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        Usamos cookies de Google Analytics para medir las visitas y mejorar el sitio, solo si usted lo acepta.{' '}
        <a className="underline underline-offset-4 hover:text-ink" href="/privacidad/">Política de privacidad</a>.
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose('denied')} className="flex-1 border border-ink-soft/40 px-4 py-2.5 text-sm font-semibold hover:bg-night">
          Rechazar
        </button>
        <button type="button" onClick={() => choose('granted')} className="btn flex-1 justify-center py-2.5 text-sm">
          Aceptar
        </button>
      </div>
    </section>
  )
}
