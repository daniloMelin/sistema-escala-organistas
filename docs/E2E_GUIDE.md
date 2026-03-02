# Guia de Testes E2E

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                              |
| ------ | ------------------ | ------------ | ----------------------------------------------------------------- |
| 1.0    | 1 de março de 2026 | Danilo Melin | Criação do guia inicial de execução dos testes E2E com Playwright |
| 1.1    | 2 de março de 2026 | Danilo Melin | Atualização do guia com modo E2E controlado, autenticação local e helper de sessão |

## Objetivo

Documentar a base inicial de testes ponta a ponta do projeto.

## Stack adotada

- Runner E2E: `Playwright`
- Navegador inicial padrão: `Chromium`
- Diretório de testes: `e2e/`

## Scripts disponíveis

```bash
npm run test:e2e
npm run test:e2e:ui
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

Modo interativo do Playwright:

```bash
npm run test:e2e:ui
```

## Comportamento da configuração atual

- o Playwright sobe automaticamente a aplicação com `npm start`
- a URL base padrão é `http://127.0.0.1:3000`
- a aplicação é iniciada com `REACT_APP_E2E_MODE=true`
- em ambiente local, reutiliza servidor existente quando disponível
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

## Estratégia de ambiente e dados

Documento complementar:

- `docs/E2E_STRATEGY.md`

## Próximos passos

1. Expandir para cadastro de igreja, organista e geração de escala.
2. Introduzir helpers de massa de dados por cenário.
3. Integrar execução E2E ao CI de forma progressiva.
