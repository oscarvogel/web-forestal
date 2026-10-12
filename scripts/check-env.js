// Verifica que campos del .env estan completos, sin mostrar la password.
const fs = require('node:fs');
const path = require('node:path');

const envPath = path.resolve(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('NO EXISTE .env');
  process.exit(0);
}

const texto = fs.readFileSync(envPath, 'utf8');
const claves = ['DEPLOY_HOST', 'DEPLOY_USER', 'DEPLOY_PASS', 'DEPLOY_PORT', 'DEPLOY_PROTOCOL', 'DEPLOY_DIR', 'DEPLOY_CONFIRM'];

for (const clave of claves) {
  const match = texto.match(new RegExp('^' + clave + '=(.*)$', 'm'));
  let valor = match ? match[1].trim() : '';
  if ((valor.startsWith("'") && valor.endsWith("'")) || (valor.startsWith('"') && valor.endsWith('"'))) {
    valor = valor.slice(1, -1);
  }
  if (clave === 'DEPLOY_PASS' && valor) {
    console.log('LISTO  ' + clave + '  (oculta, ' + valor.length + ' caracteres)');
  } else {
    console.log((valor ? 'LISTO  ' : 'VACIO  ') + clave + (valor ? '  = ' + valor : ''));
  }
}