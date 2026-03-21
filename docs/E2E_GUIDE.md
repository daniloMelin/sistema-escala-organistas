# Guia de Testes E2E

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                              |
| ------ | ------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| 1.0    | 1 de março de 2026 | Danilo Melin | Criação do guia inicial de execução dos testes E2E com Playwright                                 |
| 1.1    | 2 de março de 2026 | Danilo Melin | Atualização do guia com modo E2E controlado, autenticação local e helper de sessão                |
| 1.2    | 3 de março de 2026 | Danilo Melin | Padronização dos comandos E2E e adoção de porta dedicada para execução determinística             |
| 1.3    | 3 de março de 2026 | Danilo Melin | Documentação da execução E2E no GitHub Actions com gatilho controlado por label e workflow manual |
| 1.4    | 3 de março de 2026 | Danilo Melin | Referência da cobertura atual da suíte E2E e encaminhamento das lacunas remanescentes             |
| 1.5    | 5 de março de 2026 | Danilo Melin | Consolidação da suíte com revisão de manutenção e recomendação de smoke para próximo ciclo          |
| 1.6    | 21 de março de 2026 | Danilo Melin | Inclusão da referência ao subconjunto smoke definido no ciclo V7                                   |
| 1.7    | 21 de março de 2026 | Danilo Melin | Inclusão do comando smoke e da integração automática no GitHub Actions                             |
| 1.8    | 21 de março de 2026 | Danilo Melin | Ampliação do smoke para incluir o fluxo real de login E2E                                         |
| 1.9    | 21 de março de 2026 | Danilo Melin | Ajuste do smoke para manter apenas fluxos mais determinísticos no CI                              |

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
- a configuração não reutiliza servidor existente, evitando testes contra uma instância fora do modo E2E
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

Os cenários seeded de navegação inicial e estados vazios permanecem na suíte E2E completa.

## Estratégia de ambiente e dados

Documento complementar:

- `docs/E2E_STRATEGY.md`
- `docs/E2E_COVERAGE_V5.md`
- `docs/E2E_CONSOLIDATION_V6.md`
- `docs/E2E_SMOKE_V7.md`

## Próximos passos

1. Integrar o subconjunto smoke ao CI de PR.
2. Revisar periodicamente o conjunto de smoke conforme crescimento da suíte.
3. Reavaliar execução em navegador adicional quando custo de CI permitir.

## Execução no GitHub Actions

O projeto possui um workflow E2E dedicado:

- arquivo: `.github/workflows/e2e.yml`

O projeto também possui um workflow smoke para PR:

- arquivo: `.github/workflows/e2e-smoke.yml`

### Como disparar no CI

Opção 1. Execução manual:

- GitHub > `Actions` > workflow `E2E` > `Run workflow`

Opção 2. Pull request com gatilho controlado:

- adicionar a label `run-e2e` na PR

Smoke automático em PR:

- executado automaticamente em toda PR para `main`
- roda o comando `npm run test:e2e:smoke`

### Motivo do gatilho controlado

- evitar bloquear toda PR desde o início do ciclo
- permitir uso seletivo enquanto a suíte E2E amadurece
- manter o pipeline principal leve

### Evidências geradas

O workflow publica artefatos quando executado:

- `playwright-report`
- `playwright-test-results`
- `playwright-smoke-report`
- `playwright-smoke-test-results`
