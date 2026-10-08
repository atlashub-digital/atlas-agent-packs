# 0.3.0 — 2026-10-08
- Os 8 colaboradores digitais em `demo`: PACK-004 a PACK-008 novos; PACK-002 e PACK-003 passam a 0.2.0.
- Cada ferramenta declara `policy` (`auto` ou `approval`); ações proibidas ficam fora do manifesto e são listadas nos guardrails.
- Manifestos, ferramentas e cenários gerados a partir do registo de roles do AtlasHub-AI-WaaS (fonte executável), com os mesmos limites testados em `tests/roles.e2e.mjs`.
- `tests/demo-packs.test.mjs`: o teste do Round 1 (002/003 só com `team.handoff`) foi substituído por uma verificação mais forte em todos os packs: política por ferramenta, aprovação obrigatória em ações de envio ou compromisso, nenhuma ferramenta proibida.

# 0.2.0 — Round 1

PACK-002 Assistente Comercial e PACK-003 Secretária Administrativa em demo com dados fictícios, handoff obrigatório e sem integrações ativas. PACK-001 preservado.

# Changelog

Formato: [SemVer](https://semver.org). A versão do repositório é a versão do catálogo que o app consome.

## 0.1.0 — 2026-10-07
- Estrutura inicial: schema, validador, gerador de catálogo, avaliador de métricas.
- PACK-001 · Confirmação de consultas (estado `demo`) com 3 cenários.
- Template `packs/_template`.
- Conteúdo da Clara (`clara`, `claraAfter`) e textos do chat (`demo.labels`) passam a viver no pack; o validador exige-os em `demo`/`pilot`/`ga`.
- `README.md` principal reescrito e `INDEX.md` adicionado.
