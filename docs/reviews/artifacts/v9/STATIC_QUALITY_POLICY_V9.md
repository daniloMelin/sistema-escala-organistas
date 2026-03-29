# Política de Qualidade Estática V9

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão    |
| ------ | ------------------- | ------------ | ----------------------- |
| 1.0    | 22 de março de 2026 | Danilo Melin | Política estática do V9 |

## Objetivo

Documentar como os checks de qualidade estática do projeto devem ser
distribuídos entre validação local, CI principal e futuras expansões de
gate.

## Escopo da Política

Esta política cobre os checks atualmente ligados à manutenção
estrutural do repositório:

- `npm run format:check`
- `npm run lint:md`
- `npm run lint`

Não entram nesta política:

- cobertura crítica
- build
- smoke E2E
- suíte E2E completa

Esses fluxos continuam regidos por suas próprias decisões de CI.

## Princípios de Decisão

- checks leves e determinísticos devem falhar cedo
- checks baratos devem proteger o caminho principal de PR
- checks mais caros ou mais contextuais não devem virar gate sem
  evidência clara de benefício
- o fluxo local deve ser recomendado de forma objetiva, mas sem
  sobrecarga desnecessária em commits pequenos

## Distribuição Atual dos Checks

### Grupo 1. Rotina local mínima

Checks:

- `npm run format:check`
- `npm run lint:md`
- `npm run lint`

Objetivo:

- impedir regressões triviais antes da PR
- reduzir ruído de revisão
- deixar o CI como confirmação, não como primeiro contato com erros
  simples

Documento de apoio:

- `CONTRIBUTING.md`

### Grupo 2. CI principal em PR

Checks:

- `npm run format:check`
- `npm run lint:md`
- `npm run lint`
- `npm run test:coverage:critical`
- `npm run build`

Objetivo:

- proteger a branch principal com gates rápidos e consistentes
- falhar cedo em problemas estruturais
- manter a revisão orientada por sinal útil

Workflow:

- `.github/workflows/ci.yml`

### Grupo 3. Candidatos a evolução futura

Candidatos naturais:

- automação local com `husky`/`lint-staged`
- expansão de lint para novos tipos de arquivo
- redistribuição de checks entre jobs separados no CI

Critério:

- só promover quando houver evidência de ganho real em tempo de revisão,
  estabilidade ou redução de regressões

## Critérios para Promover um Novo Gate

Um novo check só deve virar gate do fluxo principal quando atender a
todos os pontos abaixo:

1. baixo custo de execução
2. alta previsibilidade
3. diagnóstico simples
4. valor recorrente em PR
5. baixo risco de atrito desnecessário

## Critérios para Manter um Check Fora do Gate

Um check deve permanecer fora do caminho principal quando houver
qualquer um dos fatores abaixo:

- execução cara
- flakiness perceptível
- dependência de setup específico
- benefício baixo para mudanças pequenas
- custo de manutenção maior que o ganho operacional

## Decisão Atual do Ciclo V9

Ao final da Fase 3.1, a decisão é:

- manter `format:check`, `lint:md` e `lint` como parte da baseline de PR
- manter a rotina local mínima documentada, mas sem hooks obrigatórios
- preservar cobertura crítica e build no CI principal
- deixar automação local obrigatória para reavaliação futura

## Resultado Prático

- o repositório passa a ter uma política explícita para qualidade
  estática
- fica claro o que é responsabilidade local e o que é responsabilidade
  do CI
- novas propostas de gate podem ser avaliadas com critério objetivo,
  sem depender apenas de preferência individual
