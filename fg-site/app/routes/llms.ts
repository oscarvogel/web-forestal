import site from '../content/site.json'
import { services } from '../content/servicios'

// Port of the Eleventy llms.njk: a plain-text brief for AI assistants.
export function loader() {
  const body = `# ${site.name}

> ${site.defaultDescription}

Sitio oficial: ${site.url}/

## Actividad

${site.name} forma parte de un grupo de empresas (Forestal Garuhapé SA, Forestal Paraguay SA y Foresvia SA) dedicado desde ${site.foundingYear} a la consultoría forestal y a la prestación de servicios forestales sustentables totalmente mecanizados. Opera en Argentina y Paraguay.

## Servicios principales

${services.map((s) => `- [${s.title}](${site.url}${s.url}): ${s.description}`).join('\n')}

## Contacto

- Email: ${site.email}
- Teléfono / WhatsApp: ${site.telephone}

## Páginas importantes

- Inicio: ${site.url}/
- Servicios: ${site.url}/servicios/
- Consultoría forestal: ${site.url}/consultoria/
- Nosotros: ${site.url}/nosotros/
- Sitemap: ${site.url}/sitemap.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
