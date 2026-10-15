import { useEffect, useRef, useState, type FormEvent } from 'react'
import Lottie from '../components/Lottie'
import { serviceOptions, site } from '../content/home'
import { track } from '../lib/analytics'

// Port of setupContactForm (Eleventy src/js/main.js). The endpoint and its JSON contract are unchanged:
// 200 {ok:true} = sent, 422 {fieldErrors} = field messages, anything else = generic error.
const serviceLabels: Record<string, string> = {
  'cosecha-forestal': 'Cosecha forestal',
  'transporte-forestal': 'Transporte forestal',
  'aprovechamiento-biomasa-forestal': 'Aprovechamiento de biomasa forestal',
  'playas-de-acopio': 'Playas de acopio en industria',
  'caminos-forestales': 'Caminos forestales',
  'consultoria-forestal': 'Consultoría forestal',
}
const fieldNames = ['nombre', 'email', 'mensaje', 'servicio'] as const
type Field = (typeof fieldNames)[number]
type Status = { message: string; state: 'success' | 'error' } | null

const SENT = 'El envío fue aceptado. Gracias por comunicarse con Forestal Garuhapé SA.'
const input = 'mt-2 w-full border-b border-ink-soft/40 bg-transparent py-3 text-lg text-ink outline-none transition-colors focus:border-focus aria-[invalid=true]:border-[#f2a7a0]'
const label = 'eyebrow text-caption'

export default function Contacto() {
  const form = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const lastSuggestion = useRef('')
  const [status, setStatus] = useState<Status>(null)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sending, setSending] = useState(false)

  const field = (name: Field) => form.current!.elements.namedItem(name) as HTMLInputElement

  const suggest = () => {
    const service = serviceLabels[field('servicio').value]
    const suggestion = service ? `Hola, quisiera recibir información sobre ${service}.` : ''
    const message = field('mensaje')
    if (!message.value || message.value === lastSuggestion.current) message.value = suggestion
    lastSuggestion.current = suggestion
  }

  // Links elsewhere carry ?servicio=slug to preselect the service; the no-JS PHP flow returns ?contacto=.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('servicio')
    if (slug && serviceLabels[slug]) field('servicio').value = slug
    suggest()
    if (params.get('contacto') === 'enviado') setStatus({ message: SENT, state: 'success' })
    if (params.get('contacto') === 'error') setStatus({ message: 'No se pudo enviar la consulta. Inténtelo nuevamente o utilice los datos de contacto.', state: 'error' })
  }, [])

  const clearError = (name: string) => setErrors((current) => ({ ...current, [name]: undefined }))

  const onInvalid = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement
    if (!fieldNames.includes(target.name as Field)) return
    setErrors((current) => ({ ...current, [target.name]: target.validity.valueMissing ? 'Complete este campo.' : 'Escriba una dirección de correo válida.' }))
    setStatus({ message: 'Revise los campos señalados.', state: 'error' })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setErrors({})
    if (!form.current!.reportValidity()) return
    setSending(true)
    setStatus(null)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    const announce = (next: NonNullable<Status>) => {
      setStatus(next)
      requestAnimationFrame(() => statusRef.current?.focus())
    }
    try {
      const response = await fetch(form.current!.action, {
        method: 'POST',
        body: new FormData(form.current!),
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        signal: controller.signal,
      })
      const result = await response.json()
      if (response.status === 200 && result.ok === true) {
        track('generate_lead', { form: 'contacto', servicio: field('servicio').value || 'sin-seleccionar' })
        form.current!.reset()
        lastSuggestion.current = ''
        announce({ message: SENT, state: 'success' })
        return
      }
      if (response.status === 422 && result.fieldErrors && typeof result.fieldErrors === 'object') {
        const next: Partial<Record<Field, string>> = {}
        for (const name of fieldNames) if (result.fieldErrors[name]) next[name] = result.fieldErrors[name]
        setErrors(next)
        setStatus({ message: 'Revise los campos señalados y vuelva a intentar.', state: 'error' })
        const first = fieldNames.find((name) => next[name])
        requestAnimationFrame(() => (first ? field(first) : statusRef.current)?.focus())
        return
      }
      announce({ message: `No pudimos enviar la consulta. Puede escribir a ${site.email}.`, state: 'error' })
    } catch (error) {
      announce({
        message:
          (error as Error).name === 'AbortError'
            ? 'La solicitud tardó más de lo esperado. No pudimos confirmar el envío. Sus datos siguen aquí; puede contactarnos por correo o WhatsApp antes de volver a intentar.'
            : 'No pudimos confirmar el envío. Sus datos siguen en el formulario; compruebe su conexión antes de volver a intentar.',
        state: 'error',
      })
    } finally {
      window.clearTimeout(timeout)
      setSending(false)
    }
  }

  const errorFor = (name: Field) =>
    errors[name] ? (
      <span id={`${name}-error`} className="mt-2 block text-sm text-[#f2a7a0]">
        {errors[name]}
      </span>
    ) : null

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-forest px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-caption" data-anim="fade">Contacto comercial</p>
          <h2 id="contacto-titulo" className="mt-5 text-[clamp(2.75rem,5.6vw,6rem)]" data-anim="lines">
            Hablemos de su próxima operación.
          </h2>
          <p className="mt-8 max-w-sm text-ink-soft">Cuéntenos qué necesita y el equipo de Forestal Garuhapé SA recibirá su consulta.</p>
          <ul className="mt-10 space-y-4">
            <li><a className="ink-link" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="ink-link" href="tel:+5493743485849">{site.telephone}</a></li>
            <li>
              <a className="ink-link" href="https://api.whatsapp.com/send?phone=5493743485849&text=Hola" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </li>
          </ul>
        </div>

        <form ref={form} action="/enviar_mensaje.php" method="post" noValidate={false} onSubmit={onSubmit} onInvalidCapture={onInvalid} className="grid gap-8 lg:col-span-7">
          <div
            ref={statusRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            hidden={!status}
            className={`flex items-center gap-4 border p-5 outline-none ${status?.state === 'error' ? 'border-[#f2a7a0]/60 text-[#f9d3cf]' : 'border-focus/50 text-focus'}`}
          >
            {status?.state === 'success' && <Lottie name="form-success" autoplay="mount" className="block h-10 w-10 shrink-0" />}
            {status?.message}
          </div>
          {/* Honeypot checked by enviar_mensaje.php */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label htmlFor="website">Dejar vacío</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <p className="text-sm text-caption">Nombre, correo y mensaje son obligatorios.</p>

          <div>
            <label htmlFor="servicio" className={label}>Servicio (opcional)</label>
            <select id="servicio" name="servicio" onChange={() => { clearError('servicio'); suggest() }} aria-invalid={!!errors.servicio} aria-describedby="servicio-error" className={`${input} [&>option]:bg-forest`}>
              <option value="">Sin seleccionar</option>
              {serviceOptions.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
            </select>
            {errorFor('servicio')}
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={label}>Nombre</label>
              <input id="nombre" name="nombre" type="text" autoComplete="name" required onInput={() => clearError('nombre')} aria-invalid={!!errors.nombre} aria-describedby="nombre-error" className={input} />
              {errorFor('nombre')}
            </div>
            <div>
              <label htmlFor="email" className={label}>Correo electrónico</label>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} required onInput={() => clearError('email')} aria-invalid={!!errors.email} aria-describedby="email-error" className={input} />
              {errorFor('email')}
            </div>
          </div>
          <div>
            <label htmlFor="mensaje" className={label}>¿En qué podemos ayudarle?</label>
            <textarea id="mensaje" name="mensaje" rows={5} required onInput={() => clearError('mensaje')} aria-invalid={!!errors.mensaje} aria-describedby="mensaje-hint mensaje-error" className={`${input} resize-y`} />
            <p id="mensaje-hint" className="mt-2 text-sm text-caption">Indique el servicio, la ubicación de la operación y lo que necesita. Puede editar el mensaje antes de enviarlo.</p>
            {errorFor('mensaje')}
          </div>
          <p className="text-sm text-caption">
            Al enviar, sus datos se procesan según la <a className="underline underline-offset-4 hover:text-ink" href="/privacidad/">política de privacidad</a>.
          </p>
          <div>
            <button type="submit" disabled={sending} aria-busy={sending} className="btn disabled:opacity-60">
              {sending ? 'Enviando…' : 'Enviar consulta'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
