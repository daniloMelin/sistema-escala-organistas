# Performance Coverage V23

## Contexto

Este artefato consolida a cobertura relevante criada ou revalidada
durante o `V23`.

A diretriz do ciclo foi proteger os comportamentos que efetivamente
sustentam a nova estabilidade visual do shell autenticado, sem expandir
testes em áreas que o ciclo não alterou.

## Cobertura por frente

### Dashboard e carregamento por rota

Arquivos principais:

- `src/test/churchDashboard.test.js`
- `src/test/useChurchDashboard.test.js`

Comportamentos protegidos:

- fallback do dashboard para a igreja carregada pela rota
- exibição coerente do ensaio local em acessos diretos
- proteção contra contexto `selectedChurch` divergente da rota atual

Valor da cobertura:

- reduz risco de regressão na consistência entre contexto e URL
- protege o bloco que sustentou a redução de `CLS` no dashboard

### Lista de igrejas e shell inicial

Arquivos principais:

- `src/test/churchList.test.js`
- `src/test/useChurchManager.test.js`

Comportamentos protegidos:

- carregamento da lista base antes do enriquecimento completo
- manutenção do resumo operacional após a reorganização do shell

Valor da cobertura:

- protege a renderização mais cedo da lista
- ajuda a evitar que a tela volte a depender de hidratação tardia para
  parecer útil

### Gerador e histórico

Arquivos principais:

- `src/test/useChurchScheduleGenerator.test.js`
- `src/test/scheduleHistoryList.test.js`
- `src/test/scheduleControls.test.js`
- `src/test/scheduleGridView.test.js`

Comportamentos protegidos:

- carregamento paralelo de igreja, organistas e histórico
- reabertura de escalas salvas com período preservado
- exportação usando a igreja correta da rota quando o contexto estiver
  stale
- consistência da grade e do histórico após a estabilização do shell

Valor da cobertura:

- protege a parte mais sensível do `V23` depois do dashboard
- evita regressão silenciosa em metadados exibidos e exportados

### Qualidade estática e documentação

Validações principais:

- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

Valor da cobertura:

- garante consistência estática do ciclo
- preserva o padrão documental que sustenta a trilha `V23` a `V25`

## Validações executadas

Durante a fase 2 e a consolidação da fase 3, foram executadas
validações focadas nas áreas alteradas:

- `npm test -- --runTestsByPath src/test/churchDashboard.test.js`
  `src/test/churchList.test.js src/test/useChurchManager.test.js`
  `src/test/useChurchDashboard.test.js --watchAll=false`
- `npm test -- --runTestsByPath`
  `src/test/useChurchScheduleGenerator.test.js`
  `src/test/scheduleHistoryList.test.js`
  `src/test/scheduleControls.test.js --watchAll=false`
- `npm test -- --runTestsByPath src/test/scheduleHistoryList.test.js`
  `src/test/scheduleControls.test.js src/test/scheduleGridView.test.js`
  `--watchAll=false`
- `npm test -- --runTestsByPath src/test/churchDashboard.test.js`
  `src/test/useChurchScheduleGenerator.test.js --watchAll=false`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

## Lacunas conscientes

O `V23` não tentou cobrir performance por score dentro da suíte de
testes automatizados.

Lacunas aceitas:

- medição de Lighthouse continua externa à suíte de testes
- `LCP` e `CLS` seguem dependendo de leitura comparativa em ambiente de
  build/preview/publicação
- `Best Practices` continua com influência externa do fluxo de
  autenticação do Firebase

Essas lacunas permanecem aceitáveis porque a cobertura consolidada já
protege os comportamentos que o ciclo efetivamente alterou.
