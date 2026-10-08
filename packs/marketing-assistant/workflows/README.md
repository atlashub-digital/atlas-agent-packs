# Workflows n8n — PACK-006

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `research.collect` | `/webhook/marketing-assistant/research-collect` | auto |
| `post.draft` | `/webhook/marketing-assistant/post-draft` | auto |
| `post.schedule` | `/webhook/marketing-assistant/post-schedule` | approval |
| `report.generate` | `/webhook/marketing-assistant/report-generate` | auto |
| `team.handoff` | `/webhook/marketing-assistant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
