# Ciclo de vida e gates

| Estado | Significa | Para avançar |
|---|---|---|
| `idea` | Dor identificada (Rui, Clara, simulações) | Ficha no atlas-ops com dor, segmento e métrica |
| `draft` | Manifesto e skills em construção | `npm run validate` limpo; passos, ferramentas e limites definidos |
| `demo` | Visível no simulador | ≥ 1 cenário feliz + 1 cenário de exceção; métricas com disclaimer; revisão de limites pela Helena |
| `pilot` | Num cliente real, com acompanhamento | Workflows n8n para 1 sistema; testes de aceitação a passar; consentimento e baseline do cliente |
| `ga` | Pronto a vender em escala | ≥ 2 clientes; case autorizado e medido; runbook de suporte |
| `retired` | Já não se vende | Clientes migrados ou acompanhados até ao fim |

Regras:
- Quem marca a passagem de estado é o dono do pack; `pilot` e `ga` exigem aceitação da Helena (ADR no atlas-ops).
- Nada de números de resultados em cases sem baseline e autorização do cliente.
