# Workflows n8n — PACK-003

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `mail.read` | `/webhook/administrative-secretary/mail-read` | auto |
| `mail.label` | `/webhook/administrative-secretary/mail-label` | auto |
| `mail.draft_reply` | `/webhook/administrative-secretary/mail-draft_reply` | auto |
| `calendar.find_slots` | `/webhook/administrative-secretary/calendar-find_slots` | auto |
| `calendar.hold` | `/webhook/administrative-secretary/calendar-hold` | approval |
| `brief.create` | `/webhook/administrative-secretary/brief-create` | auto |
| `team.handoff` | `/webhook/administrative-secretary/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
