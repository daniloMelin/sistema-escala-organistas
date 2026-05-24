# Code Review V22

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                              |
| ------ | ------------------- | ------------ | ------------------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V22                              |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de preparação para produção |
| 1.2    | 19 de maio de 2026  | Danilo Melin | Consolidação da fase 1 do V22                     |
| 1.3    | 24 de maio de 2026  | Danilo Melin | Endurecimento inicial de configuração e serviços  |
| 1.4    | 24 de maio de 2026  | Danilo Melin | Consolidação da fase 2 do V22                     |
| 1.5    | 24 de maio de 2026  | Danilo Melin | Consolidação da fase 3 do V22                     |

## Objetivo

Preparar o sistema para uma transição mais segura entre fase de testes e
uso em ambiente real, consolidando critérios mínimos de produção,
segurança operacional e confiabilidade.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `19 de maio de 2026`
- Data de encerramento: `em aberto`
- Contexto: fechamento da trilha de refinamento antes de considerar uso mais estável em produção

## Diretriz de Prioridade

1. Reduzir risco operacional antes da produção
2. Consolidar regras, autenticação e persistência
3. Limpar dependências de dados de teste e ajustes temporários
4. Fechar o ciclo com checklist objetivo de go-live

## Diagnóstico Inicial

- o sistema ainda opera em contexto de refinamento e teste manual
- parte das decisões atuais foi tomada com custo baixo de mudança, o que é bom agora
- antes de produção, vale revisar base de dados, autenticação, mensagens de erro e deploy
- o critério de “funciona localmente” precisa evoluir para “está pronto para operar”

## Escopo Previsto

### 1. Dados e persistência

- revisar dados de teste existentes
- revisar necessidade de limpeza ou normalização
- revisar coerência entre interface, serviços e Firestore

### 2. Autenticação e segurança

- revisar fluxo de login
- revisar comportamento do modo `E2E`
- revisar regras do Firestore e acesso por usuário

### 3. Operação e deploy

- revisar checklist de build e deploy
- revisar mensagens de erro relevantes
- revisar comportamento mínimo esperado em produção

### 4. Consolidação do ciclo

- consolidar checklist de preparação para produção
- documentar risco residual aceito
- fechar o ciclo com recomendação clara de próximo passo

## Fases Propostas

### Fase 1 - Checklist de produção

Objetivo:

- mapear requisitos mínimos para uso real
- separar pendência bloqueante de pendência secundária
- consolidar critérios de aceite do ciclo

Saídas esperadas:

- artefato base do ciclo com checklist de prontidão para produção
- priorização dos blocos que precisam ser tratados antes de go-live

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v22/PRODUCTION_READINESS_REVIEW_V22.md`
- checklist inicial definido para dados, autenticação, regras,
  observabilidade mínima e operação de deploy
- pendências priorizadas entre:
  - bloqueios de segurança ou acesso
  - dependências explícitas de ambiente de teste
  - risco operacional de persistência ou erro pouco tratável
  - ajustes secundários que não impedem avaliação de go-live
- diretriz de execução definida: atacar primeiro o que pode comprometer
  uso real, e não o que apenas melhora acabamento técnico

### Fase 2 - Ajustes e endurecimento

Objetivo:

- corrigir o que for crítico para produção
- revisar persistência, autenticação e regras
- reduzir dependências de contexto de teste

Saídas esperadas:

- ajustes rastreáveis nos pontos que impedem uso real com segurança
- validação técnica dos blocos endurecidos para produção

Execução inicial:

- configuração do Firebase passou a validar todos os campos obrigatórios
  antes da inicialização fora do modo `E2E`
- a aplicação passou a bloquear a navegação principal com mensagem
  explícita quando a configuração do Firebase está incompleta
- `Auth`, `firebaseService` e o reporter do Firestore passaram a tratar
  ausência de configuração válida de forma controlada, sem depender de
  runtime opaco
- cobertura adicionada para:
  - utilitário de prontidão de configuração do Firebase
  - falha explícita do `firebaseService` quando a configuração está
    incompleta
- validações executadas neste bloco:
  - `npm test -- --runTestsByPath src/test/firebaseRuntimeConfig.test.js`
    `src/test/firebaseServiceReadiness.test.js`
    `src/test/useChurchManager.test.js src/test/useChurchDashboard.test.js`
    `src/test/useChurchScheduleGenerator.test.js --watchAll=false`
  - `npm run lint -- --max-warnings=0`
  - `npm run format:check`
  - `npm run build`

Resultado consolidado:

- Status: `CONCLUÍDO`
- risco de iniciar a aplicação com configuração inválida do Firebase foi
  reduzido de forma explícita
- serviços principais deixaram de assumir `db/auth` válidos
  silenciosamente fora do `E2E`
- build de produção segue íntegra após o endurecimento inicial
- reporter passou a tratar ausência de `auth` de forma segura no fluxo
  de produção
- revisão da fase não identificou dependência indevida de `.env.local`
  no repositório nem bypass de `E2E` fora do host e porta controlados
- o bloco foi consolidado com foco em prontidão de configuração e
  comportamento mínimo seguro antes do login

### Fase 3 - Validação final

Objetivo:

- consolidar evidências técnicas do ciclo
- registrar riscos aceitos e mitigados
- preparar recomendação de go-live ou de novo ciclo

Saídas esperadas:

- artefatos de impacto e cobertura da preparação para produção
- recomendação explícita sobre prontidão técnica mínima do sistema

Resultado consolidado:

- Status: `CONCLUÍDO`
- impactos e evidências registrados em:
  - `docs/reviews/artifacts/v22/PRODUCTION_READINESS_IMPACT_V22.md`
  - `docs/reviews/artifacts/v22/PRODUCTION_READINESS_COVERAGE_V22.md`
- o ciclo consolidou que o maior ganho do `V22` foi trocar falhas opacas
  de inicialização e acesso a serviços por bloqueios explícitos e
  tratáveis antes do uso normal da aplicação
- a cobertura criada protege o caminho de configuração obrigatória do
  Firebase e a reação dos serviços principais quando o ambiente não está
  pronto para uso real
- o risco residual aceito deixa de ser técnico imediato e passa a ser de
  decisão operacional de go-live, especialmente na conferência final de
  credenciais, regras e rotina de publicação
- a recomendação desta fase é considerar o sistema tecnicamente mais
  pronto para produção do que no início do ciclo, com fechamento formal
  ainda dependente da consolidação da fase 4

### Fase 4 - Fechamento

- encerrar formalmente o ciclo
- consolidar baseline para ambiente estável

## Critérios de Saída Propostos

- checklist de produção consolidado
- pendências críticas identificadas e tratadas
- autenticação, regras e persistência revisadas
- decisão documentada sobre prontidão para produção

## Registro de Progresso

- [x] Estrutura inicial do V22 criada
- [x] Fase 1 concluída
- [x] Fase 2 concluída
- [x] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V22

1. encerrar formalmente o ciclo com decisão clara sobre prontidão
   mínima para produção
2. registrar no fechamento o risco residual aceito para operação real
3. consolidar baseline documental antes de qualquer go-live mais amplo

## Artefatos da Fase 1

- `docs/reviews/artifacts/v22/PRODUCTION_READINESS_REVIEW_V22.md`

## Artefatos da Fase 3

- `docs/reviews/artifacts/v22/PRODUCTION_READINESS_IMPACT_V22.md`
- `docs/reviews/artifacts/v22/PRODUCTION_READINESS_COVERAGE_V22.md`
