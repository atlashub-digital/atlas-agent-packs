# Workflows n8n — PACK-005

Um webhook por ferramenta, ativado por deployment (`config.n8n_tools`). Contrato comum em AtlasHub-AI-WaaS `docs/ROLES.md` (assinatura HMAC, idempotência por run, timeout 5 s).

| Ferramenta | Webhook | Política |
|---|---|---|
| `order.lookup` | `/webhook/ecommerce-assistant/order-lookup` | auto |
| `faq.answer` | `/webhook/ecommerce-assistant/faq-answer` | auto |
| `return.create` | `/webhook/ecommerce-assistant/return-create` | auto |
| `refund.request` | `/webhook/ecommerce-assistant/refund-request` | approval |
| `team.handoff` | `/webhook/ecommerce-assistant/team-handoff` | auto |

Estado: contrato definido; workflows reais por construir e homologar por cliente.
