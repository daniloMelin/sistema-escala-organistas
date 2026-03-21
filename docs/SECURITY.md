# Política de Segurança

## Versões Suportadas

Este projeto está em evolução contínua e, no momento, a versão suportada para correções de segurança é a versão ativa
disponível no branch `main`.

| Versão             | Suporte |
| ------------------ | ------- |
| `main`             | ✅      |
| versões anteriores | ❌      |

## Como Reportar uma Vulnerabilidade

Se você identificar uma vulnerabilidade de segurança neste projeto, não abra uma issue pública.

Use o recurso de relato privado do GitHub (`Private vulnerability reporting`) para enviar os detalhes de forma confidencial.

Ao reportar, inclua sempre que possível:

- descrição clara da vulnerabilidade
- impacto esperado
- passos para reproduzir
- arquivos ou trechos afetados
- sugestão de correção, se houver

## O Que Esperar Após o Reporte

Fluxo esperado de tratamento:

1. confirmação inicial do recebimento do reporte
2. análise da vulnerabilidade
3. definição da severidade e da necessidade de correção
4. correção em branch apropriada
5. publicação da correção
6. divulgação responsável, quando aplicável

## Boas Práticas para Colaboradores

Para reduzir riscos de segurança neste repositório:

- nunca commitar credenciais, tokens ou chaves privadas
- usar variáveis de ambiente para dados sensíveis
- revisar dependências periodicamente
- manter Firestore Rules e validações de entrada atualizadas
- preferir PRs pequenas e revisáveis para mudanças sensíveis

## Escopo

Esta política cobre principalmente:

- autenticação
- regras de acesso e segurança de dados no Firebase/Firestore
- exposição indevida de segredos
- dependências vulneráveis
- falhas que possam comprometer confidencialidade, integridade ou disponibilidade
