# Guia de Testes E2E

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                              |
| ------ | ------------------ | ------------ | ----------------------------------------------------------------- |
| 1.0    | 1 de março de 2026 | Danilo Melin | Criação do guia inicial de execução dos testes E2E com Playwright |

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
- em ambiente local, reutiliza servidor existente quando disponível
- gera relatório HTML em `playwright-report/`
- mantém screenshot, vídeo e trace apenas em falhas/retries configurados

## Escopo atual da Fase 1.1

Teste inicial implementado:

- smoke test da tela inicial de autenticação

Arquivo inicial:

- `e2e/auth-smoke.spec.js`

## Próximos passos

1. Definir estratégia de autenticação para ambiente E2E.
2. Definir massa mínima de dados para fluxos críticos.
3. Expandir para cadastro de igreja, organista e geração de escala.
