# Production Readiness Coverage V22

## Contexto

Este artefato consolida a cobertura relevante criada ou revalidada
durante o `V22`.

A diretriz do ciclo foi proteger os comportamentos que realmente reduzem
risco de produção: prontidão de configuração, falha controlada de
serviços e integridade mínima do app fora do contexto `E2E`.

## Cobertura por frente

### Prontidão de configuração do Firebase

Arquivo principal:

- `src/test/firebaseRuntimeConfig.test.js`

Comportamentos protegidos:

- identificação de configuração válida e inválida do Firebase
- distinção entre ambiente normal e contexto `E2E`
- retorno explícito de estado de prontidão e mensagem de erro

Valor da cobertura:

- protege o novo contrato de inicialização da aplicação
- reduz risco de regressão em variáveis obrigatórias de ambiente

### Serviços principais em ambiente incompleto

Arquivo principal:

- `src/test/firebaseServiceReadiness.test.js`

Comportamentos protegidos:

- falha controlada do `firebaseService` quando o Firestore não está
  pronto fora do `E2E`
- preservação do comportamento seguro ao acessar operações principais de
  persistência

Valor da cobertura:

- garante que a camada de serviço não volte a operar sobre um ambiente
  inválido de forma silenciosa
- protege o bloco mais sensível do endurecimento técnico do `V22`

### Integridade dos hooks principais

Arquivos principais:

- `src/test/useChurchManager.test.js`
- `src/test/useChurchDashboard.test.js`
- `src/test/useChurchScheduleGenerator.test.js`

Comportamentos protegidos:

- manutenção do fluxo principal de igrejas, organistas e geração após o
  endurecimento de configuração
- preservação da integração funcional com a camada de serviços

Valor da cobertura:

- confirma que o bloco de prontidão não degradou os fluxos centrais da
  aplicação
- reduz risco de a segurança adicional quebrar comportamentos já
  consolidados

### Build e validações de qualidade

Validações principais:

- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`
- `npm run build`

Comportamentos protegidos:

- consistência estática do código após o endurecimento
- integridade da documentação do ciclo
- capacidade de geração da build de produção

Valor da cobertura:

- conecta o endurecimento técnico à publicação real do projeto
- evita tratar prontidão de produção como algo apenas conceitual

## Validações executadas

Durante a fase 2 e a consolidação da fase 3, foram executadas
validações focadas em prontidão para produção:

- `npm test -- --runTestsByPath src/test/firebaseRuntimeConfig.test.js`
  `src/test/firebaseServiceReadiness.test.js`
  `src/test/useChurchManager.test.js src/test/useChurchDashboard.test.js`
  `src/test/useChurchScheduleGenerator.test.js --watchAll=false`
- `npm test -- --runTestsByPath src/test/firebaseRuntimeConfig.test.js`
  `src/test/firebaseServiceReadiness.test.js --watchAll=false`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`
- `npm run build`

## Lacunas conscientes

O `V22` não tentou transformar prontidão de produção em cobertura total.

Lacunas aceitas:

- validação real de credenciais e projeto Firebase no ambiente final
- operação de deploy ponta a ponta fora do ambiente local
- observação manual das regras do Firestore em uso real com usuários
  reais
- monitoramento pós-publicação

Essas lacunas permanecem aceitáveis porque a cobertura consolidada já
protege o que o ciclo de revisão efetivamente alterou e fortaleceu.
