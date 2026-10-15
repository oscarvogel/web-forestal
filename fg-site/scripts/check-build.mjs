// After `react-router build`: every page must be prerendered with its content, canonical and valid JSON-LD
// (SEO, no-JS), the sitemap must list them, and the official contact data must be the current one
// (mirrors ../scripts/check-contact.mjs for the Eleventy site).
import { existsSync, readFileSync } from 'node:fs'

const out = new URL('../build/client/', import.meta.url)
const read = (path) => readFileSync(new URL(path, out), 'utf8')
if (!existsSync(new URL('index.html', out))) {
  console.error('Falta build/client/index.html: ejecutar `npm run build` primero.')
  process.exit(1)
}
const json = (file) => JSON.parse(readFileSync(new URL(`../app/content/${file}`, import.meta.url), 'utf8'))
const servicios = json('servicios.json')
const clientes = json('clientes.json').clientes
const site = json('site.json')

const pages = {
  '/': ['Garuhapé.', 'Del bosque', 'a la industria.', 'Foresvia SA', 'action="/enviar_mensaje.php"', 'name="website"', '"FAQPage"', ...servicios.map((s) => `value="${s.slug}"`), ...clientes.map((c) => `alt="${c.alt}"`)],
  '/servicios/': ['Nuestras capacidades.', ...servicios.map((s) => s.titulo)],
  ...Object.fromEntries(
    servicios.filter((s) => s.slug !== 'consultoria-forestal').map((s) => [`/servicios/${s.slug}/`, [`${s.titulo}.`, 'Alcance del servicio.', ...s.alcance, '"@type":"Service"', `/?servicio=${s.slug}#contacto`]]),
  ),
  '/consultoria/': ['Áreas de consultoría.', ...json('consultoria.json').map((a) => a.titulo)],
  '/nosotros/': ['Forestal Garuhapé SA.', 'Tres empresas. Dos países.', ...json('sgi.json').items.map((i) => i.titulo)],
  '/trabaja/': ['Vogel Consultoría'],
  '/privacidad/': ['Política de Privacidad', 'Google Analytics 4'],
  '/terminos/': ['Términos y Condiciones'],
}

const failures = []
const fail = (message) => failures.push(message)
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')

for (const [path, expected] of Object.entries(pages)) {
  const file = `${path.slice(1)}index.html`
  if (!existsSync(new URL(file, out))) {
    fail(`${path}: no se prerenderizó (${file})`)
    continue
  }
  const html = read(file)
  if (!html.includes(`rel="canonical" href="${site.url}${path}"`)) fail(`${path}: canonical incorrecto`)
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail(`${path}: debe tener exactamente un <h1>`)
  if (!html.includes('lang="es-AR"')) fail(`${path}: falta lang="es-AR"`)
  for (const text of expected) if (!html.includes(text) && !html.includes(escape(text))) fail(`${path}: falta «${text}»`)
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      JSON.parse(body)
    } catch {
      fail(`${path}: JSON-LD inválido`)
    }
  }
  for (const old of ['+54 9 3743 47-1089', '5493743471089']) if (html.includes(old)) fail(`${path}: dato de contacto viejo ${old}`)
}

const home = read('index.html')
for (const current of ['+54 9 3743 48-5849', '5493743485849']) if (!home.includes(current)) fail(`/: falta el contacto oficial ${current}`)

const sitemap = existsSync(new URL('sitemap.xml', out)) ? read('sitemap.xml') : ''
for (const path of Object.keys(pages)) if (!sitemap.includes(`<loc>${site.url}${path}</loc>`)) fail(`sitemap.xml: falta ${path}`)
if (!existsSync(new URL('robots.txt', out)) || !read('robots.txt').includes(`Sitemap: ${site.url}/sitemap.xml`)) fail('robots.txt: falta o no apunta al sitemap')
if (!existsSync(new URL('llms.txt', out))) fail('llms.txt: falta')
if (!existsSync(new URL('__spa-fallback.html', out))) fail('__spa-fallback.html: falta (es la página 404 de Apache)')
if (!existsSync(new URL('enviar_mensaje.php', out))) fail('enviar_mensaje.php: falta en el build')

// El hosting corre PHP 7.4.33 (verificado con un probe, no supuesto). Si el
// build sube un archivo que use algo de PHP 8, el formulario de contacto deja de
// funcionar con un 500 que SOLO se ve mirando el error_log del servidor. Se
// avisa aca, que es donde se lee.
const php = read('enviar_mensaje.php')
const soloPhp8 = [
  [/\bstr_contains\s*\(/, 'str_contains() (PHP 8.0+)'],
  [/\bstr_starts_with\s*\(/, 'str_starts_with() (PHP 8.0+)'],
  [/\bstr_ends_with\s*\(/, 'str_ends_with() (PHP 8.0+)'],
  [/:\s*never\b/, 'tipo de retorno never (PHP 8.1+)'],
  [/\?->/, 'operador nullsafe ?-> (PHP 8.0+)'],
  [/\bmatch\s*\(/, 'match() (PHP 8.0+)'],
]
for (const [re, nombre] of soloPhp8) {
  if (re.test(php)) fail(`enviar_mensaje.php usa ${nombre}; el hosting corre PHP 7.4`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log(`Build OK: ${Object.keys(pages).length} páginas prerenderizadas, sitemap, robots, llms y 404.`)
