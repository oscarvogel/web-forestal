import { site } from '../content/home'
import { analyticsEnabled, OPEN_PREFERENCES } from '../lib/analytics'

const external = { target: '_blank', rel: 'noopener noreferrer' }

export default function Footer() {
  return (
    <footer className="border-t border-line bg-night px-5 pt-16 pb-8 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <a href="/" aria-label={`${site.name}, inicio`}>
            <img src="/images/fg-negative.svg" alt="" width="215" height="116" loading="lazy" className="h-16 w-auto" />
          </a>
          <p className="mt-6 max-w-sm text-ink-soft">Servicios forestales y logística para la cadena foresto-industrial.</p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="eyebrow font-sans tracking-[0.14em] text-caption">Compañía</h2>
          <ul className="mt-5 space-y-3 text-ink-soft">
            <li><a className="hover:text-ink" href="/servicios/">Servicios</a></li>
            <li><a className="hover:text-ink" href="/nosotros/">Nosotros y SGC</a></li>
            <li><a className="hover:text-ink" href="/trabaja/">Empleo</a></li>
            <li><a className="hover:text-ink" href="/privacidad/">Privacidad</a></li>
            <li><a className="hover:text-ink" href="/terminos/">Términos</a></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="eyebrow font-sans tracking-[0.14em] text-caption">Grupo</h2>
          <ul className="mt-5 space-y-3 text-ink-soft">
            <li>Forestal Garuhapé SA · Argentina</li>
            <li>
              <a className="hover:text-ink" href="https://forestalparaguay.com/" {...external}>
                Forestal Paraguay SA · Paraguay <span aria-hidden="true">↗</span>
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </li>
            <li>Foresvia SA · Flota de camiones</li>
          </ul>
          <h2 className="eyebrow mt-10 font-sans tracking-[0.14em] text-caption">Oportunidades</h2>
          <p className="mt-4 text-sm text-ink-soft">Las postulaciones y los CV se reciben a través de Vogel Consultoría.</p>
          <a className="ink-link mt-3 text-sm" href="https://vogelconsultoria.com.ar" {...external}>
            Enviar CV <span aria-hidden="true">↗</span>
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-xs text-caption">
        <span>© {new Date().getFullYear()} {site.name}</span>
        {analyticsEnabled && (
          <button type="button" className="hover:text-ink" onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))}>
            Preferencias de cookies
          </button>
        )}
        <a href={site.url}>forestalgaruhape.com.ar</a>
        <a className="hover:text-ink" href="https://github.com/romanvsc" {...external}>
          Diseño y desarrollo: Román Vogel Corach
          <span className="sr-only"> (abre en otra pestaña)</span>
        </a>
      </div>
    </footer>
  )
}
