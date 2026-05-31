# Code Review V23

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                           |
| ------ | ------------------ | ------------ | ---------------------------------------------- |
| 1.0    | 30 de maio de 2026 | Danilo Melin | Criação do ciclo V23                           |
| 1.1    | 30 de maio de 2026 | Danilo Melin | Estruturação do ciclo de performance percebida |
| 1.2    | 30 de maio de 2026 | Danilo Melin | Consolidação da fase 1 do V23                  |
| 1.3    | 30 de maio de 2026 | Danilo Melin | Execução inicial da fase 2 do V23              |
| 1.4    | 30 de maio de 2026 | Danilo Melin | Ampliação da fase 2 no fluxo de escala         |
| 1.5    | 31 de maio de 2026 | Danilo Melin | Validação intermediária da home em preview     |
| 1.6    | 31 de maio de 2026 | Danilo Melin | Quick wins de score e estabilidade no V23      |

## Objetivo

Levar a experiência principal do sistema a um baseline mais consistente
de Lighthouse, com foco em performance percebida, estabilidade visual,
acessibilidade residual e higiene técnica de publicação.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `30 de maio de 2026`
- Contexto: primeiro ciclo pós-produção consolidada, voltado a qualidade
  percebida em uso real mobile

## Diretriz de Prioridade

1. Corrigir primeiro o que derruba percepção real de uso
2. Atacar shell autenticado antes de micro-otimizações isoladas
3. Priorizar ganhos repetíveis nas três telas principais
4. Separar problemas de UI, bundle e dependências externas

## Diagnóstico Inicial

- a página inicial já está próxima de um baseline aceitável, mas ainda
  abaixo da meta de `>= 90`
- a lista de igrejas e, principalmente, o dashboard autenticado
  concentram a maior parte da perda de score
- o problema dominante não é CPU pesada, e sim combinação de:
  - `CLS` alto no shell autenticado
  - `LCP` lento nas telas com dados reais
  - JavaScript inicial maior do que o necessário para a rota
- `Accessibility` e `SEO` têm correções menores e objetivas
- `Best Practices` sofre influência do fluxo de cookies de terceiros do
  Firebase Auth e precisa ser tratado com cuidado para separar limitação
  da stack de bug controlável pela aplicação

## Escopo Previsto

### 1. Performance percebida

- revisar shell inicial e carregamento das telas autenticadas
- reduzir deslocamento visual em lista de igrejas e dashboard
- melhorar tempo de exibição útil do conteúdo principal

### 2. Bundle e carregamento

- revisar o que entra no `main.js`
- adiar dependências não críticas para a rota inicial
- reduzir trabalho inicial em telas autenticadas

### 3. Qualidade complementar

- corrigir contraste residual de botões, navegação e rodapé
- corrigir `robots.txt` e higiene básica de publicação
- revisar cache de assets versionados no Hosting

### 4. Consolidação do ciclo

- registrar impacto e cobertura só após separar o que é estrutural do
  que é residual
- manter o ciclo focado em qualidade percebida, não em abrir uma frente
  ampla de refatoração

## Fases Propostas

### Fase 1 - Baseline e plano de ataque

Objetivo:

- consolidar um baseline confiável de Lighthouse em produção
- separar gargalos recorrentes de ruído de execução
- mapear as ações mais prováveis no código antes de implementar

Saídas esperadas:

- artefato base do ciclo com leituras medianas por tela
- priorização objetiva dos blocos que mais impactam a meta de `>= 90`

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v23/PERFORMANCE_BASELINE_REVIEW_V23.md`
- baseline coletado em produção mobile para:
  - página inicial
  - lista de igrejas
  - dashboard de uma igreja
- gargalos recorrentes confirmados:
  - `CLS` muito alto no dashboard
  - `LCP` alto nas telas autenticadas
  - bundle inicial acima do ideal para a rota
  - contraste residual em botões e navegação
  - ausência ou invalidade de `robots.txt`
- diretriz de execução definida: atacar primeiro o shell autenticado e a
  estabilidade visual antes de otimizações menores

### Fase 2 - Ajustes de estabilidade e carregamento

Objetivo:

- reduzir `CLS` e `LCP` nas telas mais críticas
- estabilizar layout inicial e fluxo autenticado
- revisar cache e carga inicial do bundle

Saídas esperadas:

- ajustes rastreáveis no shell autenticado e no carregamento por rota
- validação focal das telas com pior baseline

Execução inicial:

- lista de igrejas passou a renderizar a base de igrejas antes do
  enriquecimento completo do resumo operacional, reduzindo o tempo até a
  primeira leitura útil da tela
- dashboard passou a carregar dados da igreja em paralelo aos dados das
  organistas, deixando de depender apenas de `selectedChurch` em
  acessos diretos por rota
- listas de igrejas e organistas ganharam placeholders de carregamento
  com altura estável para reduzir o salto visual entre estado vazio e
  estado carregado
- shell das telas autenticadas recebeu alturas mínimas e bloco de
  ensaio local em placeholder para reduzir `CLS` do dashboard
- bootstrap da aplicação passou a usar fallback visual estável em vez
  de texto seco de carregamento
- rotas lazy principais passaram a ser pré-carregadas após autenticação
- gerador de escala passou a carregar igreja, organistas e histórico em
  paralelo, com fallback visual mais estável no histórico e no cabeçalho
- validação intermediária em preview channel confirmou ganho claro de
  `CLS` na home, com `0` nas três execuções e `Performance` variando
  entre `76` e `91`
- a leitura parcial reforçou que a estabilidade visual da entrada já
  melhorou, enquanto `LCP`, contraste, `robots.txt` e bundle residual
  permanecem como frente aberta para fechamento completo do ciclo
- rodada adicional do `V23` atacou ganhos rápidos ainda apontados pelo
  Lighthouse:
  - contraste dos botões primário e de sucesso
  - contraste do link ativo da navegação, rodapé e textos secundários
  - criação de `public/robots.txt` válido
  - reserva de espaço para o estado de carregamento do gerador, reduzindo
    salto visual no topo da rota

### Fase 3 - Cobertura e impacto

Objetivo:

- consolidar o ganho real do ciclo
- registrar o que ficou protegido por teste
- separar pendência residual de limitação estrutural externa

Saídas esperadas:

- documento de impacto do `V23`
- documento de cobertura do `V23`

### Fase 4 - Fechamento

Objetivo:

- encerrar formalmente o ciclo
- deixar baseline comparável para a próxima rodada de Lighthouse

Saídas esperadas:

- `CODE_REVIEW_V23.md` marcado como concluído
- recomendação objetiva sobre próximos refinamentos de performance

## Critérios de Saída Propostos

- páginas principais com baseline mais próximo ou acima de `90`
- redução perceptível de `CLS` no shell autenticado
- melhoria de `LCP` nas telas autenticadas
- correções rápidas de acessibilidade e SEO aplicadas

## Registro de Progresso

- [x] Estrutura inicial do V23 criada
- [x] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V23

1. revisar a origem do `CLS` no shell autenticado, com foco em
   `src/App.js`, `src/App.css`, `src/components/ChurchManager.js`,
   `src/components/ChurchManager.css`, `src/components/ChurchDashboard.js`
   e `src/components/ChurchDashboard.css`
2. revisar oportunidades de reduzir `LCP` e JS inicial no fluxo de
   autenticação e dashboard, incluindo `src/components/Auth.js`,
   `src/components/ChurchScheduleGenerator.js`,
   `src/components/ScheduleHistoryList.js` e `src/utils/pdfGenerator.js`
3. planejar correções rápidas de contraste e publicação em
   `src/App.css`, `src/index.css`, `src/components/Auth.css` e
   `firebase.json`
4. confirmar a situação de `public/robots.txt` como frente rápida de
   SEO/higiene técnica
5. repetir a coleta do preview/publicado para igrejas, dashboard e
   gerador, separando o que já é ganho do `V23` do que depende mais do
   corte de bundle do `V24`

## Artefatos da Fase 1

- `docs/reviews/artifacts/v23/PERFORMANCE_BASELINE_REVIEW_V23.md`
