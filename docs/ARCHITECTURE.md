# Arquitetura

## Três camadas

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| **Cérebro** | Hermes (skills do pack) | Interpretar, decidir dentro dos limites, chamar ferramentas |
| **Mãos** | n8n (um webhook por ferramenta) | Falar com agenda, CRM, ERP… Guarda as credenciais do cliente |
| **Canais** | Atendimento.Center (WhatsApp, webchat) | Entregar mensagens e fazer handoff humano |

O agente **nunca vê credenciais**: chama `tool.id`, e a ligação (`binding`) decide para onde vai.

## Demo e produção usam o mesmo pack

```
                 pack.json
                     │
        ┌────────────┴────────────┐
   binding.demo              binding.prod
   mock:<tool>               n8n:/webhook/<pack>/<tool>
        │                         │
  demo/mocks.json           n8n do tenant do cliente
  demo/fixtures/            sistemas reais
        │                         │
  Simulador (app)           Cliente em Cloud ou presencial
```

- **V0 do simulador**: reproduz os `demo/scenarios/*.json` (guião), sem LLM. Rápido, previsível, ótimo para a primeira conversa.
- **V1**: o agente Hermes real corre num tenant sandbox, com `binding.demo`. O lead pode escrever o que quiser.
- **Produção**: tenant do cliente, `binding.prod`, config do cliente.

## Multi-tenant

O pack é o mesmo para todos os clientes. O que muda por tenant:
- valores de `config` (nome, horários, filas);
- credenciais no n8n do tenant;
- limites mais apertados, se o cliente quiser (nunca mais soltos).

## Versionamento

- Cada pack tem `version` própria (SemVer) e `CHANGELOG.md`.
- O repositório tem a versão do catálogo (`package.json`). O app instala uma **tag** (`v0.1.0`), nunca `main`.
- Cada simulação gravada no Supabase guarda `pack_id` + `pack_version`, para se saber exatamente o que o lead viu.
