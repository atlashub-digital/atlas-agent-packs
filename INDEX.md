# INDEX · atlas-agent-packs

Índice de tudo o que existe neste repositório e do **estado de integração** de cada peça.
Atualizar este ficheiro em cada PR que acrescente ou mude packs, scripts ou documentação.

**Versão do catálogo:** 0.3.1 · **Packs em `demo`+:** 8 · **Última atualização:** 2026-10-08

Legenda: ✅ integrado e testado · 🟡 integrado, sem verificação completa · ⬜ por fazer

---

## 1. Packs

| ID | Pack | Estado | No catálogo | No simulador (app) | Produção (n8n) |
|---|---|---|---|---|---|
| PACK-001 | [Confirmação de consultas](packs/clinic-appointment-confirmation/) | `demo` | ✅ | ✅ 3 cenários | ⬜ workflows por construir |
| PACK-002 | [Assistente Comercial](packs/sales-assistant/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-003 | [Secretária Administrativa](packs/administrative-secretary/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-004 | [Consultor Imobiliário Digital](packs/real-estate-consultant/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-005 | [Assistente E-commerce](packs/ecommerce-assistant/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-006 | [Assistente de Marketing](packs/marketing-assistant/) | `demo` | ✅ | ✅ 1 cenário | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-007 | [Assistente Financeiro Administrativo](packs/finance-assistant/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |
| PACK-008 | [Assistente de RH](packs/hr-assistant/) | `demo` | ✅ | ✅ 2 cenários | 🟡 contrato por tool; motor AI-WaaS em staging |

### PACK-001 · conteúdo

| Componente | Ficheiro | Estado |
|---|---|---|
| Manifesto | [`pack.json`](packs/clinic-appointment-confirmation/pack.json) | ✅ validado |
| Instruções do agente | [`skills/agent.md`](packs/clinic-appointment-confirmation/skills/agent.md) | ✅ |
| Limites | [`skills/guardrails.md`](packs/clinic-appointment-confirmation/skills/guardrails.md) | ✅ |
| Contrato dos 5 webhooks n8n | [`workflows/README.md`](packs/clinic-appointment-confirmation/workflows/README.md) | ⬜ só contrato |
| Fixtures (fictícias) | [`demo/fixtures/clinic.json`](packs/clinic-appointment-confirmation/demo/fixtures/clinic.json) | ✅ |
| Mocks das tools | [`demo/mocks.json`](packs/clinic-appointment-confirmation/demo/mocks.json) | ✅ 5 de 5 |
| Cenário 1 · Paciente confirma | [`demo/scenarios/01-confirm.json`](packs/clinic-appointment-confirmation/demo/scenarios/01-confirm.json) | ✅ |
| Cenário 2 · Paciente remarca | [`demo/scenarios/02-reschedule.json`](packs/clinic-appointment-confirmation/demo/scenarios/02-reschedule.json) | ✅ |
| Cenário 3 · Exceção clínica | [`demo/scenarios/03-clinical-exception.json`](packs/clinic-appointment-confirmation/demo/scenarios/03-clinical-exception.json) | ✅ |
| Casos de aceitação (A01–A08) | [`tests/acceptance.json`](packs/clinic-appointment-confirmation/tests/acceptance.json) | ⬜ definidos, ainda sem execução contra o agente real |
| README e changelog do pack | [`README.md`](packs/clinic-appointment-confirmation/README.md) · [`CHANGELOG.md`](packs/clinic-appointment-confirmation/CHANGELOG.md) | ✅ |

Resumo do PACK-001: 6 passos · 5 tools · 4 guardrails · 5 inputs e 4 outputs de métricas · 3 integrações (agenda, WhatsApp, lista de espera) · 3 cenários.

## 2. Código e ferramentas

| Peça | Ficheiro | O que faz | Estado |
|---|---|---|---|
| Avaliador de métricas | [`lib/metrics.mjs`](lib/metrics.mjs) | Fórmulas sem `eval`: números, variáveis, `+ - * / ( )`, `round/min/max` | ✅ 3 testes |
| Validador | [`scripts/validate.mjs`](scripts/validate.mjs) | Campos, estados, ids únicos, ficheiros referidos, tools↔mocks, fórmulas, cenários (passos que não recuam), Clara/labels, segredos | ✅ testado com casos inválidos |
| Gerador de catálogo | [`scripts/build-catalog.mjs`](scripts/build-catalog.mjs) | `dist/catalog.json` só com packs `demo`/`pilot`/`ga` | ✅ |
| Criador de packs | [`scripts/new-pack.mjs`](scripts/new-pack.mjs) | `npm run new -- <slug> "<Nome>"` a partir do template, com o próximo `PACK-NNN` | ✅ testado |
| Utilitários | [`scripts/lib.mjs`](scripts/lib.mjs) | Caminhos e leitura de packs | ✅ |
| Schema | [`schema/pack.schema.json`](schema/pack.schema.json) | Autocomplete no editor (a validação completa é do validador) | 🟡 não validado com um validador de JSON Schema |
| Testes | [`tests/metrics.test.mjs`](tests/metrics.test.mjs) | Valores do PACK-001, limites, recusa de código | ✅ |
| CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | validate · test · build | 🟡 por correr no GitHub |
| Template | [`packs/_template/`](packs/_template/) | Base de packs novos | ✅ |

## 3. Documentação

| Documento | Conteúdo |
|---|---|
| [`README.md`](README.md) | Visão geral, fluxo, conceitos, como criar um pack, regras de ouro, FAQ |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Cérebro/mãos/canais, demo vs. produção, multi-tenant, versionamento |
| [`docs/PACK-SPEC.md`](docs/PACK-SPEC.md) | Especificação campo a campo do `pack.json` e dos cenários |
| [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md) | Estados e critérios de passagem |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Segredos, LGPD, política para repositórios públicos |
| [`docs/APP-INTEGRATION.md`](docs/APP-INTEGRATION.md) | Consumo no app e tabelas do Supabase |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Próximos packs |
| [`docs/decisions/0001-estrutura-do-repositorio.md`](docs/decisions/0001-estrutura-do-repositorio.md) | ADR proposta (aceitação pela Helena, registo no atlas-ops) |
| [`CHANGELOG.md`](CHANGELOG.md) | Versões do catálogo |

## 4. Integração com outros repositórios

| Repositório | Relação | Estado |
|---|---|---|
| [`App.AtlasHub.Si`](https://github.com/atlashub-digital/App.AtlasHub.Si) | Consome `dist/catalog.json` (cópia em `src/data/catalog.json`, `npm run sync:catalog`). Simulador V0 genérico, testado em browser | ✅ catálogo v0.1.0 integrado · 🟡 build Next ainda por correr |
| `atlas-ops` | Fichas dos packs, ADR 0001 por aceitar, triagem dos repositórios públicos (Max) | ⬜ ADR por registar |
| `Atendimento.Center` | Canal WhatsApp/webchat e handoff em produção | ⬜ por ligar (pack `pilot`) |
| Supabase | `simulations` com `pack_id` + `pack_version` | ⬜ V1 do app |

## 5. Decisões registadas

1. **Repositório próprio** para os packs, separado da landing e do app (ADR 0001).
2. **Manifestos em JSON**, sem dependências, validados por script.
3. **Dois bindings por tool** (`mock:` e `n8n:`): o agente nunca vê credenciais; demo e produção usam o mesmo pack.
4. **O app consome uma cópia versionada do catálogo** (o repositório é privado), com recusa por `schemaVersion`.
5. **O conteúdo da Clara pertence ao pack** (`clara`, `claraAfter`, `labels`), não ao app.
6. **Métricas sempre como hipótese**, com `disclaimer`; sem cases sem baseline e autorização.

## 6. Em aberto

- Idioma: interface em PT-PT ou PT-BR? (as mensagens do agente seguem o `locale` do pack; o PACK-001 está em `pt-BR`)
- Workflows n8n do PACK-001 (1 sistema de agenda) e execução dos casos A01–A08 com o Hermes.
- Aceitação do ADR 0001 pela Helena e registo no atlas-ops.
- Preços fixos das modalidades (Cloud e presencial): o app mostra "definido no AI Business Assessment" até lá.
