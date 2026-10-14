// Prueba de conexion al hosting.
//
// SOLO LEE. No sube, no borra, no escribe nada en el servidor.
// Sirve para verificar host/usuario/password y ver que hay hoy en el
// document root antes de pisarlo con el deploy.

const { Client } = require('basic-ftp');
const { leerConfigDeploy } = require('./deploy-config');

async function main() {
  const { host, user, pass, port, protocol, dir } = leerConfigDeploy();

  console.log('=== Prueba de conexion (solo lectura) ===');
  console.log(`Protocolo: ${protocol}`);
  console.log(`Servidor:  ${host}:${port}`);
  console.log(`Usuario:   ${user}`);
  console.log(`Destino:   ${dir}`);
  console.log('');

  const client = new Client();
  // 20s es suficiente; si el servidor esta lento, mejor fallar que colgar.
  client.ftp.timeout = 20000;

  try {
    await client.access({
      host,
      user,
      password: pass,
      port,
      secure: protocol === 'sftp',
    });
    console.log('CONEXION OK');

    const raiz = await client.list('/');
    console.log(`\n--- Contenido de / (${raiz.length} entradas) ---`);
    for (const item of raiz.slice(0, 40)) {
      console.log(`  ${item.isDirectory ? '[DIR ]' : '[FILE]'} ${item.name}`);
    }

    // El destino es lo que de verdad importa.
    const destino = dir.replace(/\/+$/, '');
    try {
      const contenido = await client.list(destino);
      console.log(`\n--- Contenido de ${destino} (${contenido.length} entradas) ---`);
      for (const item of contenido.slice(0, 40)) {
        console.log(`  ${item.isDirectory ? '[DIR ]' : '[FILE]'} ${item.name}`);
      }
    } catch (error) {
      console.log(`\nNo pude listar ${destino}: ${error.message}`);
      console.log('Revisar DEPLOY_DIR: puede ser otra ruta, o puede no existir todavia.');
    }
  } catch (error) {
    console.error('\nFALLO LA CONEXION:', error.message);
    if (/530|login|authentic/i.test(error.message)) {
      console.error('Casi seguro es usuario o contrasena. Revisar DEPLOY_USER / DEPLOY_PASS.');
    }
    if (/ENOTFOUND|getaddrinfo|ECONNREFUSED|ETIMEDOUT/i.test(error.message)) {
      console.error('Problema de red o servidor: revisar DEPLOY_HOST y DEPLOY_PORT.');
    }
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();