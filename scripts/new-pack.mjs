// Cria um pack novo a partir do template: npm run new -- <slug> "<Nome>"
import { cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PACKS, readJson, packDirs } from './lib.mjs';

const [slug, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(' ');
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !name) {
  console.error('Uso: npm run new -- <slug-em-kebab-case> "<Nome do pack>"');
  process.exit(1);
}
const target = join(PACKS, slug);
if (existsSync(target)) { console.error(`Já existe: packs/${slug}`); process.exit(1); }

const used = packDirs().map((d) => Number(readJson(join(d, 'pack.json')).id.slice(5)));
const id = 'PACK-' + String(Math.max(0, ...used) + 1).padStart(3, '0');

cpSync(join(PACKS, '_template'), target, { recursive: true });
const manifestPath = join(target, 'pack.json');
const p = readJson(manifestPath);
Object.assign(p, { id, slug, name, version: '0.1.0', status: 'idea' });
const lower = id.toLowerCase();
p.tools = p.tools.map((t) => ({ ...t, binding: { ...t.binding, prod: t.binding.prod.replace('pack-000', lower) } }));
writeFileSync(manifestPath, JSON.stringify(p, null, 2) + '\n');
for (const f of ['README.md', 'workflows/README.md']) {
  const fp = join(target, f);
  writeFileSync(fp, readFileSync(fp, 'utf8').replaceAll('PACK-000', id).replaceAll('pack-000', lower).replace('Template', name));
}
console.log(`✓ packs/${slug} criado como ${id} (status: idea). Próximo: preencher pack.json e correr npm run validate.`);
