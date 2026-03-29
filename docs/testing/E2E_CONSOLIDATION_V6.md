# Consolidação da Suíte E2E V6

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão  |
| ------ | ------------------ | ------------ | --------------------- |
| 1.0    | 5 de março de 2026 | Danilo Melin | Consolidação da suíte |

## Objetivo

Registrar as ações de consolidação executadas na Fase 4.1 do V6, com
foco em estabilidade, reaproveitamento de helpers e política de
execução no CI.

## Consolidações Aplicadas

### 1. Reaproveitamento de navegação em helpers

Novo helper:

- `e2e/helpers/navigation.js`

Funções:

- `gotoChurchManager(page)`
- `openChurchDashboard(page, churchName)`

Benefício:

- reduz duplicação de `goto('/')` e validações repetidas de heading
- centraliza comportamento de navegação base da suíte

### 2. Reaproveitamento de seed de dados

Helper de sessão ampliado:

- `e2e/helpers/session.js`

Novo construtor:

- `buildChurchesDatabase(churches)`

Benefício:

- evita objetos inline extensos por cenário
- facilita composição de cenários com múltiplas igrejas, organistas e escalas

### 3. Redução de redundâncias em specs

Specs refatoradas para usar os novos helpers:

- `e2e/church-management.spec.js`
- `e2e/church-deletion.spec.js`
- `e2e/church-validation.spec.js`
- `e2e/empty-states.spec.js`
- `e2e/navigation-initial.spec.js`
- `e2e/operational-errors.spec.js`
- `e2e/organist-management.spec.js`
- `e2e/organist-deletion.spec.js`

## Revisão de Importância no CI

Decisão do ciclo:

- manter suíte E2E completa sob gatilho controlado (`run-e2e` ou manual)
- recomendar promoção de subset estável (`smoke`) para execução automática em toda PR no próximo ciclo

Cenários candidatos ao smoke:

- `e2e/auth-smoke.spec.js`
- `e2e/navigation-initial.spec.js`
- `e2e/empty-states.spec.js`

## Resultado Prático

- menor custo de manutenção da suíte
- menor duplicação em specs críticas
- suíte completa preservada para execução seletiva sem tornar o pipeline pesado
- recomendação formal de evolução para smoke automático em PR no V7
