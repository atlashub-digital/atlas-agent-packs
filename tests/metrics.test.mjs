import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateMetrics, parse } from '../lib/metrics.mjs';

const pack = JSON.parse(readFileSync(new URL('../packs/clinic-appointment-confirmation/pack.json', import.meta.url)));

test('PACK-001 com os valores de exemplo', () => {
  const r = evaluateMetrics(pack.metrics);
  assert.equal(r.no_shows, 96);
  assert.equal(r.recovered_appointments, 29);
  assert.equal(r.recovered_revenue, 5800);
  assert.equal(r.manual_hours, 40);
});

test('inputs do lead substituem os defaults e respeitam min/max', () => {
  const r = evaluateMetrics(pack.metrics, { appointments_per_month: 1000, no_show_rate: 500 });
  assert.equal(r.no_show_rate, 60);
  assert.equal(r.no_shows, 600);
});

test('o avaliador recusa código', () => {
  assert.throws(() => parse('process.exit(1)'));
  assert.throws(() => parse('a; b'));
  assert.throws(() => parse('foo(1)'));
});
