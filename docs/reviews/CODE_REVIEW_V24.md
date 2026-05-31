# Code Review V24

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                           |
| ------ | ------------------ | ------------ | ---------------------------------------------- |
| 1.0    | 30 de maio de 2026 | Danilo Melin | Criação do ciclo V24                           |
| 1.1    | 30 de maio de 2026 | Danilo Melin | Estruturação do ciclo de bundle e lazy loading |

## Objetivo

Reduzir o peso do bundle inicial e tornar o carregamento por rota mais
eficiente, com foco em lazy loading deliberado, corte de dependências
fora da rota crítica e melhoria da experiência inicial em produção.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Contexto: ciclo derivado do baseline do `V23`, a ser executado após os
  ajustes mais urgentes de estabilidade visual e `LCP`

## Diretriz de Prioridade

1. Tirar da rota inicial o que não participa da experiência crítica
2. Favorecer carregamento progressivo por fluxo de uso
3. Evitar regressão de UX ao ganhar score
4. Medir impacto real antes de abrir novas abstrações

## Diagnóstico Inicial

- o baseline do `V23` apontou JavaScript inicial acima do ideal nas três
  telas avaliadas
- o bundle principal ainda carrega mais do que a home, a lista e o
  dashboard precisam para renderizar cedo
- partes como geração avançada, histórico e exportação em PDF merecem
  revisão de carregamento sob demanda

## Escopo Previsto

### 1. Bundle principal

- revisar o que entra em `main.js`
- identificar dependências que podem sair da rota crítica
- revisar custo do fluxo autenticado logo após o login

### 2. Lazy loading por fluxo

- revisar componentes que podem ser carregados por interação
- revisar pontos em que `React.lazy` ou import dinâmico fazem sentido
- validar se o shell continua estável com divisão de carga

### 3. Caminhos de PDF e histórico

- revisar dependências ligadas ao exportador e histórico
- reduzir impacto no carregamento inicial das rotas principais

### 4. Consolidação do ciclo

- registrar impacto real na carga inicial
- consolidar cobertura mínima das mudanças de carregamento

## Fases Propostas

### Fase 1 - Mapeamento de carga inicial

Objetivo:

- consolidar um mapa do que entra cedo demais no bundle
- separar corte provável de corte arriscado
- priorizar dependências e componentes fora da rota crítica

Saídas esperadas:

- artefato base com oportunidades de divisão de bundle
- checklist inicial de lazy loading por fluxo

### Fase 2 - Ajustes de bundle e lazy loading

Objetivo:

- aplicar divisões de carga com melhor relação risco/benefício
- reduzir o custo da rota inicial e do shell autenticado
- validar que a percepção de uso não piora

Saídas esperadas:

- ajustes rastreáveis no bundle principal e nos imports por rota
- validação focal do carregamento após login e nos fluxos mais usados

### Fase 3 - Cobertura e impacto

Objetivo:

- consolidar o ganho de bundle e carregamento
- registrar o que ficou protegido por teste ou validação
- separar otimização feita de otimização futura

Saídas esperadas:

- documento de impacto do `V24`
- documento de cobertura do `V24`

### Fase 4 - Fechamento

Objetivo:

- encerrar formalmente o ciclo
- deixar baseline comparável para nova rodada de Lighthouse

Saídas esperadas:

- `CODE_REVIEW_V24.md` marcado como concluído
- recomendação objetiva sobre próximos refinamentos

## Critérios de Saída Propostos

- redução mensurável de JavaScript carregado cedo
- shell inicial preservado ou melhorado
- rotas principais mais leves sem perda de previsibilidade
- evidência técnica suficiente para comparar antes e depois

## Registro de Progresso

- [x] Estrutura inicial do V24 criada
- [ ] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V24

1. usar o `V23` como baseline de decisão para o que sai do bundle
   inicial
2. revisar especialmente `src/App.js`,
   `src/components/ChurchScheduleGenerator.js`,
   `src/components/ScheduleHistoryList.js` e
   `src/utils/pdfGenerator.js`
3. definir se o exportador de PDF entra como lazy loading direto ou como
   refino de fluxo secundário

## Artefatos Planejados

- `docs/reviews/artifacts/v24/BUNDLE_LOADING_REVIEW_V24.md`
- `docs/reviews/artifacts/v24/BUNDLE_LOADING_IMPACT_V24.md`
- `docs/reviews/artifacts/v24/BUNDLE_LOADING_COVERAGE_V24.md`
