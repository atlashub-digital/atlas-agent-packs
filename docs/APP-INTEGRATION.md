# Integração com app.atlashub.si

## Instalar uma versão fixa

```bash
npm i github:atlashub-digital/atlas-agent-packs#v0.1.0
```
O script `prepare` gera `dist/catalog.json` na instalação.

## Usar no app (Next.js)

```ts
import catalog from '@atlashub/agent-packs/catalog' with { type: 'json' };
import { evaluateMetrics } from '@atlashub/agent-packs/metrics';

const pack = catalog.packs.find((p) => p.slug === 'clinic-appointment-confirmation');
const kpis = evaluateMetrics(pack.metrics, { appointments_per_month: 1200 });
```

O simulador precisa só de: `steps` (timeline), `scenarios` (chat + registo), `metrics` (painel), `guardrails` e `commercial` (próximo passo).

## Supabase: o que guardar por simulação

| Campo | Origem |
|---|---|
| `lead_id` | Clara |
| `pack_id`, `pack_version` | catálogo |
| `scenario_id` | escolha do lead |
| `metric_inputs` (jsonb) | números introduzidos pelo lead |
| `metric_outputs` (jsonb) | `evaluateMetrics` |
| `completed_scenarios` | cenários vistos até ao fim |
| `created_at` | — |

Atualizar o app para uma versão nova do catálogo = mudar a tag e fazer deploy.
