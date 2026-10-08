# Workflows n8n — PACK-002

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `crm.upsert_lead` | `/webhook/sales-assistant/crm-upsert_lead` | auto |
| `crm.log_activity` | `/webhook/sales-assistant/crm-log_activity` | auto |
| `crm.suppress` | `/webhook/sales-assistant/crm-suppress` | auto |
| `calendar.find_slots` | `/webhook/sales-assistant/calendar-find_slots` | auto |
| `calendar.book_meeting` | `/webhook/sales-assistant/calendar-book_meeting` | approval |
| `message.send_followup` | `/webhook/sales-assistant/message-send_followup` | approval |
| `team.handoff` | `/webhook/sales-assistant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
