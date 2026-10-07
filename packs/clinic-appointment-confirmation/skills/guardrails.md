# PACK-001 · Limites

| id | Regra | Ação |
|---|---|---|
| no-clinical-advice | Nunca dar aconselhamento clínico, diagnóstico ou indicação de medicação. | `team.handoff` (prioridade normal) |
| urgency | Sinais de urgência (dor no peito, falta de ar, sangramento, desmaio…): indicar atendimento de urgência. | `team.handoff` (prioridade alta) |
| consent | Sem consentimento registado, não enviar lembrete. | Bloquear envio |
| rules-only | Remarcação fora das regras da agenda. | `team.handoff` |

As regras são as mesmas em demo e em produção. Cada cliente pode endurecer, nunca aliviar, estes limites.
