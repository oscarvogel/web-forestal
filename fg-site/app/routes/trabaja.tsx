import PageIntro from '../components/PageIntro'
import { pageMeta, site } from '../lib/seo'

export const meta = () =>
  pageMeta({
    title: `Empleo | ${site.name}`,
    description: `Información para postulaciones laborales vinculadas a ${site.name}.`,
    path: '/trabaja/',
    image: '/images/actualizadas/caminos-forestales.png',
    type: 'website',
  })

const vogel = 'https://vogelconsultoria.com.ar'

export default function Trabaja() {
  return (
    <>
      <PageIntro
        eyebrow="Oportunidades laborales"
        title="Trabajar con Forestal Garuhapé SA."
        lead="Las postulaciones y los currículum vitae se reciben a través de Vogel Consultoría."
      />
      <section aria-labelledby="postulacion-titulo" className="bg-night px-5 pb-32 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="postulacion-titulo" className="text-[clamp(2.25rem,4vw,4rem)]" data-anim="lines">Presentá tu CV en Vogel Consultoría.</h2>
            <p className="mt-6 max-w-lg text-ink-soft" data-anim="fade">
              Vogel Consultoría es el canal de recepción de los CV para oportunidades relacionadas con Forestal Garuhapé SA.
            </p>
            <a className="btn mt-10" href={vogel} target="_blank" rel="noopener noreferrer">
              Ir a Vogel Consultoría <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span>
            </a>
          </div>
          <aside className="border border-line p-8 lg:col-span-4 lg:col-start-9" data-anim="fade">
            <h2 className="text-2xl tracking-[-0.03em]">Canal de postulación</h2>
            <p className="mt-4 text-ink-soft">Al continuar, saldrá del sitio de Forestal Garuhapé SA y llegará a Vogel Consultoría.</p>
          </aside>
        </div>
      </section>
    </>
  )
}
