# Workflows n8n — PACK-007

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `invoice.register` | `/webhook/finance-assistant/invoice-register` | auto |
| `reconcile.match` | `/webhook/finance-assistant/reconcile-match` | auto |
| `reminder.send` | `/webhook/finance-assistant/reminder-send` | approval |
| `team.handoff` | `/webhook/finance-assistant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
