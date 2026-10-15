import LegalPage from '../components/LegalPage'
import { pageMeta, site } from '../lib/seo'

export const meta = () =>
  pageMeta({
    title: `Política de Privacidad | ${site.name}`,
    description: `Política de Privacidad sobre el tratamiento de datos personales por ${site.name}.`,
    path: '/privacidad/',
    type: 'website',
  })

// Text from the Eleventy page; section 8 now describes the consent-gated Google Analytics 4 the site uses.
const sections = [
  { title: 'Responsable del tratamiento', body: 'El responsable del tratamiento de sus datos es Forestal Garuhapé SA. Para consultas relacionadas con datos personales puede contactarnos a través del formulario de contacto disponible en el sitio.' },
  { title: 'Datos que recopilamos', body: 'Podemos recopilar los siguientes datos personales cuando interactúa con nuestro sitio o contrata servicios: nombre, dirección de correo electrónico, teléfono, empresa, cargo, dirección, y cualquier otro dato que usted proporcione voluntariamente en formularios o comunicaciones.' },
  { title: 'Finalidades del tratamiento', body: 'Utilizamos sus datos para las siguientes finalidades: responder consultas, gestionar solicitudes y contratos, enviar información relacionada con nuestros servicios (previo consentimiento cuando corresponda), mejorar el sitio y cumplir obligaciones legales y fiscales.' },
  { title: 'Legitimación', body: 'El tratamiento se sustenta en diferentes bases legales según el caso: consentimiento del interesado para fines promocionales, ejecución de un contrato cuando contrata nuestros servicios, cumplimiento de obligaciones legales y el interés legítimo para la seguridad y mejora de servicios.' },
  { title: 'Conservación de los datos', body: 'Conservaremos los datos el tiempo necesario para cumplir con la finalidad para la que se recabaron y para atender las obligaciones legales y fiscales aplicables. Cuando corresponda, los datos serán eliminados o se conservarán bloqueados, según la normativa aplicable.' },
  { title: 'Comunicaciones y cesiones', body: 'No cedemos sus datos a terceros salvo en los casos necesarios para la prestación del servicio (proveedores con los que contratemos servicios de hosting, pago o envío) o cuando existan obligaciones legales. En esos casos aseguramos la existencia de contratos que preserven la confidencialidad y seguridad de los datos.' },
  { title: 'Seguridad', body: 'Adoptamos medidas técnicas y organizativas razonables para proteger los datos personales frente a accesos no autorizados, pérdida o divulgación. No obstante, recuerde que no existe seguridad absoluta en las comunicaciones por Internet.' },
  {
    title: 'Cookies y medición',
    body: (
      <>
        El sitio utiliza Google Analytics 4 para medir de forma agregada las visitas y las consultas recibidas. Estas cookies de análisis solo se activan si usted las acepta en el aviso de cookies; si las rechaza, el sitio funciona igual sin ellas. Puede cambiar su elección en cualquier momento desde «Preferencias de cookies», al pie del sitio, o eliminar las cookies desde la configuración de su navegador.
      </>
    ),
  },
  { title: 'Derechos del interesado', body: 'Usted tiene derecho a solicitar el acceso, rectificación, supresión, limitación u oposición al tratamiento de sus datos, así como a la portabilidad de los mismos cuando proceda. Para ejercer sus derechos puede enviarnos una solicitud a través del formulario de contacto o a la dirección de correo que figure en el sitio, aportando la información necesaria para identificarle.' },
  { title: 'Modificaciones', body: 'Podremos actualizar esta política para adaptarla a cambios normativos o de funcionamiento. Publicaremos la versión actualizada en esta página indicando la fecha de revisión.' },
]

export default function Privacidad() {
  return (
    <LegalPage
      title="Política de Privacidad"
      intro="En Forestal Garuhapé SA nos comprometemos a proteger la privacidad y seguridad de los datos personales que nos confía. Esta política explica qué datos recopilamos, con qué finalidades, cómo los usamos y qué derechos tiene usted respecto de sus datos."
      sections={sections}
      contact="Si tiene dudas sobre esta política o desea ejercer sus derechos, contáctenos mediante el formulario del sitio."
    />
  )
}
