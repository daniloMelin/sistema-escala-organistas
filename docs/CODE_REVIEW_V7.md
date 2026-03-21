# Code Review V7

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                   |
| ------ | ------------------ | ------------ | -------------------------------------------------------------------------------------- |
| 1.0    | 13 de março de 2026 | Danilo Melin | Criação do Code Review V7 com foco em recuperação após falhas, smoke e evolução de CI |
| 1.1    | 13 de março de 2026 | Danilo Melin | Implementação da Fase 1.1 com retry explícito após falha transitória no carregamento de igrejas |
| 1.2    | 13 de março de 2026 | Danilo Melin | Implementação da Fase 1.2 com retry explícito após falha transitória no salvamento de organista |
| 1.3    | 21 de março de 2026 | Danilo Melin | Implementação da Fase 2.1 com definição formal do subconjunto smoke e seus critérios de seleção |
| 1.4    | 21 de março de 2026 | Danilo Melin | Implementação da Fase 2.2 com integração do subconjunto smoke ao GitHub Actions em PR |
| 1.5    | 21 de março de 2026 | Danilo Melin | Ajuste do smoke para incluir o fluxo real de login E2E após revisão da PR |
| 1.6    | 21 de março de 2026 | Danilo Melin | Refinamento do smoke para priorizar cenários determinísticos e manter seeded flows na suíte completa |
| 1.7    | 21 de março de 2026 | Danilo Melin | Implementação da Fase 3.2 com política explícita de custo x valor da suíte E2E no CI |

## Objetivo

Evoluir a suíte E2E do projeto para um estágio mais confiável em recuperação de erro, mais útil no CI e mais sustentável para crescer sem aumentar desnecessariamente o custo operacional.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `13 de março de 2026`
- Contexto: continuidade direta do `CODE_REVIEW_V6`, aproveitando a base consolidada da suíte E2E e as recomendações registradas no fechamento do ciclo anterior

## Diretriz de Prioridade

1. Cobrir recuperação explícita em cenários de falha já identificados
2. Introduzir um subconjunto smoke com valor real para PR
3. Evoluir a confiança no CI sem tornar o pipeline pesado
4. Revisar continuamente custo x benefício dos cenários existentes

## Plano de Implementação

### Fase 1 - Recuperação Após Falhas

#### 1.1 Retry explícito após falha de carregamento de igrejas

- Status: `CONCLUÍDO`
- Prioridade: `CRÍTICA`
- Escopo:
  - simular falha transitória em carregamento
  - validar mensagem de erro
  - executar ação explícita de recuperação
  - validar carregamento com sucesso após retry

#### 1.2 Retry explícito após falha de salvamento de organista

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - simular falha transitória de salvamento
  - validar erro operacional
  - repetir a ação do usuário
  - validar persistência correta após nova tentativa

### Fase 2 - Smoke E2E para Pull Requests

#### 2.1 Definir e validar subconjunto smoke

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - selecionar cenários com melhor custo x valor
  - validar estabilidade local do subconjunto
  - formalizar critérios para entrada e saída de cenários no smoke

#### 2.2 Integrar smoke ao GitHub Actions para toda PR

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - criar workflow dedicado e leve
  - manter suíte completa sob gatilho controlado
  - publicar artefatos mínimos úteis para diagnóstico

### Fase 3 - Expansão Controlada de Confiança

#### 3.1 Avaliar segundo navegador para smoke ou execução periódica

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - medir custo adicional de execução
  - validar compatibilidade dos cenários smoke
  - decidir entre smoke multi-browser ou nightly dedicado

#### 3.2 Revisar custo x valor da suíte no CI

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - identificar cenários caros ou redundantes
  - propor redistribuição entre smoke, suíte completa e execução periódica
  - documentar política de manutenção do pipeline

### Fase 4 - Fechamento do Ciclo

#### 4.1 Consolidar decisões e atualizar documentação operacional

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar decisões do ciclo em documento consolidado
  - atualizar guia E2E e estratégia de CI
  - fechar formalmente o `CODE_REVIEW_V7`

## Ordem de execução recomendada

1. **Fase 3.1 - Avaliar segundo navegador**
2. **Fase 4.1 - Fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.2 concluída
- [ ] Fase 3.1 concluída
- [ ] Fase 4.1 concluída

## Critério de Conclusão do V7

- pelo menos dois fluxos de recuperação explícita cobertos por E2E
- subconjunto smoke definido com critérios claros
- smoke integrado ao CI de PR com estabilidade aceitável
- política de execução da suíte revisada e documentada
