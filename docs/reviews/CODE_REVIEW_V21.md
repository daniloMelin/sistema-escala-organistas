# Code Review V21

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                     |
| ------ | ------------------- | ------------ | ---------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V21                     |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de UX mobile final |
| 1.2    | 9 de maio de 2026   | Danilo Melin | Consolidação da fase 1 do V21            |
| 1.3    | 18 de maio de 2026  | Danilo Melin | Ajustes iniciais de UX mobile no V21     |
| 1.4    | 18 de maio de 2026  | Danilo Melin | Passada fina no gerador e histórico      |
| 1.5    | 18 de maio de 2026  | Danilo Melin | Consolidação da fase 2 do V21            |
| 1.6    | 18 de maio de 2026  | Danilo Melin | Consolidação da fase 3 do V21            |

## Objetivo

Consolidar a experiência mobile do sistema, com foco em navegação,
legibilidade, ações críticas e adaptação dos fluxos principais em tela
pequena.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `9 de maio de 2026`
- Data de encerramento: `em aberto`
- Contexto: fechamento da experiência de uso em smartphone após ajustes pontuais anteriores

## Diretriz de Prioridade

1. Garantir leitura clara em smartphone
2. Manter ações críticas acessíveis sem competir com o conteúdo
3. Evitar quebras ruins em formulários, cards e toolbars
4. Fechar o ciclo com checklist real de uso mobile

## Diagnóstico Inicial

- várias telas já receberam correções pontuais de mobile
- ainda vale validar a experiência como conjunto, não só por ajuste isolado
- ações de editar, excluir, gerar escala e baixar PDF continuam sensíveis em tela pequena
- o sistema precisa parecer deliberado no mobile, não apenas “quebrar menos”

## Escopo Previsto

### 1. Igrejas

- revisar gerenciamento de igrejas em smartphone
- revisar formulário e lista de igrejas
- revisar leitura dos cards e ações

### 2. Organistas

- revisar gerenciamento de organistas em smartphone
- revisar ordem de leitura entre conteúdo e ações
- revisar tamanho e alinhamento dos botões

### 3. Escala

- revisar tela de geração
- revisar visualização da escala
- revisar toolbar de ações e blocos auxiliares

### 4. Consolidação do ciclo

- registrar impacto da revisão mobile
- consolidar proteção por testes quando fizer sentido
- fechar o ciclo com checklist operacional final

## Fases Propostas

### Fase 1 - Checklist de uso mobile

Objetivo:

- definir telas prioritárias para revisão em smartphone
- listar pontos críticos de interação e leitura
- registrar comportamentos esperados por fluxo mobile

Saídas esperadas:

- artefato base do ciclo com checklist de uso mobile
- priorização das telas que devem ser ajustadas primeiro

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v21/MOBILE_UX_REVIEW_V21.md`
- checklist inicial definido para igreja, organistas, geração de escala
  e visualização mobile
- pontos sensíveis mapeados para:
  - leitura de cards e listas em largura estreita
  - ordem entre conteúdo e ações críticas
  - toolbars com múltiplos botões
  - formulários com campos e mensagens de erro em coluna única
- diretriz de execução definida: corrigir primeiro o que compromete uso
  real em smartphone antes de polir detalhes cosméticos

### Fase 2 - Ajustes visuais e estruturais

Objetivo:

- corrigir quebras ruins
- revisar alinhamento, espaçamento e ordem de leitura
- manter consistência entre mobile e desktop

Saídas esperadas:

- ajustes responsivos rastreáveis nas telas principais
- validação focal dos fluxos mais sensíveis em smartphone

Execução inicial:

- toolbar do painel reorganizada para mobile, removendo larguras rígidas
  e deixando ações críticas em largura total quando necessário
- listas de igrejas e organistas ajustadas para priorizar leitura do
  conteúdo antes das ações, com botões em grid responsivo
- formulário de igreja e formulário de organista refinados para coluna
  única, com melhor ritmo entre campos, mensagens e ações
- visualização da escala revisada em smartphone para:
  - toolbar com ações mais estáveis
  - distribuição e blocos auxiliares mais legíveis
  - cards da escala em coluna única
  - linhas de função menos comprimidas
- seletores E2E corrigidos para refletir o heading atual de
  `Gerenciamento de Organistas`
- gerador de escala refinado em mobile com:
  - botão de retorno em largura total
  - controles de data mais estáveis em coluna única
  - CTA principal com destaque e largura adequada
- histórico de escalas refinado em smartphone com:
  - cards em coluna única
  - cabeçalho e metadados mais respiráveis
  - ação de visualizar em largura total quando necessário

Resultado consolidado:

- Status: `CONCLUÍDO`
- experiência mobile ficou mais deliberada nas telas de gestão e na
  visualização da escala
- ações críticas passaram a competir menos com o conteúdo em largura
  estreita
- gerador e histórico de escala ganharam melhor ritmo visual em
  smartphone, com menos compressão de ações e metadados
- fluxo mobile do gerador passou a respeitar melhor a leitura vertical,
  com CTA principal e retorno mais previsíveis
- histórico de escalas ganhou leitura mais clara em cards e metadados em
  largura estreita
- cobertura existente de componentes relevantes continuou íntegra após os
  ajustes responsivos aplicados

### Fase 3 - Cobertura e impacto

Objetivo:

- registrar o que ficou protegido por teste
- consolidar impacto prático da revisão
- separar pendência residual de aprovação final

Saídas esperadas:

- documento de impacto do `V21`
- documento de cobertura do `V21`

Resultado consolidado:

- Status: `CONCLUÍDO`
- impacto funcional registrado em
  `docs/reviews/artifacts/v21/MOBILE_UX_IMPACT_V21.md`
- cobertura consolidada em
  `docs/reviews/artifacts/v21/MOBILE_UX_COVERAGE_V21.md`
- proteção organizada por fluxo mobile de gestão, visualização da
  escala, gerador e histórico
- risco residual separado entre ergonomia fina de smartphone e
  diferenças aceitáveis de densidade em relação ao desktop

### Fase 4 - Fechamento

- encerrar formalmente o ciclo
- deixar base pronta para preparação de produção

## Critérios de Saída Propostos

- telas principais navegáveis em smartphone
- ações críticas estáveis em mobile
- regressões visuais relevantes tratadas
- impacto e cobertura consolidados na documentação

## Registro de Progresso

- [x] Estrutura inicial do V21 criada
- [x] Fase 1 concluída
- [x] Fase 2 concluída
- [x] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V21

1. encerrar formalmente o ciclo do V21
2. consolidar resumo executivo, artefatos e impacto prático final
3. preparar a transição para o próximo ciclo após o fechamento

## Artefatos da Fase 1 e 2

- `docs/reviews/artifacts/v21/MOBILE_UX_REVIEW_V21.md`

## Artefatos da Fase 3

- `docs/reviews/artifacts/v21/MOBILE_UX_IMPACT_V21.md`
- `docs/reviews/artifacts/v21/MOBILE_UX_COVERAGE_V21.md`
