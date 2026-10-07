# Segurança, LGPD e repositórios públicos

## Nunca neste repositório
- Credenciais, tokens, chaves de API (vivem no n8n do tenant ou num cofre).
- Dados reais de clientes, pacientes ou leads. Fixtures são sempre fictícias.
- Exportações n8n com credenciais embutidas.

O `npm run validate` procura padrões de segredos, mas não substitui revisão.

## LGPD
- Todo o pack declara `compliance.dataClasses` e `compliance.excludes`.
- Lembretes e mensagens proativas só com consentimento registado (`guardrail` do tipo `block`).
- Dados clínicos ficam fora dos packs administrativos.
- No simulador, o que o lead introduz é guardado só com consentimento dado na conversa com a Clara.

## Repositórios públicos (n8n templates, Hermes/OpenClaw use cases)
São **inspiração, nunca importação**. Cada ideia aproveitada:
1. é reconstruída no nosso formato;
2. tem os nodes/skills revistos (permissões, chamadas externas);
3. tem a licença verificada (muitos templates não pertencem a quem os lista);
4. fica registada na triagem do atlas-ops (`projects/atlashub-si/TRIAGEM-TEMPLATES-AWESOME-*`).
