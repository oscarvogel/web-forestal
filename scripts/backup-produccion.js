// Backup local de los archivos actuales del sitio en produccion.
//
// SOLO LECTURA: descarga, no borra ni modifica nada en el servidor.
//
// Qué entra: todo el document root EXCEPTO web_vieja/, que no viene del
// repo y el deploy no lo toca. Ese exclusion es a proposito: backedear 3.229
// archivos de un WordPress ajeno tardaria mucho y no ayuda a volver atras.
//
// Qué sirve para: si el deploy nuevo rompe algo, se restaura esto y el sitio
// vuelve a como estaba.

const { Client } = require('basic-ftp');
const { leerConfigDeploy } = require('./deploy-config');
const { mkdirSync, existsSync, readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const EXCLUIR = new Set(['web_vieja', 'error_log']);

async function listar(client, ruta, acc, profundidad = 0) {
  if (profundidad > 6) return;
  const items = await client.list(ruta);
  for (const item of items) {
    const completa = ruta === '/' ? `/${item.name}` : `${ruta}/${item.name}`;
    if (item.isDirectory) {
      if (profundidad === 0 && EXCLUIR.has(item.name)) {
        acc.omitidas.push(item.name);
        continue;
      }
      await listar(client, completa, acc, profundidad + 1);
    } else {
      acc.archivos.push({ ruta: completa, size: item.size || 0 });
    }
  }
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

async function main() {
  const { host, user, pass, port, protocol, dir } = leerConfigDeploy();
  const destino = path.resolve(__dirname, '..', 'tmp', `backup-produccion-${timestamp()}`);
  mkdirSync(destino, { recursive: true });

  const client = new Client();
  client.ftp.timeout = 60000;

  try {
    await client.access({ host, user, password: pass, port, secure: protocol === 'sftp' });
    console.log('CONEXION OK\n');

    const acc = { archivos: [], omitidas: [] };
    await listar(client, dir.replace(/\/+$/, '') || '/', acc);

    console.log(`A respaldar: ${acc.archivos.length} archivos`);
    if (acc.omitidas.length) console.log(`Omitido: ${acc.omitidas.join(', ')}`);
    console.log(`Destino local: ${destino}\n`);

    // El error_log de la raiz son 17 KB: se copia aparte para poder leerlo.
    // El de web_vieja (118 MB) queda fuera, no se baja.
    try {
      await client.downloadTo(path.join(destino, 'error_log.raiz.txt'), '/error_log');
      console.log('error_log de la raiz descargado aparte');
    } catch {
      console.log('No hay error_log en la raiz (o no se pudo bajar)');
    }

    let hechos = 0;
    let bytes = 0;
    let ultimo = Date.now();
    for (const archivo of acc.archivos) {
      const relativo = archivo.ruta.replace(/^\//, '');
      const destinoArchivo = path.join(destino, relativo);
      mkdirSync(path.dirname(destinoArchivo), { recursive: true });
      try {
        await client.downloadTo(destinoArchivo, archivo.ruta);
        hechos += 1;
        bytes += archivo.size;
        if (Date.now() - ultimo > 5000) {
          ultimo = Date.now();
          console.log(`  ${hechos}/${acc.archivos.length}  (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
        }
      } catch (error) {
        console.log(`  NO SE PUDO BAJAR ${archivo.ruta}: ${error.message}`);
      }
    }

    console.log(`\nBACKUP COMPLETO: ${hechos} archivos, ${(bytes / 1024 / 1024).toFixed(1)} MB`);

    const manifiesto = {
      fecha: new Date().toISOString(),
      servidor: `${host}:${port}`,
      directorio: dir,
      archivos: hechos,
      bytes,
      omitidos: acc.omitidas,
      detalle: acc.archivos.map((a) => ({ ruta: a.ruta, size: a.size })),
    };
    const rutaManifiesto = path.join(destino, '_MANIFIESTO.json');
    writeFileSync(rutaManifiesto, `${JSON.stringify(manifiesto, null, 2)}\n`, 'utf8');
    console.log(`Manifiesto: ${rutaManifiesto}`);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();