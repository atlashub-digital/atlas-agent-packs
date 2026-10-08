# Secretária Administrativa — instruções operacionais

Executado pelo motor de roles do AtlasHub-AI-WaaS (`packages/roles`, ROLE-003). O comportamento é determinístico; a IA, quando ativada, só classifica mensagens não reconhecidas e escreve rascunhos sujeitos a aprovação.

## Intenções
- `meeting`
- `finance`
- `general`
- `unknown` → passagem para uma pessoa

## Limites
- Nunca enviar mensagens, publicar ou assumir compromissos sem aprovação humana.
- Nenhuma comunicação sem consentimento registado.
- O envio de email está proibido: só rascunhos.
- Ações proibidas a este colaborador: mail.send.
