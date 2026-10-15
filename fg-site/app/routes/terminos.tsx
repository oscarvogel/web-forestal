import LegalPage from '../components/LegalPage'
import { pageMeta, site } from '../lib/seo'

export const meta = () =>
  pageMeta({
    title: `Términos y Condiciones | ${site.name}`,
    description: `Términos y condiciones de uso del sitio y de los servicios ofrecidos por ${site.name}.`,
    path: '/terminos/',
    type: 'website',
  })

const sections = [
  { title: 'Alcance', body: 'Estos términos regulan el uso del sitio web, la información y los servicios provistos por Forestal Garuhapé SA. Pueden aplicarse términos adicionales a servicios específicos que se le informarán al contratarlos.' },
  { title: 'Uso del sitio', body: 'Usted se compromete a usar el sitio de forma lícita y respetando la legislación aplicable. Está prohibido introducir contenidos que sean ilegales, difamatorios, obscenos o que infrinjan derechos de terceros.' },
  { title: 'Propiedad intelectual', body: 'Todos los contenidos del sitio (textos, imágenes, logos, diseños, código y demás materiales) son propiedad de Forestal Garuhapé SA o cuentan con licencia para su uso. Queda prohibida la reproducción, distribución o modificación sin autorización expresa.' },
  { title: 'Enlaces a terceros', body: 'El sitio puede contener enlaces a páginas de terceros. Estos enlaces se facilitan únicamente por comodidad; Forestal Garuhapé SA no controla ni respalda el contenido de sitios externos y no se responsabiliza por ellos.' },
  { title: 'Exclusión de garantías', body: 'El sitio y la información se ofrecen "tal cual" y sin garantías de ningún tipo, explícitas o implícitas. Forestal Garuhapé SA no garantiza la disponibilidad continua, la ausencia de errores ni que el contenido sea preciso o actualizado.' },
  { title: 'Limitación de responsabilidad', body: 'En la medida en que lo permita la ley, Forestal Garuhapé SA no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso del sitio o de los servicios, incluso si se hubiera informado de la posibilidad de tales daños.' },
  {
    title: 'Privacidad',
    body: (
      <>
        El tratamiento de datos personales se realiza conforme a nuestra <a className="underline underline-offset-4 hover:text-ink" href="/privacidad/">Política de Privacidad</a>. Para información sobre cómo recopilamos, usamos y protegemos sus datos, consulte esa página.
      </>
    ),
  },
  { title: 'Modificaciones', body: 'Forestal Garuhapé SA se reserva el derecho de modificar estos términos en cualquier momento. Las versiones actualizadas estarán disponibles en esta página; su uso continuado del sitio después de los cambios constituye aceptación de los mismos.' },
  { title: 'Ley aplicable y jurisdicción', body: 'Estos términos se regirán por las leyes de la República Argentina. Para cualquier controversia se someten los tribunales competentes de la jurisdicción donde la empresa tiene su sede, salvo disposición legal en contrario.' },
]

export default function Terminos() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      intro="Bienvenido a Forestal Garuhapé SA. Al acceder y usar este sitio web y/o contratar nuestros servicios, usted acepta los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, por favor no utilice este sitio ni nuestros servicios."
      sections={sections}
      contact="Si tiene preguntas sobre estos términos, puede contactarnos a través de los datos que figuran en la sección de contacto del sitio."
    />
  )
}
