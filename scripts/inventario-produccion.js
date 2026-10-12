// Inventario de lo que hay hoy en produccion.
//
// SOLO LEE. Sirve para comparar contra el build nuevo antes de tocar nada:
// la idea es saber que archivos se van a reemplazar y si hay algo en el
// servidor que no venga del repo (un .env, un .well-known, un cert).

const { Client } = require('basic-ftp');
const { leerConfigDeploy } = require('./deploy-config');

async function listarTodo(client, ruta, acc, profundidad = 0) {
  if (profundidad > 6) return;
  const items = await client.list(ruta);
  for (const item of items) {
    const rutaCompleta = ruta === '/' ? `/${item.name}` : `${ruta}/${item.name}`;
    if (item.isDirectory) {
      await listarTodo(client, rutaCompleta, acc, profundidad + 1);
    } else {
      acc.push({ ruta: rutaCompleta, size: item.size });
    }
  }
}

async function main() {
  const { host, user, pass, port, protocol, dir } = leerConfigDeploy();
  const client = new Client();
  client.ftp.timeout = 30000;

  try {
    await client.access({ host, user, password: pass, port, secure: protocol === 'sftp' });
    console.log('CONEXION OK');

    const archivos = [];
    await listarTodo(client, dir.replace(/\/+$/, '') || '/', archivos);

    const total = archivos.reduce((suma, a) => suma + (a.size || 0), 0);
    console.log(`\nEn produccion hay ${archivos.length} archivos, ${(total / 1024 / 1024).toFixed(1)} MB`);
    console.log('\n--- Primer nivel (conteo por directorio) ---');

    const porCarpeta = {};
    for (const a of archivos) {
      const relativo = a.ruta.replace(/^\//, '');
      const carpeta = relativo.includes('/') ? relativo.split('/')[0] : '(raiz)';
      if (!porCarpeta[carpeta]) porCarpeta[carpeta] = { archivos: 0, bytes: 0 };
      porCarpeta[carpeta].archivos += 1;
      porCarpeta[carpeta].bytes += a.size || 0;
    }
    for (const [carpeta, info] of Object.entries(porCarpeta).sort()) {
      console.log(`  ${carpeta.padEnd(20)} ${String(info.archivos).padStart(5)} archivos  ${(info.bytes / 1024).toFixed(0).padStart(8)} KB`);
    }

    // Lo que no deberia estar en un sitio estatico y hay que preservar.
    console.log('\n--- Archivos sensibles o a revisar ---');
    const sospechosos = archivos.filter((a) => /\.env|\.git|htpasswd|\.pem$|id_rsa|\.key$|error_log|\.sql$|\.bak$/i.test(a.ruta));
    if (sospechosos.length === 0) {
      console.log('  (ninguno)');
    } else {
      for (const a of sospechosos) console.log(`  ${a.ruta}  (${(a.size / 1024).toFixed(0)} KB)`);
    }
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();