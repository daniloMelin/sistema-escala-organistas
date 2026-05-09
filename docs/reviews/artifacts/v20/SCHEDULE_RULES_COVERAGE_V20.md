# Schedule Rules Coverage V20

## Contexto

Este artefato consolida a cobertura relevante criada ou ampliada durante
o `V20`.

A diretriz do ciclo foi proteger o que realmente reduz risco de
regressão no algoritmo, sem transformar toda percepção de justiça em
teste automatizado.

## Cobertura por frente

### Justiça global em slots simples

Arquivo principal:

- `src/test/scheduleLogic.test.js`

Comportamentos protegidos:

- prioridade para menor carga total antes de zerar contagem por função
- distribuição equilibrada entre organistas com mesma disponibilidade
- preservação da regra de repetição de função quando houver alternativa

Valor da cobertura:

- protege a mudança mais direta na noção de justiça global
- reduz risco de regressão para escolhas localmente válidas, mas
  globalmente concentradas

### Dupla `Culto + Reserva`

Arquivo principal:

- `src/test/scheduleLogic.test.js`

Comportamentos protegidos:

- preenchimento de `Culto` e `Reserva` com pessoas diferentes
- alternância funcional quando há alternativa viável
- escolha da dupla mais leve em cenário com histórico desigual

Valor da cobertura:

- protege a composição da dupla como regra de negócio, não só como
  preenchimento pontual
- reduz risco de reforçar concentrações por escolha oportunista do par

### Modelo com três funções

Arquivo principal:

- `src/test/scheduleLogic.test.js`

Comportamentos protegidos:

- preenchimento dos três slots com nomes distintos
- melhor distribuição de carga total em dias recorrentes
- preservação de trio mais flexível quando há organista escassa
  disponível, mas não necessária

Valor da cobertura:

- protege o cenário mais denso e sensível da lógica atual
- reduz risco de a escassez ser tratada de forma agressiva demais

### Fluxo de geração e restrições do sistema

Arquivo principal:

- `src/test/useChurchScheduleGenerator.test.js`

Arquivo de apoio:

- `src/test/validation.test.js`

Comportamentos protegidos:

- manutenção da regra de período fechado de `3` meses
- integração entre geração da lógica e fluxo principal da aplicação
- coerência entre bloqueio de período e geração de escala válida

Valor da cobertura:

- conecta a regra de negócio ao fluxo real do sistema
- evita analisar o algoritmo como peça isolada da jornada operacional

## Validações executadas

Durante a fase 2 e a consolidação da fase 3, foram executadas
validações focadas na regra de negócio:

- `npm test -- --runTestsByPath src/test/scheduleLogic.test.js`
  `src/test/useChurchScheduleGenerator.test.js`
  `src/test/validation.test.js --watchAll=false`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

## Lacunas conscientes

O `V20` não tentou automatizar toda percepção de justiça da escala.

Lacunas aceitas:

- leitura subjetiva de justiça em períodos maiores do que os cenários de
  teste
- desempates muito finos com impacto apenas perceptivo
- influência de contexto humano de igreja que não está modelado no
  algoritmo atual
- comparação qualitativa entre duas distribuições igualmente válidas

Essas lacunas permanecem aceitáveis porque a cobertura criada já
protege as decisões estruturais mais sensíveis do algoritmo atual.
