/** Closing call to action of interior pages; `service` preselects it in the Home form. */
export default function CtaBand({ title = 'Hablemos de su próxima operación.', service }: { title?: string; service?: string }) {
  return (
    <section aria-label="Contacto" className="bg-forest px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:items-end">
        <h2 className="text-[clamp(2.5rem,5.4vw,5.5rem)] lg:col-span-8" data-anim="lines">{title}</h2>
        <div className="flex flex-wrap items-center gap-6 lg:col-span-4 lg:justify-end" data-anim="fade">
          <a className="btn" href={service ? `/?servicio=${service}#contacto` : '/#contacto'}>
            Consultar <span aria-hidden="true">→</span>
          </a>
          <a className="ink-link" href="https://api.whatsapp.com/send?phone=5493743485849&text=Hola" target="_blank" rel="noopener noreferrer">
            WhatsApp <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
