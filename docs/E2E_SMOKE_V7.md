# Smoke E2E V7

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                   |
| ------ | ------------------ | ------------ | ---------------------------------------------------------------------- |
| 1.0    | 21 de março de 2026 | Danilo Melin | Definição inicial do subconjunto smoke para pull requests no ciclo V7 |

## Objetivo

Definir o subconjunto mínimo de testes E2E com melhor custo x valor para rodar com frequência alta em pull requests, sem substituir a suíte completa.

## Critérios de Seleção

Um cenário entra no smoke quando atende simultaneamente aos seguintes critérios:

- valida um fluxo central de entrada ou navegação da aplicação
- cobre um comportamento com alta visibilidade para o usuário
- tem baixa dependência de massa complexa de dados
- apresenta execução estável e curta
- ajuda a detectar regressão estrutural cedo

Um cenário fica fora do smoke quando:

- cobre regra de negócio mais profunda, mas não essencial para toda PR
- depende de grande quantidade de setup
- aumenta custo de execução sem ganho proporcional de sinal
- já está melhor protegido pela suíte completa sob gatilho controlado

## Subconjunto Smoke Inicial

### 1. Entrada na aplicação

- arquivo: `e2e/auth-smoke.spec.js`
- motivo:
  - valida carregamento da tela inicial
  - detecta regressão estrutural do app antes de login

### 2. Navegação inicial autenticada

- arquivo: `e2e/navigation-initial.spec.js`
- cenários de maior valor:
  - carregamento da área principal
  - navegação lista -> painel -> gerador -> painel -> lista
- motivo:
  - cobre a espinha dorsal da navegação após autenticação

### 3. Estados vazios principais

- arquivo: `e2e/empty-states.spec.js`
- motivo:
  - valida UX básica sem massa prévia de dados
  - cobre telas propensas a regressão visual e de fluxo

## Itens Explicitamente Fora do Smoke Inicial

- exclusões de igreja e organista
- validações negativas de formulário
- falhas operacionais controladas
- geração, edição e exportação de escala

Motivo:

- continuam valiosos
- permanecem na suíte completa
- não entram no smoke inicial para manter a PR leve

## Validação Local do Subconjunto

No ciclo V7, a validação local foi feita com base na estabilidade comprovada desses cenários dentro da suíte E2E completa:

- `e2e/auth-smoke.spec.js`
- `e2e/navigation-initial.spec.js`
- `e2e/empty-states.spec.js`

Decisão do ciclo:

- a definição do subconjunto fica concluída nesta fase
- a execução dedicada do smoke e sua integração ao CI entram na Fase 2.2

## Resultado Esperado para a Fase 2.2

- criar comando dedicado do smoke
- integrar smoke automático em PR
- manter a suíte completa via gatilho controlado
