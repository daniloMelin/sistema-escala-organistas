# Production Readiness Review V22

## Contexto

O `V22` funciona como ciclo de preparação para produção. O objetivo é
consolidar um checklist mínimo de prontidão e reduzir riscos antes de um
uso mais estável em ambiente real.

## Eixos de revisão do ciclo

- dados e persistência
- autenticação e segurança
- build, deploy e operação
- mensagens de erro e comportamento mínimo em produção

## Checklist consolidado da fase 1

O `V22` parte de uma base funcional mais madura do que os ciclos
anteriores. O `V18` estabilizou fluxos principais, o `V19` e o `V21`
trataram qualidade perceptiva, e o `V20` consolidou a regra de negócio.
Agora o foco passa a ser prontidão operacional para um uso mais estável
fora do contexto de refinamento contínuo.

Os pontos mais sensíveis observados para a fase 2 são:

- dependências explícitas de dados ou fluxos pensados para `E2E`
- regras de acesso e persistência que precisam ser defensáveis em uso
  real
- mensagens de erro e recuperação que ainda podem depender demais de
  contexto manual
- checklist de build e deploy sem ambiguidade antes de go-live

## Critérios de aceite do ciclo

### 1. Dados e persistência coerentes

- o sistema deve operar sem depender de dados de teste persistidos
- leitura e escrita precisam estar alinhadas entre interface e Firestore
- inconsistências legadas devem ser explícitas e tratadas como risco ou
  correção

### 2. Autenticação e segurança minimamente defensáveis

- o fluxo de login precisa estar claro para uso real
- o modo `E2E` não pode contaminar o comportamento esperado de produção
- regras do Firestore precisam refletir o modelo de acesso por usuário

### 3. Operação previsível

- build e deploy precisam ter um checklist objetivo
- falhas operacionais relevantes devem ter mensagens compreensíveis
- o comportamento mínimo em produção deve ser conhecido antes de go-live

### 4. Separação entre bloqueante e secundário

- o ciclo precisa distinguir o que impede produção do que apenas merece
  evolução futura
- pendências residuais devem ficar documentadas com risco aceito

## Frentes prioritárias da fase 2

### 1. Dados e base local

Objetivo: revisar resíduos de contexto de teste e coerência mínima da
persistência.

Checklist:

- validar se há dependência indevida de estado `E2E`
- revisar coerência entre dados salvos, dados exibidos e dados usados
  pelos hooks principais
- mapear pontos em que legado ainda influencia a experiência real

Sinais de reprovação:

- fluxo real dependente de seed ou estado artificial
- inconsistência entre interface e persistência
- legado tratado como funcionalidade sem decisão explícita

### 2. Autenticação e regras

Objetivo: revisar o que protege acesso e escrita antes de produção.

Checklist:

- validar fluxo normal de autenticação
- revisar comportamento esperado quando `E2E` não está ativo
- conferir se regras do Firestore acompanham o modelo real de acesso

Sinais de reprovação:

- bypass de autenticação fora de contexto controlado
- regra permissiva demais para leitura ou escrita
- diferença relevante entre uso local e uso real

### 3. Operação e deploy

Objetivo: consolidar o mínimo operacional para publicação estável.

Checklist:

- validar build local limpa
- revisar comandos e sequência mínima de deploy
- revisar mensagens de erro e fallback em casos críticos

Sinais de reprovação:

- build ou deploy com passos implícitos demais
- erro crítico sem feedback útil
- fluxo operacional dependente de conhecimento informal

## Diretriz de execução da fase 2

1. corrigir primeiro o que impede uso real com segurança
2. tratar contexto de teste como apoio, não como comportamento padrão
3. registrar risco residual só depois de separar o que é bloqueante
4. manter foco em prontidão operacional, não em abrir novo ciclo de
   refinamento amplo

## Resultado esperado do ciclo

Ao final do `V22`, o projeto deve ter uma decisão mais objetiva sobre
prontidão para produção, com pendências críticas claramente separadas do
que pode ficar para evolução posterior.
