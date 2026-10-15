// Google Analytics 4, loaded only after the visitor accepts analytics cookies (nothing reaches Google before that).
// Set VITE_GA_ID=G-XXXXXXX in fg-site/.env; without it there is no banner and no tracking.
type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined
const KEY = 'fg-cookies'
export type Choice = 'granted' | 'denied'

export const analyticsEnabled = Boolean(GA_ID)
let loaded = false

export function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

function load() {
  if (!GA_ID || loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  // gtag.js expects the arguments object itself, not an array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.append(script)
}

function revoke() {
  if (loaded) window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  // Remove GA cookies already set on this domain and its parent.
  const host = location.hostname.replace(/^www\./, '')
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((name) => name.startsWith('_ga')).forEach((name) => {
    for (const domain of ['', `; domain=.${host}`]) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
  })
}

export function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    // Private mode: the choice holds for this visit only.
  }
  if (choice === 'granted') load()
  else revoke()
}

export function track(name: string, params: Record<string, string> = {}) {
  if (loaded) window.gtag?.('event', name, params)
}

/** Restores an earlier "accept" and reports contact clicks (WhatsApp, phone, e-mail) as conversions. */
export function initAnalytics() {
  if (!analyticsEnabled) return () => {}
  if (readChoice() === 'granted') load()
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!link) return
    const method = link.href.includes('api.whatsapp.com') ? 'whatsapp' : link.protocol === 'tel:' ? 'telefono' : link.protocol === 'mailto:' ? 'email' : null
    if (method) track('contact_click', { method, page: location.pathname })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** Lets the footer reopen the banner. */
export const OPEN_PREFERENCES = 'fg:cookie-preferences'
