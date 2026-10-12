// Deploy de _site/ al hosting Apache.
//
// Estrategia: reemplazo selectivo encima. NO borra el document root, asi que
// web_vieja/, el error_log y .well-known/ quedan intactos. Es deliberado:
// borrar todo seria mas simple pero podria destruir archivos del servidor que
// no vienen del repo (ver inventario-produccion.js).
//
// Proteccion: sin DEPLOY_CONFIRM=SI en .env, este script no sube nada.

const { Client } = require('basic-ftp');
const { leerConfigDeploy } = require('./deploy-config');
const { readdirSync, statSync, createReadStream, existsSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const siteRoot = path.join(projectRoot, '_site');

// Lo que jamas se toca: no viene del build, y el deploy no debe pisarlo.
const PRESERVAR = new Set(['web_vieja', 'error_log', '.well-known', '.ftpquota']);

function listarLocales(dir, acc = [], profundidad = 0) {
  if (profundidad > 10) return acc;
  for (const nombre of readdirSync(dir)) {
    const completo = path.join(dir, nombre);
    const info = statSync(completo);
    if (info.isDirectory()) {
      listarLocales(completo, acc, profundidad + 1);
    } else {
      acc.push({ local: completo, relativa: path.relative(siteRoot, completo).split(path.sep).join('/'), size: info.size });
    }
  }
  return acc;
}

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

async function main() {
  const { host, user, pass, port, protocol, dir, confirm, checkUrl } = leerConfigDeploy();

  if (!existsSync(siteRoot)) {
    throw new Error(`No existe ${siteRoot}. Corré "npm run build" primero.`);
  }

  const archivos = listarLocales(siteRoot);
  const bytes = archivos.reduce((s, a) => s + a.size, 0);

  console.log('=== Deploy a produccion ===');
  console.log(`Servidor:  ${host}:${port}`);
  console.log(`Destino:   ${dir}  (ya parado en public_html)`);
  console.log(`Archivos:  ${archivos.length}  (${mb(bytes)} MB)`);
  console.log(`Se conservan sin tocar: ${[...PRESERVAR].join(', ')}`);
  console.log('');

  if (!confirm) {
    console.log('*** DEPLOY DETENIDO ***');
    console.log('DEPLOY_CONFIRM esta en NO en el .env.');
    console.log('No se subio nada. Ponelo en SI cuando quieras autorizar la subida.');
    console.log('');
    console.log('Para autorizarlo:');
    console.log('  poné DEPLOY_CONFIRM=SI en .env  y volvé a correr este script');
    return;
  }

  console.log('DEPLOY_CONFIRM=SI: subiendo.');
  console.log('');

  const client = new Client();
  client.ftp.timeout = 120000;

  const folders = [];
  for (const archivo of archivos) {
    const carpeta = path.posix.dirname(archivo.relativa);
    if (carpeta !== '.' && !folders.includes(carpeta)) folders.push(carpeta);
  }
  folders.sort((a, b) => a.split('/').length - b.split('/').length);

  try {
    await client.access({ host, user, password: pass, port, secure: protocol === 'sftp' });
    console.log('CONEXION OK');

    // Crear carpetas antes de subir, para no fallar a mitad de camino.
    for (const carpeta of folders) {
      const partes = carpeta.split('/');
      let actual = '';
      for (const parte of partes) {
        actual += '/' + parte;
        try {
          await client.ensureDir(actual);
        } catch { /* ya existe */ }
        await client.cd(actual);
      }
    }
    await client.cd('/');
    console.log(`Carpetas listas: ${folders.length}`);
    console.log('');

    let subidos = 0;
    let subidosBytes = 0;
    let ultimoLog = Date.now();

    for (const archivo of archivos) {
      // Defensa extra: nunca tocar las carpetas reservadas.
      const primero = archivo.relativa.split('/')[0];
      if (PRESERVAR.has(primero)) continue;

      await client.uploadFrom(createReadStream(archivo.local), archivo.relativa);
      subidos += 1;
      subidosBytes += archivo.size;

      if (Date.now() - ultimoLog > 5000) {
        ultimoLog = Date.now();
        const pct = ((subidos / archivos.length) * 100).toFixed(0);
        console.log(`  ${subidos}/${archivos.length} (${pct}%)  ${mb(subidosBytes)} MB`);
      }
    }

    console.log('');
    console.log(`SUBIDA COMPLETA: ${subidos} archivos, ${mb(subidosBytes)} MB`);
    console.log(`Sitio: ${checkUrl}`);
  } catch (error) {
    console.error('');
    console.error('FALLO LA SUBIDA:', error.message);
    console.error('El servidor quedo con una mezcla de archivos viejos y nuevos.');
    console.error('Se puede volver atras con el backup local en tmp/backup-produccion-*.');
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
});