# Expansão de Confiança E2E V7

## Histórico de Revisões

| Versão | Data | Autor(es) | Descrição da Revisão |
| ------ | ---- | --------- | -------------------- |
| 1.0 | 21 de março de 2026 | Danilo Melin | Expansão de confiança V7 |

## Objetivo

Registrar a decisão do ciclo V7 para ampliar a confiança do CI sem
degradar o fluxo principal das pull requests.

## Opções Avaliadas

### Opção A. Adicionar segundo navegador ao smoke

Vantagens:

- aumenta cobertura cross-browser logo na PR
- sinaliza regressões específicas de engine mais cedo

Desvantagens:

- amplia tempo de execução do smoke
- aumenta custo operacional em toda PR
- pressiona um subconjunto que ainda está sendo estabilizado

### Opção B. Adotar execução periódica dedicada

Vantagens:

- preserva PR leve e estável
- amplia confiança com a suíte completa fora do caminho crítico
- cria espaço para medir estabilidade antes de promover novos cenários
  ou navegadores no smoke

Desvantagens:

- feedback mais tardio do que o smoke em PR
- exige disciplina para acompanhar falhas do workflow periódico

## Decisão do V7

No ciclo atual, a decisão é:

- não adicionar segundo navegador ao smoke de PR
- adotar execução periódica dedicada da suíte completa em `Chromium`

## Justificativa

- o smoke acabou de ser estabilizado com dois fluxos mínimos de alto valor
- aumentar navegador agora elevaria custo antes de consolidar a política atual
- a suíte completa já possui cobertura funcional mais rica e se
  beneficia melhor de uma execução recorrente fora da PR

## Implementação

Workflow criado:

- `.github/workflows/e2e-nightly.yml`

Política:

- execução automática diária
- execução manual também disponível
- suíte completa em `Chromium`
- publicação de artefatos para análise posterior

## Critério para Reavaliar Multi-Browser

Considerar segundo navegador no smoke apenas quando:

- o smoke atual permanecer estável por um período contínuo
- o tempo médio das PRs seguir aceitável
- os seeded flows mais sensíveis estiverem mais maduros

## Resultado Prático

- o projeto ganha uma camada recorrente de validação profunda
- o smoke continua pequeno e adequado para PR
- a próxima expansão cross-browser pode ser feita com mais evidência e menos risco
