// Valida todos os packs. Falha (exit 1) se houver erros. Sem dependências.
import { join, basename } from 'node:path';
import { readFileSync } from 'node:fs';
import { readJson, packDirs, exists } from './lib.mjs';
import { parse, identifiers } from '../lib/metrics.mjs';

const ENUMS = {
  status: ['idea', 'draft', 'demo', 'pilot', 'ga', 'retired'],
  equation: ['receita', 'custos', 'velocidade', 'controlo'],
  eventType: ['system', 'agent', 'patient', 'customer', 'staff'],
  humanReview: ['skip', 'required', 'optional']
};
const REQUIRED = ['schemaVersion', 'id', 'slug', 'version', 'status', 'name', 'summary', 'locale', 'owner', 'segments', 'equation', 'channels', 'steps', 'runtime', 'tools', 'metrics', 'demo', 'tests'];
// Só packs nestes estados aparecem no simulador; exigem cenários e mocks completos.
const DEMOABLE = ['demo', 'pilot', 'ga'];
const SECRET = /(sk-[A-Za-z0-9]{16,}|api[_-]?key\s*[:=]\s*["'][^"']{8,}|password\s*[:=]\s*["'][^"']+|Bearer\s+[A-Za-z0-9._-]{20,})/i;

const errors = [];
const seenIds = new Map();

for (const dir of packDirs({ includeTemplate: true })) {
  const name = basename(dir);
  const isTemplate = name.startsWith('_');
  const err = (m) => errors.push(`[${name}] ${m}`);
  const file = (rel) => join(dir, rel);

  if (!exists(file('pack.json'))) { err('falta pack.json'); continue; }
  let p;
  try { p = readJson(file('pack.json')); } catch (e) { err(`pack.json inválido: ${e.message}`); continue; }

  for (const k of REQUIRED) if (p[k] === undefined) err(`campo obrigatório em falta: ${k}`);
  if (p.schemaVersion !== 1) err('schemaVersion tem de ser 1');
  if (!/^PACK-\d{3}$/.test(p.id ?? '')) err(`id inválido: ${p.id}`);
  if (!isTemplate) {
    if (p.id === 'PACK-000') err('PACK-000 está reservado ao template');
    if (seenIds.has(p.id)) err(`id duplicado com ${seenIds.get(p.id)}`);
    seenIds.set(p.id, name);
    if (p.slug !== name) err(`slug "${p.slug}" tem de ser igual ao nome da pasta`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(p.version ?? '')) err(`version não é semver: ${p.version}`);
  if (!ENUMS.status.includes(p.status)) err(`status inválido: ${p.status}`);
  for (const e of p.equation ?? []) if (!ENUMS.equation.includes(e)) err(`equation inválida: ${e}`);

  const stepIds = new Set((p.steps ?? []).map((s) => s.id));
  if (stepIds.size !== (p.steps ?? []).length) err('ids de steps repetidos');

  for (const rel of [...(p.runtime?.skills ?? []), ...(p.runtime?.workflows ?? []), p.tests, p.demo?.fixtures, p.demo?.mocks, ...(p.demo?.scenarios ?? [])]) {
    if (rel && !exists(file(rel))) err(`ficheiro referido não existe: ${rel}`);
  }

  // Ferramentas: cada uma tem mock em demo e webhook em produção.
  const toolIds = new Set();
  const mocks = exists(file(p.demo?.mocks ?? '')) ? readJson(file(p.demo.mocks)) : {};
  for (const t of p.tools ?? []) {
    if (toolIds.has(t.id)) err(`ferramenta repetida: ${t.id}`);
    toolIds.add(t.id);
    if (!/^n8n:\/webhook\//.test(t.binding?.prod ?? '')) err(`${t.id}: binding.prod tem de ser n8n:/webhook/...`);
    if (t.binding?.demo !== `mock:${t.id}`) err(`${t.id}: binding.demo tem de ser mock:${t.id}`);
    if (!(t.id in mocks)) err(`${t.id}: falta mock em ${p.demo?.mocks}`);
  }

  const guardIds = new Set((p.guardrails ?? []).map((g) => g.id));

  // Métricas: fórmulas válidas e só com inputs/outputs anteriores.
  const known = new Set((p.metrics?.inputs ?? []).map((i) => i.key));
  for (const i of p.metrics?.inputs ?? []) {
    if (typeof i.default !== 'number') err(`métrica ${i.key}: default tem de ser número`);
    if (i.min !== undefined && i.default < i.min) err(`métrica ${i.key}: default abaixo do min`);
    if (i.max !== undefined && i.default > i.max) err(`métrica ${i.key}: default acima do max`);
  }
  for (const o of p.metrics?.outputs ?? []) {
    try {
      for (const id of identifiers(parse(o.formula))) if (!known.has(id)) err(`métrica ${o.key}: usa "${id}" antes de existir`);
    } catch (e) { err(`métrica ${o.key}: ${e.message}`); }
    known.add(o.key);
  }

  // Cenários: passos e ferramentas existentes, ordem dos passos não recua.
  const order = (p.steps ?? []).map((s) => s.id);
  const scenarioIds = new Set();
  for (const rel of p.demo?.scenarios ?? []) {
    if (!exists(file(rel))) continue;
    let sc;
    try { sc = readJson(file(rel)); } catch (e) { err(`${rel}: JSON inválido`); continue; }
    if (scenarioIds.has(sc.id)) err(`${rel}: id de cenário repetido`);
    scenarioIds.add(sc.id);
    if (!ENUMS.humanReview.includes(sc.humanReview)) err(`${rel}: humanReview inválido`);
    let last = -1;
    for (const [n, ev] of (sc.events ?? []).entries()) {
      if (!ENUMS.eventType.includes(ev.type)) err(`${rel}#${n}: type inválido ${ev.type}`);
      if (!stepIds.has(ev.step)) err(`${rel}#${n}: step desconhecido ${ev.step}`);
      if (order.indexOf(ev.step) < last) err(`${rel}#${n}: o passo recua (${ev.step})`);
      last = Math.max(last, order.indexOf(ev.step));
      if (ev.tool && !toolIds.has(ev.tool)) err(`${rel}#${n}: ferramenta desconhecida ${ev.tool}`);
      if (ev.guardrail && !guardIds.has(ev.guardrail)) err(`${rel}#${n}: guardrail desconhecido ${ev.guardrail}`);
    }
  }
  if (DEMOABLE.includes(p.status) && scenarioIds.size === 0) err('packs em demo/pilot/ga precisam de pelo menos 1 cenário');
  if (DEMOABLE.includes(p.status)) {
    if (!Array.isArray(p.clara?.intro) || p.clara.intro.length === 0) err('packs em demo/pilot/ga precisam de clara.intro (o que a Clara diz ao abrir)');
    for (const k of ['header', 'agent', 'customer']) if (!p.demo?.labels?.[k]) err(`packs em demo/pilot/ga precisam de demo.labels.${k}`);
  }
  if (DEMOABLE.includes(p.status) && /\[[^\]]+\]/.test(p.name + p.summary)) err('nome/resumo ainda têm placeholders');

  // Segredos: nada que pareça uma chave entra no repositório.
  for (const rel of [p.demo?.fixtures, p.demo?.mocks, ...(p.runtime?.skills ?? []), ...(p.runtime?.workflows ?? [])]) {
    if (rel && exists(file(rel)) && SECRET.test(readFileSync(file(rel), 'utf8'))) err(`${rel}: parece conter um segredo`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} erro(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${packDirs().length} pack(s) válido(s) + template`);
