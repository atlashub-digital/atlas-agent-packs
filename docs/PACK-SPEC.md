# Especificação do `pack.json` (schemaVersion 1)

| Campo | Obrigatório | Notas |
|---|---|---|
| `id` | sim | `PACK-NNN`, único, nunca reutilizado. `PACK-000` é o template |
| `slug` | sim | kebab-case, igual ao nome da pasta |
| `version` | sim | SemVer do pack |
| `status` | sim | `idea · draft · demo · pilot · ga · retired` |
| `name`, `summary` | sim | Texto que o lead vê. Resumo ≤ 240 caracteres |
| `locale` | sim | Idioma das mensagens do agente (`pt-BR` para clientes no Brasil) |
| `owner` | sim | Agente ou pessoa responsável (ex.: `max`) |
| `segments` | sim | Ver enum no schema |
| `equation` | sim | `receita · custos · velocidade · controlo` (manifesto) |
| `channels` | sim | Onde o agente fala |
| `commercial` | não | `{ cloud, onsite }`: modalidades de contratação |
| `steps` | sim | Percurso mostrado na timeline do simulador |
| `runtime` | sim | `agent: hermes`, ficheiros de skills e workflows |
| `tools` | sim | Contratos das ferramentas. `binding.prod` = `n8n:/webhook/...`, `binding.demo` = `mock:<id>` |
| `integrations` | não | Sistemas do cliente necessários (pré-requisitos do Assessment) |
| `config` | não | Variáveis por cliente; usadas nas skills como `{{chave}}` |
| `guardrails` | não | Limites com ação `handoff · block · log` |
| `metrics` | sim | `inputs` (com default/min/max/step), `outputs` (fórmulas), `disclaimer` |
| `demo` | sim | `fixtures`, `mocks`, `scenarios[]` e `labels` (`header`, `agent`, `customer`: textos do ecrã de chat) |
| `clara` | em `demo`/`pilot`/`ga` | O que a Clara diz no simulador: `intro[]`, `allDone`, `context[]` (rótulo/valor). O conteúdo pertence ao pack, não ao app |
| `tests` | sim | Casos de aceitação |
| `compliance` | não | Classes de dados, exclusões, notas LGPD |

## Fórmulas de métricas
Só números, chaves de inputs/outputs anteriores, `+ - * / ( )` e `round`, `min`, `max`. Avaliadas por `lib/metrics.mjs`, sem `eval`.

## Cenários (`demo/scenarios/*.json`)
`claraAfter` (frase da Clara no fim do cenário), `events[]` com `type` (`system · agent · patient · customer · staff`), `step` (id de `steps`), `text`, e opcionalmente `tool` e `guardrail`. Os passos nunca recuam. `humanReview`: `skip · required · optional`.
