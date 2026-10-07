# atlas-agent-packs

**Os agentes e automações reutilizáveis da AtlasHub.SI, prontos a plugar.**
Cada *pack* resolve uma dor concreta de um negócio, corre em **modo demo** no simulador do [app.atlashub.si](https://github.com/atlashub-digital/App.AtlasHub.Si) e corre em **produção** num cliente (Cloud ou presencial), a partir do **mesmo manifesto**.

> Um pack, duas utilizações: o lead testa exatamente o que depois é instalado. Muda só a ligação das ferramentas: mocks na demo, n8n e sistemas reais em produção.

📇 Lista de tudo o que está neste repositório e do que já está integrado no app: [`INDEX.md`](INDEX.md).

---

## 1. Em 30 segundos

| Pergunta | Resposta |
|---|---|
| O que é um pack? | Uma pasta com um `pack.json` (manifesto) + instruções do agente + workflows + dados e cenários de demo + testes |
| Quem o usa? | O **app** (simulador para leads), o **Hermes** (cérebro do agente) e o **n8n** (integrações em produção) |
| Como entra no app? | `npm run build` gera `dist/catalog.json`; o app copia-o (`npm run sync:catalog`) |
| Como se cria um novo? | `npm run new -- <slug> "<Nome>"`, preencher, `npm run check` |
| O que impede erros? | `npm run validate`: passos, ferramentas, mocks, fórmulas, cenários e segredos |
| Onde está o código do simulador? | No repositório [`App.AtlasHub.Si`](https://github.com/atlashub-digital/App.AtlasHub.Si) |

## 2. O fluxo ponta a ponta

```
                    ┌──────────────────────────── atlas-agent-packs ───────────────────────────┐
                    │  packs/<slug>/pack.json  ──validate──►  npm run build  ──►  dist/catalog.json │
                    └───────────────────────────────────────────────────────────┬───────────────┘
                                                                                 │ npm run sync:catalog
   Lead ──► Clara ──► app.atlashub.si ──► Simulador (cenários, métricas, limites)◄┘   (cópia versionada no app)
                              │
                              ▼  "quero isto no meu negócio"
                       AI Business Assessment
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
       Cloud (nossa infra)            Presencial (responsável de produto)
              │                                │
              └───────────────┬────────────────┘
                              ▼
         Produção: Hermes (skills do pack) ──tool──► n8n (webhook do tenant) ──► agenda, CRM, WhatsApp…
```

## 3. Conceitos

| Conceito | O que é |
|---|---|
| **Pack** | Unidade de produto: uma dor, um agente, as suas ferramentas, limites e métricas |
| **Step** | Passo do percurso da automação (gatilho → … → concluir). É a timeline do simulador |
| **Tool** | Ação que o agente pode executar (`agenda.find_slots`, `team.handoff`…), com contrato de entrada/saída |
| **Binding** | A ligação de uma tool: `mock:<tool>` na demo, `n8n:/webhook/…` em produção. **O agente nunca vê credenciais** |
| **Guardrail** | Limite do agente (ex.: não dar aconselhamento clínico) com ação `handoff`, `block` ou `log`. Os clientes podem apertar, nunca aliviar |
| **Cenário** | Guião de demo: lista de eventos (sistema, agente, cliente) que usa passos e tools do pack |
| **Métricas** | Inputs que o lead ajusta + fórmulas que calculam o impacto, sempre como **hipótese** |
| **Catálogo** | `dist/catalog.json`: o único ficheiro que o app lê. Só inclui packs em `demo`, `pilot` ou `ga` |
| **Estado** | `idea → draft → demo → pilot → ga → retired` (ver [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md)) |

## 4. Arquitetura em três camadas

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| **Cérebro** | Hermes (`skills/` do pack) | Interpretar, decidir dentro dos limites, chamar ferramentas |
| **Mãos** | n8n (um webhook por tool) | Falar com os sistemas do cliente. Guarda as credenciais |
| **Canais** | Atendimento.Center | WhatsApp, webchat e handoff para uma pessoa |

Detalhe e diagrama de demo vs. produção: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 5. Estrutura

```
atlas-agent-packs/
├── README.md · INDEX.md · CHANGELOG.md
├── packs/
│   ├── _template/                        base de packs novos (não editar à mão)
│   └── clinic-appointment-confirmation/  PACK-001
│       ├── pack.json        manifesto (passos, tools, config, limites, métricas, demo, clara)
│       ├── skills/          instruções do agente (Hermes)
│       ├── workflows/       contratos e exportações n8n (sem credenciais)
│       ├── demo/            fixtures · mocks · cenários (dados fictícios)
│       ├── tests/           casos de aceitação
│       ├── README.md · CHANGELOG.md
├── schema/pack.schema.json   autocomplete no editor
├── lib/metrics.mjs           avaliador seguro das fórmulas (sem eval), partilhado com o app
├── scripts/                  validate · build-catalog · new-pack
├── tests/                    testes do repositório
├── docs/                     arquitetura · especificação · ciclo de vida · segurança · integração · decisões
└── .github/workflows/ci.yml  validate · test · build em cada push/PR
```

## 6. Começar

Só Node ≥ 20. **Sem dependências npm.**

```bash
git clone git@github.com:atlashub-digital/atlas-agent-packs.git && cd atlas-agent-packs
npm run check        # validate + test + build → dist/catalog.json
```

| Comando | O que faz |
|---|---|
| `npm run validate` | Valida todos os packs (falha com `exit 1` se houver erros) |
| `npm test` | Testes do avaliador de métricas |
| `npm run build` | Gera `dist/catalog.json` |
| `npm run check` | Os três, por esta ordem |
| `npm run new -- <slug> "<Nome>"` | Cria `packs/<slug>/` a partir do template, com o próximo `PACK-NNN` |

## 7. Criar um pack novo, passo a passo

1. **`npm run new -- cobranca-lembretes "Cobrança e lembretes"`**: cria a pasta com `status: idea`.
2. **Preencher o `pack.json`**: passos, tools (cada uma com `binding.prod` e `binding.demo`), config por cliente, guardrails, métricas, integrações e `compliance`.
3. **Escrever `skills/agent.md` e `skills/guardrails.md`**. Valores por cliente usam `{{chave}}` de `config`.
4. **Demo**: fixtures fictícias, um mock por tool em `demo/mocks.json`, e cenários em `demo/scenarios/` (pelo menos um caso feliz e uma exceção). Preencher `demo.labels` e `clara` (o que a Clara diz).
5. **`status: demo`** e `npm run check`. O validador diz exatamente o que falta.
6. **Subir a versão** (`CHANGELOG.md` do pack e do repositório), fazer PR, tag (`v0.X.Y`).
7. **No app**: `npm run sync:catalog` → PR com o catálogo novo. Nenhum código de UI muda.

Critérios para passar de `demo` a `pilot` e `ga`: [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md).

## 8. Como o app consome os packs

O app lê só o catálogo (`passos`, `cenários`, `métricas`, `guardrails`, `clara`, `labels`, `commercial`). Hoje faz uma **cópia versionada** (`src/data/catalog.json`) em vez de uma dependência npm, porque este repositório é privado. Quando houver mais consumidores, publica-se como pacote privado.

Contrato campo a campo: [`docs/PACK-SPEC.md`](docs/PACK-SPEC.md). Integração e tabelas do Supabase: [`docs/APP-INTEGRATION.md`](docs/APP-INTEGRATION.md).

`lib/metrics.mjs` existe aqui e como port TypeScript no app. **Têm de se comportar de forma idêntica**: ambos testam os mesmos valores do PACK-001. Se mudar um, mude o outro.

## 9. Regras de ouro

1. **Nunca segredos** neste repositório (chaves, tokens, exportações n8n com credenciais). O validador procura padrões, mas não substitui revisão.
2. **Nunca dados reais** de clientes, pacientes ou leads. Fixtures são fictícias.
3. **Métricas são hipóteses**, com `disclaimer`. Nada de resultados garantidos nem cases sem baseline e autorização.
4. **Guardrails só se apertam.** Em demo e em produção as regras são as mesmas.
5. **Repositórios públicos (n8n, Hermes, OpenClaw) são inspiração, nunca importação.** Reconstruir, rever nodes e licença. Ver [`docs/SECURITY.md`](docs/SECURITY.md).
6. **Um pack não depende do app.** O app lê os packs, nunca o contrário.
7. **Versionar sempre:** cada simulação guarda `pack_id` + `pack_version`.

## 10. Estado atual

| ID | Pack | Estado | Segmentos |
|---|---|---|---|
| PACK-001 | Confirmação de consultas | `demo` | saúde, serviços |

Falta para o PACK-001 passar a `pilot`: workflows n8n para 1 sistema de agenda, casos de aceitação A01–A08 a passar contra os mocks, revisão de limites pela Helena e um cliente piloto com consentimento e baseline. Próximos packs: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## 11. Perguntas frequentes

**Porque é que os manifestos são JSON e não YAML?** Zero dependências: o validador, o gerador de catálogo e o app lêem JSON nativamente.

**O simulador usa o agente real?** Na V0 não: reproduz os cenários em guião. Na V1 o Hermes corre em sandbox com `binding.demo`, sobre o mesmo pack.

**Onde está o workflow n8n do PACK-001?** Ainda não existe: `workflows/README.md` tem o contrato dos 5 webhooks e o estado "por construir". É o trabalho para passar a `pilot`.

**Quem aprova uma mudança de estado?** O dono do pack propõe; `pilot` e `ga` exigem aceitação da Helena (ADR no atlas-ops).

**Preciso de instalar algo?** Não. `npm run check` corre com Node ≥ 20.

## 12. Documentação

- [`INDEX.md`](INDEX.md): índice completo e estado de integração
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/PACK-SPEC.md`](docs/PACK-SPEC.md) · [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md)
- [`docs/SECURITY.md`](docs/SECURITY.md) · [`docs/APP-INTEGRATION.md`](docs/APP-INTEGRATION.md) · [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/decisions/`](docs/decisions/): decisões de arquitetura (ADR)

Repositório privado · AtlasHub.SI
