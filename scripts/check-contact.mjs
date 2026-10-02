import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const expectedDisplay = '+54 9 3743 48-5849';
const expectedWhatsapp = '5493743485849';
const oldValues = ['+54 9 3743 47-1089', '5493743471089'];
const scannedRoots = ['src', 'MANUAL_MARCA_FORESTAL_GARUHAPE.md', '_site'];

function listFiles(path) {
  const absolutePath = join(root, path);
  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    return [absolutePath];
  }

  return readdirSync(absolutePath).flatMap((entry) => listFiles(join(path, entry)));
}

const files = scannedRoots.flatMap(listFiles);
const byFile = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]));
const allText = [...byFile.values()].join('\n');

const failures = [];

if (!allText.includes(expectedDisplay)) {
  failures.push(`Missing official phone display: ${expectedDisplay}`);
}

if (!allText.includes(expectedWhatsapp)) {
  failures.push(`Missing official WhatsApp link phone: ${expectedWhatsapp}`);
}

for (const oldValue of oldValues) {
  const matches = [...byFile.entries()]
    .filter(([, contents]) => contents.includes(oldValue))
    .map(([file]) => file.replace(`${root}\\`, ''));

  if (matches.length > 0) {
    failures.push(`Old contact value still present (${oldValue}): ${matches.join(', ')}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Official WhatsApp contact is consistent.');
