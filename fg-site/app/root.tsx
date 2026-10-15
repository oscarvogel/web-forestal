import { useEffect, type ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import './app.css'
import manrope from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
import workSans from '@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2?url'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import { initAnalytics } from './lib/analytics'
import { useSmoothScroll } from './lib/smooth'
import { useReveals } from './lib/reveal'

// Both latin faces are on every first screen: preloading them avoids the swap that shifted the hero (CLS).
export const links = () =>
  [manrope, workSans].map((href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossOrigin: 'anonymous' as const }))

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#061c17" />
        <link rel="icon" href="/images/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  useSmoothScroll()
  useReveals()
  useEffect(initAnalytics, [])
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-forest focus:px-4 focus:py-3">
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}

// Also the 404 page: Apache serves __spa-fallback.html for unknown URLs and no route matches here.
export function ErrorBoundary({ error }: { error: unknown }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <>
      <title>{notFound ? 'Página no encontrada | Forestal Garuhapé SA' : 'Error | Forestal Garuhapé SA'}</title>
      <meta name="robots" content="noindex" />
      <Nav />
      <main id="contenido" className="flex min-h-svh flex-col justify-end bg-night px-5 pt-36 pb-20 sm:px-8 lg:px-12">
        <p className="eyebrow text-caption">{notFound ? 'Error 404' : 'Error'}</p>
        <h1 className="mt-6 max-w-5xl text-[clamp(3.25rem,8.6vw,9rem)] leading-[0.92]">
          {notFound ? 'Este camino no lleva al monte.' : 'Algo no salió como esperábamos.'}
        </h1>
        <p className="mt-8 max-w-md text-lg text-ink-soft">
          {notFound ? 'La página que busca no existe o cambió de dirección.' : 'Intente recargar la página en unos minutos.'}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a className="btn" href="/">Volver al inicio <span aria-hidden="true">→</span></a>
          <a className="ink-link" href="/servicios/">Ver servicios</a>
          <a className="ink-link" href="/#contacto">Contacto</a>
        </div>
      </main>
      <Footer />
    </>
  )
}
