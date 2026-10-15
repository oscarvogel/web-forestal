import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = fileURLToPath(new URL('../app/', import.meta.url))
const sourceExtensions = new Set(['.css', '.ts', '.tsx'])
const failures = []

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      inspect(path)
      continue
    }
    if (!sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) continue
    // Se buscan comentarios tambien, asi que hay que sacarlos antes: si no, la
    // decision no se puede ni documentar en el codigo que la aplica.
    const code = readFileSync(path, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
    if (/prefers-reduced-motion|prefersReducedMotion/.test(code)) failures.push(relative(appDir, path))
  }
}

inspect(appDir)
if (failures.length) {
  console.error(`La app no debe depender de la preferencia de movimiento del sistema:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log('Las animaciones no dependen de prefers-reduced-motion.')
