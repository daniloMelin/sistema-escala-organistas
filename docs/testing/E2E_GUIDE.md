# Guia de Testes E2E

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão          |
| ------ | ------------------- | ------------ | ----------------------------- |
| 1.0    | 1 de março de 2026  | Danilo Melin | Criação do guia               |
| 1.1    | 2 de março de 2026  | Danilo Melin | Modo E2E controlado           |
| 1.2    | 3 de março de 2026  | Danilo Melin | Comandos E2E padronizados     |
| 1.3    | 3 de março de 2026  | Danilo Melin | E2E no GitHub Actions         |
| 1.4    | 3 de março de 2026  | Danilo Melin | Cobertura E2E referenciada    |
| 1.5    | 5 de março de 2026  | Danilo Melin | Consolidação da suíte         |
| 1.6    | 21 de março de 2026 | Danilo Melin | Referência ao smoke V7        |
| 1.7    | 21 de março de 2026 | Danilo Melin | Comando smoke no CI           |
| 1.8    | 21 de março de 2026 | Danilo Melin | Login E2E no smoke            |
| 1.9    | 21 de março de 2026 | Danilo Melin | Smoke reduzido no CI          |
| 2.0    | 21 de março de 2026 | Danilo Melin | Política E2E no CI            |
| 2.1    | 21 de março de 2026 | Danilo Melin | Expansão periódica registrada |
| 2.2    | 21 de março de 2026 | Danilo Melin | Fechamento operacional V7     |

## Objetivo

Documentar a base inicial de testes ponta a ponta do projeto.

## Stack adotada

- Runner E2E: `Playwright`
- Navegador inicial padrão: `Chromium`
- Diretório de testes: `e2e/`

## Scripts disponíveis

```bash
npm run test:e2e
npm run test:e2e:smoke
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:e2e:report
```

## Pré-requisitos

1. Dependências instaladas com `npm install`
2. Navegadores do Playwright instalados

Comando para instalar o navegador inicial:

```bash
npx playwright install chromium
```

## Como executar

Execução padrão:

```bash
npm run test:e2e
```

Execução do subconjunto smoke:

```bash
npm run test:e2e:smoke
```

Modo interativo do Playwright:

```bash
npm run test:e2e:ui
```

Execução com navegador visível:

```bash
npm run test:e2e:headed
```

Abrir o relatório HTML após a execução:

```bash
npm run test:e2e:report
```

## Comportamento da configuração atual

- o Playwright sobe automaticamente a aplicação com `npm start`
- a URL base padrão é `http://127.0.0.1:3001`
- a aplicação é iniciada com `REACT_APP_E2E_MODE=true`
- a porta E2E é dedicada e separada do uso normal da aplicação
- a configuração não reutiliza servidor existente, evitando testes
  contra uma instância fora do modo E2E
- gera relatório HTML em `playwright-report/`
- mantém screenshot, vídeo e trace apenas em falhas/retries configurados
- em modo E2E, autenticação e persistência usam fluxo local controlado

## Escopo atual da Fase 1.1

Teste inicial implementado:

- smoke test da tela inicial de autenticação

Arquivo inicial:

- `e2e/auth-smoke.spec.js`

Helper inicial:

- `e2e/helpers/session.js`

Teste adicional de login controlado:

- `e2e/e2e-login.spec.js`

O subconjunto smoke atual cobre:

- `e2e/auth-smoke.spec.js`
- `e2e/e2e-login.spec.js`

Os cenários seeded de navegação inicial e estados vazios permanecem na
suíte E2E completa.

## Estratégia de ambiente e dados

Documento complementar:

- `docs/testing/E2E_STRATEGY.md`
- `docs/testing/E2E_COVERAGE_V5.md`
- `docs/testing/E2E_CONSOLIDATION_V6.md`
- `docs/testing/E2E_SMOKE_V7.md`
- `docs/testing/E2E_CI_POLICY_V7.md`
- `docs/testing/E2E_EXPANSION_V7.md`

## Estado Operacional Atual

1. `Smoke` roda automaticamente em toda PR para `main`.
2. `Suíte completa` continua disponível por workflow manual e por label controlada.
3. `Nightly` executa a suíte completa diariamente em `Chromium`.

## Próximos passos

1. Revisar periodicamente o conjunto de smoke conforme crescimento da suíte.
2. Acompanhar a estabilidade do `E2E Nightly` antes de promover novos
   cenários para caminhos automáticos.
3. Reavaliar execução em navegador adicional apenas quando houver
   evidência de maturidade suficiente.

## Execução no GitHub Actions

O projeto possui um workflow E2E dedicado:

- arquivo: `.github/workflows/e2e.yml`

O projeto também possui um workflow smoke para PR:

- arquivo: `.github/workflows/e2e-smoke.yml`

O projeto também possui um workflow periódico da suíte completa:

- arquivo: `.github/workflows/e2e-nightly.yml`

### Como disparar no CI

Opção 1. Execução manual:

- GitHub > `Actions` > workflow `E2E` > `Run workflow`

Opção 2. Pull request com gatilho controlado:

- adicionar a label `run-e2e` na PR

Smoke automático em PR:

- executado automaticamente em toda PR para `main`
- roda o comando `npm run test:e2e:smoke`

Execução periódica dedicada:

- executada diariamente no workflow `E2E Nightly`
- também pode ser disparada manualmente

### Motivo do gatilho controlado

- evitar bloquear toda PR desde o início do ciclo
- permitir uso seletivo enquanto a suíte E2E amadurece
- manter o pipeline principal leve

Documento complementar da política atual:

- `docs/testing/E2E_CI_POLICY_V7.md`
- `docs/testing/E2E_EXPANSION_V7.md`

### Evidências geradas

O workflow publica artefatos quando executado:

- `playwright-report`
- `playwright-test-results`
- `playwright-smoke-report`
- `playwright-smoke-test-results`
