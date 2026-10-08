# Workflows n8n — PACK-004

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `property.search` | `/webhook/real-estate-consultant/property-search` | auto |
| `property.get` | `/webhook/real-estate-consultant/property-get` | auto |
| `lead.capture` | `/webhook/real-estate-consultant/lead-capture` | auto |
| `visit.schedule` | `/webhook/real-estate-consultant/visit-schedule` | approval |
| `team.handoff` | `/webhook/real-estate-consultant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
