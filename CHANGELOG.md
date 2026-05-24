# Changelog do Projeto

## Contexto

Este arquivo passa a funcionar como visão executiva da evolução do
projeto.

O detalhamento técnico completo de cada ciclo está concentrado em:

- `docs/reviews/CODE_REVIEW_V2.md` até `docs/reviews/CODE_REVIEW_V22.md`
- `docs/reviews/artifacts/`

## Status atual da documentação

- baseline legada inicial: `docs/reviews/CODE_REVIEW.md`
- trilha canônica de evolução: `V2` até `V22`
- estado atual do sistema: `Preparação para Produção Consolidada`

## Linha do tempo resumida

### Baseline legada

- `CODE_REVIEW.md`
  - documento legado de referência
  - mantido apenas para compatibilidade histórica
  - o conteúdo canônico passa a começar em `V2`

### V2 - Segurança, validação e base estrutural

- migração de credenciais para variáveis de ambiente
- criação das regras iniciais do Firestore
- validações centrais de entrada
- componentes reutilizáveis de UI
- `ErrorBoundary` e primeiros ganhos de organização

Documento principal:

- `docs/reviews/CODE_REVIEW_V2.md`

### V3 - Qualidade técnica e cobertura inicial

- avanço de cobertura em utilitários e hooks críticos
- evolução de padronização de UI
- preparação do terreno para expansão dos testes E2E

Documento principal:

- `docs/reviews/CODE_REVIEW_V3.md`

### V4 - Robustez de produção e segurança operacional

- reforço de robustez com foco em segurança de dados
- evolução do contrato de acesso e confiabilidade de fluxo

Documento principal:

- `docs/reviews/CODE_REVIEW_V4.md`

### V5 a V7 - Fundação e amadurecimento da suíte E2E

- `V5`
  - criação da base de testes E2E
  - cobertura ponta a ponta dos fluxos principais
- `V6`
  - expansão para exclusões, cenários negativos e falhas operacionais
- `V7`
  - evolução da suíte E2E para uso mais confiável no CI
  - melhor recuperação de erro e sustentabilidade da suíte

Documentos principais:

- `docs/reviews/CODE_REVIEW_V5.md`
- `docs/reviews/CODE_REVIEW_V6.md`
- `docs/reviews/CODE_REVIEW_V7.md`

### V8 e V9 - Qualidade documental e rotina operacional

- `V8`
  - limpeza e padronização da documentação com `markdownlint`
- `V9`
  - transformação da qualidade estática em rotina operacional
  - consolidação de políticas em `CONTRIBUTING.md`

Documentos principais:

- `docs/reviews/CODE_REVIEW_V8.md`
- `docs/reviews/CODE_REVIEW_V9.md`

### V10 a V12 - Histórico de escalas

- `V10`
  - evolução da visibilidade do histórico de escalas
- `V11`
  - busca textual no histórico
- `V12`
  - filtro por período para consulta operacional

Documentos principais:

- `docs/reviews/CODE_REVIEW_V10.md`
- `docs/reviews/CODE_REVIEW_V11.md`
- `docs/reviews/CODE_REVIEW_V12.md`

### V13 - Modelo de culto por igreja

- configuração do modelo de culto por igreja
- alinhamento entre cadastro, geração, visualização e PDF
- preservação da lógica de `RJM`

Documento principal:

- `docs/reviews/CODE_REVIEW_V13.md`

### V14 e V15 - Lista de igrejas e visão operacional

- `V14`
  - resumo operacional por igreja na listagem
- `V15`
  - priorização e ordenação da lista de igrejas
  - redução do esforço de decisão para quem administra várias igrejas

Documentos principais:

- `docs/reviews/CODE_REVIEW_V14.md`
- `docs/reviews/CODE_REVIEW_V15.md`

### V16 - Ensaio local por igreja

- cadastro estruturado do ensaio local
- edição e persistência por igreja
- exibição do ensaio local na experiência principal
- base preparada para visualização e PDF

Documento principal:

- `docs/reviews/CODE_REVIEW_V16.md`

### V17 - Qualidade de formulários

- melhoria de validação para igrejas e organistas
- erros por campo
- redução de ambiguidade de preenchimento
- remoção do `Código` da experiência principal
- alinhamento entre interface, validação e Firestore

Documento principal:

- `docs/reviews/CODE_REVIEW_V17.md`

### V18 - Consistência operacional dos fluxos principais

- revisão ponta a ponta dos fluxos de igreja, organistas, escala e PDF
- correção de inconsistências operacionais reais antes de novos ciclos
- ampliação de cobertura apenas onde reduz risco de regressão

Documento principal:

- `docs/reviews/CODE_REVIEW_V18.md`

### V19 - Qualidade final do PDF

- refinamento visual do PDF em folha `A4`
- ajuste estrutural da grade principal em cenários densos
- compactação do resumo do período e do ensaio local
- consolidação de cobertura e impacto específicos do exportador

Documento principal:

- `docs/reviews/CODE_REVIEW_V19.md`

### V20 - Regras de negócio da geração da escala

- refinamento da justiça global de distribuição
- melhoria da composição de `Culto + Reserva`
- preservação melhor de organistas escassas no modelo com `3` funções
- consolidação de cobertura e impacto específicos do algoritmo

Documento principal:

- `docs/reviews/CODE_REVIEW_V20.md`

### V21 - Consolidação da experiência mobile

- reorganização responsiva do painel, listas e formulários principais
- refinamento da visualização da escala em smartphone
- melhoria do fluxo vertical no gerador e no histórico de escalas
- consolidação de cobertura e impacto específicos do uso mobile

Documento principal:

- `docs/reviews/CODE_REVIEW_V21.md`

### V22 - Preparação para produção

- fechamento da trilha com foco em prontidão operacional
- endurecimento da configuração do Firebase e dos serviços principais
- consolidação de impacto e cobertura da prontidão técnica mínima

Documento principal:

- `docs/reviews/CODE_REVIEW_V22.md`

## Como usar este changelog

Use este arquivo para:

- entender rapidamente a evolução do projeto
- localizar o ciclo certo para leitura aprofundada
- explicar o momento atual do sistema sem abrir todos os artefatos

Para análise detalhada, use sempre os documentos em `docs/reviews/` e
os artefatos específicos de cada ciclo.
