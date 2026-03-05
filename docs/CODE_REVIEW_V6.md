# Code Review V6

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                    |
| ------ | ------------------ | ------------ | --------------------------------------------------------------------------------------- |
| 1.0    | 3 de março de 2026 | Danilo Melin | Criação do Code Review V6 com foco em exclusões, cenários negativos e erros operacionais |
| 1.1    | 3 de março de 2026 | Danilo Melin | Implementação da Fase 1.1 com cenário E2E de exclusão de igreja                         |
| 1.2    | 3 de março de 2026 | Danilo Melin | Implementação da Fase 1.2 com cenário E2E de exclusão de organista                      |
| 1.3    | 3 de março de 2026 | Danilo Melin | Implementação da Fase 2.1 com cenário E2E de validação negativa no cadastro de igreja   |
| 1.4    | 3 de março de 2026 | Danilo Melin | Implementação da Fase 2.2 com cenário E2E de validação negativa no cadastro de organista |
| 1.5    | 4 de março de 2026 | Danilo Melin | Implementação da Fase 3.2 com cenários E2E de falhas operacionais controladas            |
| 1.6    | 4 de março de 2026 | Danilo Melin | Implementação da Fase 3.1 com cenários E2E de estados vazios e mensagens orientativas    |

## Objetivo

Expandir a confiabilidade da aplicação sobre os cenários ainda não cobertos pelo ciclo V5, priorizando comportamentos destrutivos, validações negativas e tratamento de falhas operacionais.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `3 de março de 2026`
- Contexto: continuidade direta do `CODE_REVIEW_V5`, a partir das lacunas registradas em `docs/E2E_COVERAGE_V5.md`

## Diretriz de Prioridade

1. Cobrir fluxos destrutivos com confirmação e impacto visível
2. Validar cenários negativos de formulário e mensagens de erro
3. Exercitar recuperação visual e operacional em estados de falha
4. Consolidar a suíte antes de expandir para novos navegadores ou automação mais agressiva

## Plano de Implementação

### Fase 1 - Exclusões e Integridade de Fluxo

#### 1.1 Fluxo E2E de exclusão de igreja

- Status: `CONCLUÍDO`
- Prioridade: `CRÍTICA`
- Escopo:
  - abrir confirmação de exclusão
  - validar mensagem crítica ao usuário
  - excluir igreja
  - validar remoção da lista
  - validar retorno de navegação coerente após exclusão

#### 1.2 Fluxo E2E de exclusão de organista

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - abrir confirmação de exclusão
  - excluir organista
  - validar atualização imediata da lista
  - validar ausência da organista excluída no fluxo posterior

### Fase 2 - Cenários Negativos e Validação de Formulário

#### 2.1 Validações negativas no cadastro e edição de igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - submissão com campos obrigatórios ausentes
  - feedback visual de erro
  - prevenção de persistência inválida

#### 2.2 Validações negativas no cadastro e edição de organista

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - submissão com nome inválido ou campos obrigatórios faltando
  - feedback visual de erro
  - prevenção de persistência inválida

### Fase 3 - Erros Operacionais e Estados de Falha

#### 3.1 Estados vazios e comportamento inicial sem dados

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - aplicação sem igreja cadastrada
  - aplicação sem organistas cadastradas
  - mensagens orientativas e navegação disponível

#### 3.2 Falhas operacionais controladas

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - erro em carregamento de dados
  - erro em salvamento
  - fallback visual consistente
  - possibilidade de recuperação ou nova tentativa quando aplicável

### Fase 4 - Consolidação da Suíte

#### 4.1 Revisão de estabilidade e utilidade dos testes E2E

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar redundâncias na suíte
  - consolidar helpers reaproveitáveis
  - revisar se algum cenário já pode subir de importância no CI

## Ordem de execução recomendada

1. **Fase 4.1 - Consolidação da suíte**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.1 concluída
- [x] Fase 3.2 concluída
- [ ] Fase 4.1 concluída

## Critério de Conclusão do V6

- fluxos de exclusão críticos cobertos por E2E
- principais cenários negativos de formulário cobertos
- pelo menos um fluxo de falha operacional exercitado ponta a ponta
- documentação atualizada com riscos remanescentes e decisões do ciclo
