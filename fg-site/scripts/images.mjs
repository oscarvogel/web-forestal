// Graded AVIF/WebP variants for the photos the React site uses, with the same color grade as the Eleventy build.
// Run from fg-site/: `npm run images`. Writes public/img/* and app/content/images.json (sizes for <Picture>).
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const repoRoot = path.resolve(import.meta.dirname, '../..')
const sharp = require(path.join(repoRoot, 'node_modules/sharp'))
const { gradeFor } = require(path.join(repoRoot, 'scripts/build.js'))

const content = (file) => JSON.parse(readFileSync(path.join(import.meta.dirname, '../app/content', file), 'utf8'))
const galleries = readdirSync(path.join(import.meta.dirname, '../app/content/galerias')).flatMap((file) => content(`galerias/${file}`))
// Every raster the pages reference: Home photos, service images and galleries, consulting cards.
const sources = [
  ...new Set([
    '/images/servicios/playa_acopio_1.jpeg',
    content('nosotros.json').imagen,
    ...content('servicios.json').map((s) => s.imagen),
    ...galleries.map((p) => p.src),
    ...content('consultoria.json').map((a) => a.imagen),
  ]),
].filter((url) => !url.endsWith('.svg') && !url.includes('-transparente') && existsSync(path.join(repoRoot, 'src', url)))
const widths = [480, 768, 1280, 1920]
const outDir = path.join(import.meta.dirname, '../public/img')
mkdirSync(outDir, { recursive: true })

const manifest = {}
for (const url of sources) {
  const source = path.join(repoRoot, 'src', url)
  const { width, height } = await sharp(source).rotate().metadata()
  const slug = path.basename(url, path.extname(url)).replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
  const grade = gradeFor(url)
  const fit = [...widths.filter((w) => w < Math.min(width, 1920)), Math.min(width, 1920)]
  for (const w of fit) {
    for (const format of ['avif', 'webp']) {
      const file = path.join(outDir, `${slug}-${w}.${format}`)
      if (existsSync(file)) continue
      let pipeline = sharp(source).rotate().resize({ width: w })
      if (grade) pipeline = pipeline.modulate(grade)
      await (format === 'avif' ? pipeline.avif({ quality: 52, effort: 4 }) : pipeline.webp({ quality: 74 })).toFile(file)
    }
  }
  manifest[url] = { slug, width, height, widths: fit }
  console.log(`${url} → ${fit.length} anchos`)
}
writeFileSync(path.join(import.meta.dirname, '../app/content/images.json'), JSON.stringify(manifest, null, 2) + '\n')
