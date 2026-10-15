import Lottie from '../components/Lottie'
import Picture from '../components/Picture'
import { sgc } from '../content/home'

export default function Sgc() {
  return (
    <section id="sgi" aria-labelledby="sgc-titulo" className="relative overflow-hidden bg-night px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div aria-hidden="true" className="absolute inset-0 opacity-25">
        <Picture src="/images/actualizadas/consultoria-forestal.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/60 to-night" />
      </div>

      <div className="relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-caption" data-anim="fade">Sistema de Gestión de Calidad</p>
          <h2 id="sgc-titulo" className="mt-5 text-[clamp(2.75rem,6vw,6rem)]" data-anim="lines">
            Operar también es cuidar.
          </h2>
        </div>
        <ol className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-7" data-anim="stagger">
          {sgc.map((item, index) => (
            <li key={item.key} className="bg-night/90 p-8 backdrop-blur-sm">
              <Lottie name={`sgc-${item.key}`} delay={index * 140} className="block h-14 w-14" />
              <h3 className="mt-8 text-2xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{item.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
