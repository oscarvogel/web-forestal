import { pageMeta, site } from '../lib/seo'
import HeroGrupo from '../sections/HeroGrupo'
import Clientes from '../sections/Clientes'
import Capacidades from '../sections/Capacidades'
import Operacion from '../sections/Operacion'
import Trayectoria from '../sections/Trayectoria'
import Cifras from '../sections/Cifras'
import Sgc from '../sections/Sgc'
import Contacto from '../sections/Contacto'

const faq = [
  ['¿Qué servicios ofrece Forestal Garuhapé SA?', 'Forestal Garuhapé SA ofrece cosecha forestal mecanizada, transporte forestal, aprovechamiento de biomasa, playas de acopio, caminos forestales y consultoría para la cadena foresto-industrial.'],
  ['¿Dónde opera Forestal Garuhapé SA?', 'La empresa forma parte de un grupo con operación en Argentina y Paraguay, con foco en soluciones forestales para la región Mercosur.'],
  ['¿Desde cuándo trabaja Forestal Garuhapé SA en servicios forestales?', 'El grupo de empresas está dedicado a la consultoría y prestación de servicios forestales sustentables desde 1993.'],
]

export const meta = () =>
  pageMeta({
    title: site.defaultTitle,
    description: site.defaultDescription,
    path: '/',
    type: 'website',
    extra: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
      },
    ],
  })

export default function Home() {
  return (
    <>
      <HeroGrupo />
      <Clientes />
      <Capacidades />
      <Operacion />
      <Trayectoria />
      <Cifras />
      <Sgc />
      <Contacto />
    </>
  )
}
