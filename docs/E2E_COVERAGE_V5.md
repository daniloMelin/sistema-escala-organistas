# Cobertura E2E V5

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                               |
| ------ | ------------------ | ------------ | ---------------------------------------------------------------------------------- |
| 1.0    | 3 de março de 2026 | Danilo Melin | Consolidação da cobertura atual de testes E2E e registro das lacunas remanescentes |

## Objetivo

Registrar o que a suíte E2E do ciclo V5 cobre hoje, quais riscos foram reduzidos e quais cenários ainda permanecem fora da automação.

## Cobertura Implementada

| Área         | Cenário                                       | Arquivo                            |
| ------------ | --------------------------------------------- | ---------------------------------- |
| Autenticação | carregamento da tela inicial                  | `e2e/auth-smoke.spec.js`           |
| Autenticação | login controlado em modo E2E                  | `e2e/e2e-login.spec.js`            |
| Navegação    | navegação inicial, seleção de igreja e logout | `e2e/navigation-initial.spec.js`   |
| Igrejas      | cadastro e edição                             | `e2e/church-management.spec.js`    |
| Organistas   | cadastro e edição                             | `e2e/organist-management.spec.js`  |
| Escalas      | geração de escala e visualização básica       | `e2e/schedule-generation.spec.js`  |
| Escalas      | edição manual e exportação de PDF             | `e2e/schedule-edit-export.spec.js` |

## Riscos Cobertos

- regressão nos fluxos principais de entrada e navegação
- falha em cadastro e edição de entidades principais
- quebra no fluxo principal de geração de escala
- falha visível no fluxo de edição manual
- regressão no acionamento de exportação

## Lacunas Remanescentes

### Prioridade Alta

- exclusão de igreja com confirmação e impacto em dados relacionados
- exclusão de organista com atualização imediata da lista
- cenários negativos de formulário com mensagens de validação
- fallback visual em erros de carregamento e erro operacional

### Prioridade Média

- persistência e renderização detalhada do histórico de escalas
- comportamento de estados vazios
- smoke coverage dos componentes de recuperação após falha
- compatibilidade em navegador adicional além de `Chromium`

### Fora do Escopo do V5

- autenticação real com provedor externo
- execução E2E contra Firestore real
- suíte E2E bloqueando toda PR por padrão

## Recomendações para o Próximo Ciclo

1. Cobrir exclusões e cenários negativos antes de expandir para novos fluxos.
2. Adicionar pelo menos um cenário de erro operacional controlado.
3. Validar execução em um segundo navegador quando a suíte estabilizar.
4. Reavaliar se algum subconjunto dos testes deve passar a rodar automaticamente em toda PR.

## Conclusão

O ciclo V5 atingiu o objetivo principal de criar uma base E2E útil, reproduzível e integrada ao CI de forma controlada. A cobertura ainda não é exaustiva, mas já protege os fluxos mais sensíveis do sistema e reduz o risco de regressão em mudanças futuras.
