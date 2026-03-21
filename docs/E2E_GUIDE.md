# Guia de Testes E2E

## Histórico de Revisões

### Versão 1.0

- Data: `1 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Criação do guia inicial de execução dos testes E2E com
  Playwright.

### Versão 1.1

- Data: `2 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Atualização do guia com modo E2E controlado, autenticação local e
  helper de sessão.

### Versão 1.2

- Data: `3 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Padronização dos comandos E2E e adoção de porta dedicada para
  execução determinística.

### Versão 1.3

- Data: `3 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Documentação da execução E2E no GitHub Actions com gatilho
  controlado por label e workflow manual.

### Versão 1.4

- Data: `3 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Referência da cobertura atual da suíte E2E e encaminhamento das
  lacunas remanescentes.

### Versão 1.5

- Data: `5 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Consolidação da suíte com revisão de manutenção e recomendação de
  smoke para próximo ciclo.

### Versão 1.6

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Inclusão da referência ao subconjunto smoke definido no ciclo V7.

### Versão 1.7

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Inclusão do comando smoke e da integração automática no GitHub
  Actions.

### Versão 1.8

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Ampliação do smoke para incluir o fluxo real de login E2E.

### Versão 1.9

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Ajuste do smoke para manter apenas fluxos mais determinísticos no
  CI.

### Versão 2.0

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Inclusão da política de custo x valor da suíte E2E no CI.

### Versão 2.1

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Registro da decisão de expansão com execução periódica dedicada no
  ciclo V7.

### Versão 2.2

- Data: `21 de março de 2026`
- Autor(es): `Danilo Melin`
- Descrição: Fechamento operacional do ciclo V7 com consolidação do fluxo
  smoke, completo e nightly.

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

- `docs/E2E_STRATEGY.md`
- `docs/E2E_COVERAGE_V5.md`
- `docs/E2E_CONSOLIDATION_V6.md`
- `docs/E2E_SMOKE_V7.md`
- `docs/E2E_CI_POLICY_V7.md`
- `docs/E2E_EXPANSION_V7.md`

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

- `docs/E2E_CI_POLICY_V7.md`
- `docs/E2E_EXPANSION_V7.md`

### Evidências geradas

O workflow publica artefatos quando executado:

- `playwright-report`
- `playwright-test-results`
- `playwright-smoke-report`
- `playwright-smoke-test-results`
