# Política de CI E2E V7

## Histórico de Revisões

| Versão | Data | Autor(es) | Descrição da Revisão |
| ------ | ---- | --------- | -------------------- |
| 1.0 | 21 de março de 2026 | Danilo Melin | Consolidação da política de custo x valor da suíte E2E no CI durante o ciclo V7 |

## Objetivo

Documentar como a suíte E2E deve ser distribuída entre smoke automático em PR, suíte completa sob gatilho controlado e possíveis execuções periódicas futuras.

## Princípios de Decisão

- cenários de PR devem priorizar sinal rápido e determinístico
- cenários seeded ou com setup mais pesado continuam valiosos, mas não devem degradar o fluxo principal de revisão
- o smoke deve proteger regressões estruturais de alto impacto com o menor custo operacional possível
- a suíte completa continua sendo a camada de confiança mais profunda para fluxos críticos

## Classificação Atual da Suíte

### Grupo 1. Smoke automático em PR

Critério:

- impacto alto
- setup leve
- baixa flutuação
- diagnóstico rápido

Cenários:

- `e2e/auth-smoke.spec.js`
- `e2e/e2e-login.spec.js`

Motivo:

- validam a abertura da aplicação
- validam a transição real de entrada
- exercem o fluxo mínimo mais visível para qualquer regressão estrutural

### Grupo 2. Suíte completa sob gatilho controlado

Critério:

- alto valor funcional
- setup seeded ou fluxo mais profundo
- maior sensibilidade ao bootstrap ou a massa de dados

Cenários:

- `e2e/church-management.spec.js`
- `e2e/church-deletion.spec.js`
- `e2e/church-validation.spec.js`
- `e2e/empty-states.spec.js`
- `e2e/navigation-initial.spec.js`
- `e2e/operational-errors.spec.js`
- `e2e/organist-deletion.spec.js`
- `e2e/organist-management.spec.js`
- `e2e/organist-validation.spec.js`
- `e2e/schedule-edit-export.spec.js`
- `e2e/schedule-generation.spec.js`

Motivo:

- cobrem regras críticas do produto
- seguem úteis para validação antes de merge sensível, refatoração ou entrega maior
- ficam melhores sob execução seletiva/manual para evitar instabilidade desnecessária em toda PR

### Grupo 3. Candidatos a execução periódica futura

Critério:

- cenários estáveis o suficiente para ampliar confiança
- custo que pode ser aceito fora do caminho crítico da PR

Candidatos naturais:

- `e2e/navigation-initial.spec.js`
- `e2e/empty-states.spec.js`
- `e2e/operational-errors.spec.js`

Motivo:

- complementam bem o smoke
- agregam confiança transversal
- podem fazer mais sentido em `nightly` ou em segundo navegador no próximo ciclo

## Política Atual de Execução

### Pull Request para `main`

- executa `smoke` automaticamente
- objetivo: detectar regressão estrutural cedo sem bloquear o fluxo com cenários mais caros

### Workflow completo E2E

- permanece disponível por gatilho manual
- permanece disponível por label controlada
- objetivo: validação mais profunda sob demanda

## Sinais de Revisão da Política

Reavaliar a distribuição da suíte quando ocorrer qualquer um dos eventos abaixo:

- aumento recorrente de flakiness no smoke
- aumento relevante de tempo médio da PR
- introdução de novo fluxo central de entrada ou navegação
- amadurecimento dos seeded flows a ponto de se tornarem determinísticos em PR

## Decisão do Ciclo V7

Ao final da Fase 3.2, a decisão é:

- manter o smoke automático reduzido e estável
- manter a suíte completa fora do caminho crítico da PR
- usar a Fase 3.1 para decidir entre segundo navegador no smoke ou execução periódica dedicada

## Resultado Prático

- o CI passa a ter uma política explícita, não apenas implícita
- fica claro quais cenários são “gates” de PR e quais são validações aprofundadas
- a evolução futura da suíte pode ser feita com critério objetivo de custo x valor
