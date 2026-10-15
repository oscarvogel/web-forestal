import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = fileURLToPath(new URL('../app/', import.meta.url))
const extensions = new Set(['.css', '.ts', '.tsx'])
const failures = []

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      inspect(path)
      continue
    }
    if (!extensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) continue
    if (/prefers-reduced-motion|prefersReducedMotion/.test(readFileSync(path, 'utf8'))) {
      failures.push(relative(appDir, path))
    }
  }
}

inspect(appDir)
if (failures.length) {
  console.error(`La app no debe depender de la preferencia de movimiento del sistema:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log('Las animaciones no dependen de prefers-reduced-motion.')
