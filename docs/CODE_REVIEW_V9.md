# Code Review V9

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão |
| ------ | ------------------- | ------------ | -------------------- |
| 1.0    | 21 de março de 2026 | Danilo Melin | Criação do ciclo V9  |
| 1.1    | 21 de março de 2026 | Danilo Melin | Fase 1.1 concluída   |
| 1.2    | 21 de março de 2026 | Danilo Melin | Fase 1.2 concluída   |

## Objetivo

Transformar a baseline limpa de formatação e lint documental em rotina
operacional do projeto, reduzindo a chance de regressão e tornando os
gates de qualidade mais previsíveis no fluxo diário e no CI.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `21 de março de 2026`
- Data de encerramento: `A definir`
- Contexto: continuidade direta do fechamento do `CODE_REVIEW_V8` e da
  limpeza final de `Prettier` e `markdownlint` no repositório

## Diretriz de Prioridade

1. Preservar a baseline recém-limpa sem criar atrito excessivo
2. Promover checks leves e úteis para o fluxo de PR
3. Melhorar o feedback local para evitar regressões pequenas
4. Registrar uma política clara de manutenção para qualidade estática

## Diagnóstico Inicial

O repositório encerrou a rodada anterior com:

- `npm run format:check` limpo
- `npm run lint:md` limpo
- `configs`, `workflows`, `docs`, `e2e` e `src` já compatíveis com a
  baseline atual

O próximo risco natural não é mais o passivo acumulado, e sim a
reintrodução gradual de divergências por falta de enforcement leve e
rotina explícita.

## Plano de Implementação

### Fase 1 - Preservação da Baseline

#### 1.1 Integrar `format:check` ao fluxo de CI principal

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - avaliar o melhor ponto do pipeline para `format:check`
  - evitar duplicação desnecessária com outros workflows
  - garantir feedback rápido e objetivo em PR
  - resultado alcançado:
    - `format:check` integrado ao workflow principal de CI
    - gate posicionado antes de lint, cobertura e build
    - comentários automáticos do CI atualizados para refletir a nova etapa

#### 1.2 Integrar `lint:md` ao fluxo de CI principal

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - promover `lint:md` para gate leve de documentação
  - validar impacto em tempo e ruído
  - manter o check isolado e fácil de diagnosticar
  - resultado alcançado:
    - `lint:md` integrado ao workflow principal de CI
    - validação documental promovida a gate leve em PR
    - comentários automáticos do CI atualizados para refletir a nova etapa

### Fase 2 - Fluxo Local e Ergonomia

#### 2.1 Definir rotina local mínima para contributors

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar sequência local recomendada antes de PR
  - alinhar `lint`, `format:check` e `lint:md`
  - reduzir dependência de memória individual

#### 2.2 Avaliar automação local opcional

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - avaliar uso de `husky`/`lint-staged` ou alternativa equivalente
  - decidir se a automação entra agora ou fica registrada para depois
  - evitar sobrecarga desnecessária em commits pequenos

### Fase 3 - Política de Manutenção

#### 3.1 Consolidar política de qualidade estática do repositório

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar quando um novo check deve virar gate
  - registrar critérios para exceções e rollout gradual
  - consolidar a relação entre local, PR e execução periódica

#### 3.2 Revisar sinal x ruído dos checks após integração

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar utilidade real dos novos gates
  - identificar atrito desnecessário ou redundância
  - ajustar a política antes do fechamento do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Consolidar baseline operacional e próximos passos

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar o estado final dos gates
  - consolidar a decisão sobre automação local
  - fechar formalmente o `CODE_REVIEW_V9`

## Ordem de execução recomendada

1. **Fase 1.1 - `format:check` no CI**
2. **Fase 1.2 - `lint:md` no CI**
3. **Fase 2.1 - rotina local mínima**
4. **Fase 2.2 - automação local opcional**
5. **Fase 3.1 - política de qualidade estática**
6. **Fase 3.2 - revisão de sinal x ruído**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [ ] Fase 2.1 pendente
- [ ] Fase 2.2 pendente
- [ ] Fase 3.1 pendente
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V9

- `format:check` e `lint:md` integrados ao fluxo planejado do projeto
- rotina local mínima documentada de forma objetiva
- política de manutenção dos gates registrada
- feedback dos checks considerado útil e sustentável para o time
