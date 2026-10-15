// Deploy de build/client/ al hosting Apache (Ferozo).
//
// Estrategia: reemplazo selectivo encima. NO borra el document root, asi que
// v1/, storyboard-v2/, error_log y .well-known/ quedan intactos. Es deliberado:
// borrar todo seria mas simple pero podria destruir archivos del servidor que
// no vienen del build.
//
// Proteccion: sin DEPLOY_CONFIRM=SI en .env, este script no sube nada.
//
// Uso: npm run build && npm run deploy

import { Client } from 'basic-ftp'
import { readdirSync, statSync, createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { leerConfigDeploy } from './deploy-config.mjs'

const projectRoot = path.resolve(import.meta.dirname, '..')
const siteRoot = path.join(projectRoot, 'build', 'client')

// Lo que jamas se toca: no viene del build, y el deploy no debe pisarlo.
const PRESERVAR = new Set(['v1', 'storyboard-v2', 'error_log', '.well-known', '.ftpquota'])

function listarLocales(dir, acc = [], profundidad = 0) {
  if (profundidad > 10) return acc
  for (const nombre of readdirSync(dir)) {
    const completo = path.join(dir, nombre)
    const info = statSync(completo)
    if (info.isDirectory()) {
      listarLocales(completo, acc, profundidad + 1)
    } else {
      acc.push({ local: completo, relativa: path.relative(siteRoot, completo).split(path.sep).join('/'), size: info.size })
    }
  }
  return acc
}

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1)
}

async function main() {
  const { host, user, pass, port, protocol, dir, confirm, checkUrl } = leerConfigDeploy()

  if (!existsSync(siteRoot)) {
    throw new Error(`No existe ${siteRoot}. Corré "npm run build" primero.`)
  }

  const archivos = listarLocales(siteRoot)
  const bytes = archivos.reduce((s, a) => s + a.size, 0)

  console.log('=== Deploy a produccion ===')
  console.log(`Servidor:  ${host}:${port}`)
  console.log(`Destino:   ${dir}`)
  console.log(`Archivos:  ${archivos.length}  (${mb(bytes)} MB)`)
  console.log(`Se conservan sin tocar: ${[...PRESERVAR].join(', ')}`)
  console.log('')

  if (!confirm) {
    console.log('*** DEPLOY DETENIDO ***')
    console.log('DEPLOY_CONFIRM esta en NO en el .env.')
    console.log('No se subio nada. Ponelo en SI cuando quieras autorizar la subida.')
    console.log('')
    console.log('Para autorizarlo:')
    console.log('  poné DEPLOY_CONFIRM=SI en .env  y volvé a correr este script')
    return
  }

  console.log('DEPLOY_CONFIRM=SI: subiendo.')
  console.log('')

  const client = new Client()
  client.ftp.timeout = 120000

  const folders = []
  for (const archivo of archivos) {
    const carpeta = path.posix.dirname(archivo.relativa)
    if (carpeta !== '.' && !folders.includes(carpeta)) folders.push(carpeta)
  }
  folders.sort((a, b) => a.split('/').length - b.split('/').length)

  try {
    await client.access({ host, user, password: pass, port, secure: protocol === 'sftp' })
    console.log('CONEXION OK')

    // Trabajar dentro del destino, para no depender de donde arranca el FTP.
    await client.ensureDir(dir.replace(/\/+$/, '') || '/')

    // Crear carpetas antes de subir, para no fallar a mitad de camino.
    for (const carpeta of folders) {
      await client.ensureDir(carpeta)
    }
    console.log(`Carpetas listas: ${folders.length}`)
    console.log('')

    let subidos = 0
    let subidosBytes = 0
    let ultimoLog = Date.now()

    for (const archivo of archivos) {
      // Defensa extra: nunca tocar las carpetas reservadas.
      const primero = archivo.relativa.split('/')[0]
      if (PRESERVAR.has(primero)) continue

      const destinoRemoto = `${dir.replace(/\/+$/, '')}/${archivo.relativa}`
      await client.uploadFrom(createReadStream(archivo.local), destinoRemoto)
      subidos += 1
      subidosBytes += archivo.size

      if (Date.now() - ultimoLog > 5000) {
        ultimoLog = Date.now()
        const pct = ((subidos / archivos.length) * 100).toFixed(0)
        console.log(`  ${subidos}/${archivos.length} (${pct}%)  ${mb(subidosBytes)} MB`)
      }
    }

    console.log('')
    console.log(`SUBIDA COMPLETA: ${subidos} archivos, ${mb(subidosBytes)} MB`)
    console.log(`Sitio: ${checkUrl}`)
  } catch (error) {
    console.error('')
    console.error('FALLO LA SUBIDA:', error.message)
    console.error('El servidor quedo con una mezcla de archivos viejos y nuevos.')
    console.error('Se puede volver atras con el backup local en ftp-test/tmp/backup-produccion-*.')
    process.exitCode = 1
  } finally {
    client.close()
  }
}

main().catch((error) => {
  console.error('ERROR:', error.message)
  process.exitCode = 1
})
