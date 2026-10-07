# PACK-001 · Workflows n8n

Cada ferramenta do `pack.json` corresponde a um webhook n8n em produção e a um mock em demo.
O agente nunca vê credenciais: só chama o webhook, e o n8n fala com a agenda e o WhatsApp do cliente.

| Ferramenta | Webhook (produção) | Estado |
|---|---|---|
| agenda.get_appointment | `/webhook/pack-001/agenda-get` | por construir |
| agenda.find_slots | `/webhook/pack-001/agenda-slots` | por construir |
| agenda.update_status | `/webhook/pack-001/agenda-update` | por construir |
| waitlist.offer_slot | `/webhook/pack-001/waitlist-offer` | por construir |
| team.handoff | `/webhook/pack-001/handoff` | por construir |

## Regras
- Exportar cada workflow para `workflows/<nome>.json` **sem credenciais** (n8n exporta só referências).
- Um adaptador por sistema de agenda (`adapters/<sistema>`) quando houver mais do que um cliente.
- Templates de repositórios públicos são só inspiração: reconstruir, rever nodes e licença (ver `docs/SECURITY.md`).
