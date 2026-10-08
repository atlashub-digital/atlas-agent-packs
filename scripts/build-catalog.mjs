// Gera dist/catalog.json: o único ficheiro que o app.atlashub.si precisa de ler.
// Inclui só packs que o simulador pode mostrar (demo, pilot, ga), com cenários embutidos.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ROOT, readJson, packDirs } from './lib.mjs';

const pkg = readJson(join(ROOT, 'package.json'));
const VISIBLE = ['demo', 'pilot', 'ga'];

const packs = [];
for (const dir of packDirs()) {
  const p = readJson(join(dir, 'pack.json'));
  if (!VISIBLE.includes(p.status)) continue;
  packs.push({
    id: p.id,
    slug: p.slug,
    version: p.version,
    status: p.status,
    name: p.name,
    summary: p.summary,
    locale: p.locale,
    segments: p.segments,
    equation: p.equation,
    channels: p.channels,
    commercial: p.commercial ?? { cloud: true, onsite: true },
    steps: p.steps,
    guardrails: (p.guardrails ?? []).map(({ id, rule, action }) => ({ id, rule, action })),
    integrations: (p.integrations ?? []).map(({ id, kind, required, description }) => ({ id, kind, required, description })),
    // Tool contract summary (no bindings or secrets): lets the app show what requires human approval.
    tools: (p.tools ?? []).map(({ id, description, policy }) => ({ id, description, policy: policy ?? 'auto' })),
    metrics: p.metrics,
    clara: p.clara,
    labels: p.demo.labels,
    scenarios: p.demo.scenarios.map((rel) => readJson(join(dir, rel))),
    source: `packs/${basename(dir)}`
  });
}

const catalog = { catalogVersion: pkg.version, schemaVersion: 1, packs };
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
console.log(`✓ dist/catalog.json · ${packs.length} pack(s) · v${pkg.version}`);
