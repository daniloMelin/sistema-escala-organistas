# Smoke E2E V7

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                   |
| ------ | ------------------ | ------------ | ---------------------------------------------------------------------- |
| 1.0    | 21 de março de 2026 | Danilo Melin | Definição inicial do subconjunto smoke para pull requests no ciclo V7 |
| 1.1    | 21 de março de 2026 | Danilo Melin | Integração do subconjunto smoke ao Playwright e ao GitHub Actions      |
| 1.2    | 21 de março de 2026 | Danilo Melin | Inclusão do fluxo real de login E2E no subconjunto smoke              |
| 1.3    | 21 de março de 2026 | Danilo Melin | Redução do smoke para fluxos mais determinísticos após estabilização no CI |

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

### 2. Transição real de autenticação

- arquivo: `e2e/e2e-login.spec.js`
- motivo:
  - valida o fluxo `Entrar em modo E2E`
  - protege a transição da tela pública para a área autenticada
  - detecta regressão no caminho `Auth -> App`

## Ajuste de Estabilidade Aplicado no CI

Após a primeira execução do smoke em PR, os cenários abaixo foram retirados do subconjunto automático:

- `e2e/navigation-initial.spec.js`
- `e2e/empty-states.spec.js`

Motivo:

- dependem de bootstrap autenticado seeded mais sensível ao CI
- seguem valiosos, mas são mais adequados para a suíte completa
- o smoke precisa priorizar determinismo acima de cobertura ampla

## Itens Explicitamente Fora do Smoke Inicial

- exclusões de igreja e organista
- validações negativas de formulário
- falhas operacionais controladas
- navegação seeded após autenticação
- estados vazios seeded
- geração, edição e exportação de escala

Motivo:

- continuam valiosos
- permanecem na suíte completa
- não entram no smoke inicial para manter a PR leve

## Validação Local do Subconjunto

No ciclo V7, a validação local foi feita com base na estabilidade comprovada desses cenários dentro da suíte E2E completa:

- `e2e/auth-smoke.spec.js`
- `e2e/e2e-login.spec.js`

Decisão do ciclo:

- a definição do subconjunto fica concluída nesta fase
- a execução dedicada do smoke e sua integração ao CI entram na Fase 2.2

## Integração Implementada na Fase 2.2

- comando dedicado:
  - `npm run test:e2e:smoke`
- configuração dedicada:
  - `playwright.smoke.config.js`
- workflow automático em PR:
  - `.github/workflows/e2e-smoke.yml`

## Política Atual de Execução

- smoke:
  - executa automaticamente em toda PR para `main`
- suíte completa:
  - continua sob workflow dedicado e gatilho controlado por label/manual

## Resultado Prático

- toda PR passa a validar regressão estrutural básica da tela pública
- toda PR passa a validar a transição real de entrada no sistema
- o custo da automação permanece controlado
- a suíte completa segue disponível para validações mais profundas
