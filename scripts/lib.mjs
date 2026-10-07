import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PACKS = join(ROOT, 'packs');

export const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Lista as pastas de packs. `_template` só entra se includeTemplate. */
export function packDirs({ includeTemplate = false } = {}) {
  return readdirSync(PACKS)
    .filter((d) => statSync(join(PACKS, d)).isDirectory())
    .filter((d) => includeTemplate || !d.startsWith('_'))
    .sort()
    .map((d) => join(PACKS, d));
}

export const exists = existsSync;
