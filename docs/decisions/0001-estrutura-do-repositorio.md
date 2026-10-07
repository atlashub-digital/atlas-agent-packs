# 0001 · Estrutura do repositório atlas-agent-packs

- **Estado:** proposed (aceitação pela Helena, registo no atlas-ops)
- **Data:** 2026-10-07

## Contexto
A AtlasHub.SI precisa de agentes reutilizáveis que sirvam três usos: demo no simulador, piloto num cliente e operação em escala, em Cloud ou presencialmente.

## Decisão
- Repositório próprio, separado do app e da landing page.
- Um pack = uma pasta com `pack.json` + skills + workflows + demo + testes.
- Manifestos em JSON, validados sem dependências; o app consome um único `dist/catalog.json` gerado, instalado por tag.
- As ferramentas têm duas ligações, `mock:` (demo) e `n8n:` (produção); o agente nunca vê credenciais.

## Consequências
- Um pack novo não toca no app: nova pasta, nova tag, deploy do app.
- O lead testa exatamente o que é instalado.
- Exige disciplina de versionamento e de dados fictícios nas demos.
