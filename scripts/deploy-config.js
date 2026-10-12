// Carga las variables de despliegue desde .env.
//
// Existe para que las credenciales vivan en un archivo y no en el codigo ni
// en el historial de git. El .env esta en .gitignore; este archivo solo lo lee.
//
// Uso:
//   const { leerConfigDeploy } = require('./deploy-config');
//   const config = leerConfigDeploy();

const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

function parseEnv(contenido) {
  const valores = {};
  for (const linea of contenido.split(/\r?\n/)) {
    const sinComentario = linea.replace(/#.*$/, '');
    const match = sinComentario.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const clave = match[1];
    let valor = match[2];
    if ((valor.startsWith("'") && valor.endsWith("'") && valor.length > 1)
      || (valor.startsWith('"') && valor.endsWith('"') && valor.length > 1)) {
      valor = valor.slice(1, -1);
    }
    valores[clave] = valor;
  }
  return valores;
}

// Devuelve la config de deploy. Falla con un mensaje util si falta algo,
// en lugar de subir medio sitio y romper produccion.
function leerConfigDeploy() {
  if (!existsSync(envPath)) {
    throw new Error(
      `No existe ${envPath}.\n`
      + 'Copiá .env.example a .env y completalo con los datos del hosting.',
    );
  }

  const env = parseEnv(readFileSync(envPath, 'utf8'));
  const faltantes = [];
  const pedir = (clave) => {
    const valor = (env[clave] ?? '').trim();
    if (!valor) faltantes.push(clave);
    return valor;
  };

  const config = {
    host: pedir('DEPLOY_HOST'),
    user: pedir('DEPLOY_USER'),
    pass: pedir('DEPLOY_PASS'),
    port: Number(pedir('DEPLOY_PORT')) || 21,
    protocol: (env.DEPLOY_PROTOCOL || 'ftp').trim().toLowerCase(),
    dir: (env.DEPLOY_DIR || '/public_html/').trim(),
    confirm: (env.DEPLOY_CONFIRM || 'NO').trim().toUpperCase() === 'SI',
    checkUrl: (env.DEPLOY_CHECK_URL || 'https://forestalgaruhape.com.ar').trim(),
    verifyCount: Number(env.DEPLOY_VERIFY_COUNT ?? 30) || 0,
  };

  if (faltantes.length > 0) {
    throw new Error(
      `Faltan datos en .env: ${faltantes.join(', ')}.\n`
      + 'Completalos en .env antes de seguir.',
    );
  }

  if (config.protocol !== 'ftp' && config.protocol !== 'sftp') {
    throw new Error(`DEPLOY_PROTOCOL inválido: "${config.protocol}". Usá "ftp" o "sftp".`);
  }

  return config;
}

module.exports = { leerConfigDeploy, envPath, projectRoot };