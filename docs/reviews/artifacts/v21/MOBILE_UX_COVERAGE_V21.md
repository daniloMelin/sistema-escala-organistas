# Mobile UX Coverage V21

## Contexto

Este artefato consolida a cobertura relevante criada, preservada ou
revalidada durante o `V21`.

A diretriz do ciclo foi proteger o que realmente reduz risco de
regressão na experiência mobile, sem transformar todo ajuste visual em
teste automatizado artificial.

## Cobertura por frente

### Painel e formulários de gestão

Arquivos principais:

- `src/test/churchDashboard.test.js`
- `src/test/churchForm.test.js`
- `src/test/organistForm.test.js`

Comportamentos protegidos:

- renderização do painel de gerenciamento de organistas
- fluxo principal de formulários de igreja e organista
- manutenção do comportamento esperado após reorganização responsiva

Valor da cobertura:

- protege a base funcional das telas que receberam ajustes de layout
- reduz risco de o mobile quebrar comportamento central enquanto a UI é
  reorganizada

### Visualização da escala

Arquivo principal:

- `src/test/scheduleGridView.test.js`

Comportamentos protegidos:

- renderização da visualização da escala
- manutenção da estrutura principal da tela mais densa do sistema
- integridade do fluxo de leitura após ajustes de toolbar e cards

Valor da cobertura:

- protege a frente mais sensível do ciclo do ponto de vista visual
- reduz risco de a revisão mobile degradar a estrutura básica da escala

### Gerador e histórico de escalas

Arquivos principais:

- `src/test/useChurchScheduleGenerator.test.js`
- `src/test/scheduleGridView.test.js`

Comportamentos protegidos:

- manutenção do fluxo principal de geração
- integridade da leitura e navegação ligadas à visualização da escala
- estabilidade funcional após ajustes de CTA, retorno e organização do
  histórico

Valor da cobertura:

- conecta os ajustes mobile ao fluxo real de uso da escala
- evita tratar o refinamento responsivo como mero detalhe cosmético

### Fluxo E2E do painel de organistas

Arquivos principais:

- `e2e/helpers/navigation.js`
- `e2e/navigation-initial.spec.js`
- `e2e/organist-validation.spec.js`

Comportamentos protegidos:

- navegação até o painel da igreja com heading atualizado
- validação de fluxo inicial entre gestão e painel
- consistência do fluxo de organistas com a UI atual

Valor da cobertura:

- protege a aderência entre testes ponta a ponta e interface real
- reduz risco de falsos negativos em fluxos operacionais do painel

## Validações executadas

Durante a fase 2 e a consolidação da fase 3, foram executadas
validações focadas na experiência mobile:

- `npm test -- --runTestsByPath src/test/churchDashboard.test.js`
  `src/test/churchForm.test.js src/test/organistForm.test.js`
  `src/test/scheduleGridView.test.js --watchAll=false`
- `npm test -- --runTestsByPath src/test/scheduleGridView.test.js`
  `src/test/useChurchScheduleGenerator.test.js`
  `src/test/churchDashboard.test.js --watchAll=false`
- `npm test -- --runTestsByPath e2e/organist-validation.spec.js`
  `e2e/navigation-initial.spec.js`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

## Lacunas conscientes

O `V21` não tentou automatizar toda percepção visual de mobile.

Lacunas aceitas:

- ergonomia fina de espaçamento em todas as larguras intermediárias
- comparação visual pixel a pixel entre smartphone e desktop
- avaliação subjetiva de conforto visual em jornadas muito longas
- proteção automatizada de todos os ajustes puramente estéticos

Essas lacunas permanecem aceitáveis porque a cobertura consolidada já
protege os fluxos e estruturas mais sensíveis tocados pelo ciclo.
