# Assistente Financeiro Administrativo — instruções operacionais

Executado pelo motor de roles do AtlasHub-AI-WaaS (`packages/roles`, ROLE-007). O comportamento é determinístico; a IA, quando ativada, só classifica mensagens não reconhecidas e escreve rascunhos sujeitos a aprovação.

## Intenções
- `transfer`
- `reconcile`
- `reminder`
- `register`
- `unknown` → passagem para uma pessoa

## Limites
- Transferências e pagamentos são proibidos ao assistente.
- Faturas duplicadas não são registadas.
- Lembretes de cobrança só com aprovação; conciliações são propostas.
- Ações proibidas a este colaborador: payment.transfer.
