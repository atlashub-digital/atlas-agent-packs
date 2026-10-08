# Workflows n8n — PACK-008

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `application.register` | `/webhook/hr-assistant/application-register` | auto |
| `faq.answer` | `/webhook/hr-assistant/faq-answer` | auto |
| `interview.find_slots` | `/webhook/hr-assistant/interview-find_slots` | auto |
| `interview.schedule` | `/webhook/hr-assistant/interview-schedule` | approval |
| `team.handoff` | `/webhook/hr-assistant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
