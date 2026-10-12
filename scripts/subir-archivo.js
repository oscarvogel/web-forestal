// Sube un archivo suelto del build a produccion.
//
// ParaArrancar sin rehacer las 143 MB cuando hay que corregir una sola cosa.
//
// Uso: node scripts/subir-archivo.js enviar_mensaje.php

const { Client } = require('basic-ftp');
const { leerConfigDeploy } = require('./deploy-config');
const { createReadStream, existsSync, statSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const siteRoot = path.join(projectRoot, '_site');

async function main() {
  const relativas = process.argv.slice(2);
  if (relativas.length === 0) {
    console.error('Uso: node scripts/subir-archivo.js <archivo.html> [mas...]');
    process.exitCode = 1;
    return;
  }

  const { host, user, pass, port, protocol, dir, confirm } = leerConfigDeploy();

  console.log('=== Subiendo archivos individuales ===');
  console.log(`Servidor: ${host}:${port}`);
  console.log(`Destino:  ${dir}`);
  console.log('');

  if (!confirm) {
    console.log('*** DETENIDO: DEPLOY_CONFIRM esta en NO en el .env ***');
    console.log('No se subio nada.');
    return;
  }

  const pendientes = [];
  for (const relativa of relativas) {
    const local = path.join(siteRoot, relativa);
    if (!existsSync(local)) {
      console.log(`  NO EXISTE en _site: ${relativa}`);
      console.log('    (correr "npm run build" antes)');
      process.exitCode = 1;
      return;
    }
    pendientes.push({ local, relativa, size: statSync(local).size });
  }

  console.log('A subir:');
  for (const a of pendientes) {
    console.log(`  ${a.relativa}  (${(a.size / 1024).toFixed(1)} KB)`);
  }
  console.log('');

  const client = new Client();
  client.ftp.timeout = 60000;

  try {
    await client.access({ host, user, password: pass, port, secure: protocol === 'sftp' });
    console.log('CONEXION OK');

    for (const archivo of pendientes) {
      const carpeta = path.posix.dirname(archivo.relativa);
      if (carpeta !== '.') {
        await client.ensureDir(carpeta);
      }
      await client.uploadFrom(createReadStream(archivo.local), archivo.relativa);
      console.log(`  subido: ${archivo.relativa}`);
    }

    console.log('');
    console.log(`LISTO: ${pendientes.length} archivo(s) en produccion`);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();