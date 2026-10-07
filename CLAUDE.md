# CLAUDE.md — atlas-agent-packs

Packs de agentes da AtlasHub.SI: cada pack (`packs/<slug>/pack.json` + skills, workflows, demo, testes) corre em demo no simulador do App.AtlasHub.Si e em produção (Hermes + n8n) a partir do mesmo manifesto. Detalhe: `README.md`, `docs/PACK-SPEC.md`.

## Comandos
Node ≥ 20, sem dependências npm (não adicionar nenhuma).

- `npm run check` — validate + test + build. Correr antes de qualquer commit.
- `npm run validate` — valida todos os packs (passos, tools, mocks, fórmulas, cenários, segredos).
- `npm test` — testes do avaliador de métricas.
- `npm run build` — gera `dist/catalog.json` (só packs em `demo`, `pilot`, `ga`).
- `npm run new -- <slug> "<Nome>"` — cria um pack a partir do template.

## Regras de ouro
1. Nunca segredos (chaves, tokens, exportações n8n com credenciais).
2. Nunca dados reais de clientes, pacientes ou leads. Fixtures sempre fictícias.
3. Métricas são hipóteses, sempre com `disclaimer`. Nada de resultados garantidos.
4. Guardrails só se apertam, nunca se aliviam.
5. Repositórios públicos (n8n, Hermes, OpenClaw) são inspiração, nunca importação (ver `docs/SECURITY.md`).
6. Um pack não depende do app. O app lê os packs, nunca o contrário.
7. Versionar sempre: subir `version`, `CHANGELOG.md` do pack e do repositório.

## O que não mexer
- `packs/_template/` não se edita à mão (é a base do `npm run new`).
- `dist/` é gerado e está no `.gitignore`; não commitar.
- `lib/metrics.mjs` tem um port em `App.AtlasHub.Si/src/lib/metrics.ts`. Têm de se comportar de forma idêntica: se mudar um, mudar o outro e manter os testes do PACK-001 iguais nos dois repositórios.
- Mudanças de estado para `pilot`/`ga` exigem aceitação da Helena (`docs/LIFECYCLE.md`); não mudar `status` por iniciativa própria.
- Manifestos em JSON, não YAML (decisão: zero dependências).
