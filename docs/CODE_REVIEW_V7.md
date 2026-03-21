# Code Review V7

## Histórico de Revisões

### Versão 1.0

- Data: `13 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Criação do Code Review V7 com foco em recuperação após falhas,
  smoke e evolução de CI.

### Versão 1.1

- Data: `13 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 1.1 com retry explícito após falha
  transitória no carregamento de igrejas.

### Versão 1.2

- Data: `13 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 1.2 com retry explícito após falha
  transitória no salvamento de organista.

### Versão 1.3

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 2.1 com definição formal do subconjunto
  smoke e seus critérios de seleção.

### Versão 1.4

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 2.2 com integração do subconjunto smoke ao
  GitHub Actions em PR.

### Versão 1.5

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Ajuste do smoke para incluir o fluxo real de login E2E após
  revisão da PR.

### Versão 1.6

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Refinamento do smoke para priorizar cenários determinísticos e
  manter seeded flows na suíte completa.

### Versão 1.7

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 3.2 com política explícita de custo x valor
  da suíte E2E no CI.

### Versão 1.8

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Implementação da Fase 3.1 com decisão por execução periódica
  dedicada em vez de segundo navegador no smoke.

### Versão 1.9

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Fechamento formal do ciclo V7 com consolidação das decisões
  operacionais do E2E.

## Objetivo

Evoluir a suíte E2E do projeto para um estágio mais confiável em
recuperação de erro, mais útil no CI e mais sustentável para crescer
sem aumentar desnecessariamente o custo operacional.

## Status do Ciclo

- Status geral: `CONCLUÍDO`
- Data de início: `13 de março de 2026`
- Data de encerramento: `21 de março de 2026`
- Contexto: continuidade direta do `CODE_REVIEW_V6`, aproveitando a
  base consolidada da suíte E2E e as recomendações registradas no
  fechamento do ciclo anterior

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

- Status: `CONCLUÍDO`
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

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar decisões do ciclo em documento consolidado
  - atualizar guia E2E e estratégia de CI
  - fechar formalmente o `CODE_REVIEW_V7`

## Ordem de execução recomendada

1. **Ciclo encerrado**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.1 concluída
- [x] Fase 3.2 concluída
- [x] Fase 4.1 concluída

## Critério de Conclusão do V7

- pelo menos dois fluxos de recuperação explícita cobertos por E2E
- subconjunto smoke definido com critérios claros
- smoke integrado ao CI de PR com estabilidade aceitável
- política de execução da suíte revisada e documentada

## Resumo Executivo

O ciclo V7 consolidou a maturidade operacional da suíte E2E iniciada
nos ciclos anteriores.

Principais resultados:

- recuperação explícita de falhas transitórias validada por E2E
- smoke de PR reduzido ao subconjunto mais determinístico e de maior
  valor estrutural
- política explícita de custo x valor documentada para o CI
- execução periódica dedicada criada para a suíte completa

## Impacto Prático no Projeto

- regressões estruturais de entrada agora são verificadas em toda PR
- fluxos funcionais mais profundos continuam protegidos fora do caminho
  crítico da revisão
- o time passa a ter critério claro para decidir quando promover ou
  retirar cenários do smoke
- a evolução futura para multi-browser pode ser feita com base em
  evidência e não por tentativa

## Artefatos Consolidados do Ciclo

- `docs/E2E_SMOKE_V7.md`
- `docs/E2E_CI_POLICY_V7.md`
- `docs/E2E_EXPANSION_V7.md`
- `docs/E2E_GUIDE.md`
- `.github/workflows/e2e-smoke.yml`
- `.github/workflows/e2e-nightly.yml`

## Próximos Passos Recomendados

1. Avaliar no próximo ciclo se o workflow `E2E Nightly` permaneceu
   estável o suficiente para promover algum seeded flow.
2. Revisar o smoke apenas se houver novo fluxo de entrada realmente
   crítico para PR.
3. Considerar segundo navegador somente após histórico consistente de
   estabilidade e custo aceitável.
