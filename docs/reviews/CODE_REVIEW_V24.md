# Code Review V24

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                           |
| ------ | ------------------ | ------------ | ---------------------------------------------- |
| 1.0    | 30 de maio de 2026 | Danilo Melin | Criação do ciclo V24                           |
| 1.1    | 30 de maio de 2026 | Danilo Melin | Estruturação do ciclo de bundle e lazy loading |
| 1.2    | 7 de junho de 2026 | Danilo Melin | Consolidação da fase 1 do V24                  |
| 1.3    | 7 de junho de 2026 | Danilo Melin | Execução inicial da fase 2 do V24              |

## Objetivo

Reduzir o peso do bundle inicial e tornar o carregamento por rota mais
eficiente, com foco em lazy loading deliberado, corte de dependências
fora da rota crítica e melhoria da experiência inicial em produção.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `7 de junho de 2026`
- Contexto: ciclo derivado do baseline do `V23`, agora aberto após o
  fechamento completo do bloco de estabilidade visual

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

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v24/BUNDLE_LOADING_REVIEW_V24.md`
- mapeamento inicial confirmou três frentes principais de corte:
  - `main.3557ff9d.js` ainda grande para a rota crítica
  - `pdfGenerator` importado cedo demais no fluxo do gerador
  - shell autenticado e autenticação ainda puxando dependências cedo no
    ciclo de carregamento
- o ciclo passa a priorizar o que pode sair da carga inicial sem reabrir
  problemas de `CLS`

### Fase 2 - Ajustes de bundle e lazy loading

Objetivo:

- aplicar divisões de carga com melhor relação risco/benefício
- reduzir o custo da rota inicial e do shell autenticado
- validar que a percepção de uso não piora

Saídas esperadas:

- ajustes rastreáveis no bundle principal e nos imports por rota
- validação focal do carregamento após login e nos fluxos mais usados

Execução inicial:

- o primeiro corte do `V24` removeu o exportador de PDF do carregamento
  estático do hook do gerador
- `src/hooks/useChurchScheduleGenerator.js` passou a carregar
  `src/utils/pdfGenerator.js` apenas no clique de exportação
- com isso, o custo de `jspdf` deixa de participar da carga inicial da
  rota de escala quando o usuário ainda não pediu o PDF
- a mudança preserva o contrato funcional do fluxo e mantém o shell da
  rota inalterado

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
- [x] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V24

1. validar o ganho prático do corte de PDF sob demanda em nova build do
   `V24`
2. revisar o peso do shell inicial em `src/App.js`, `src/components/Auth.js`
   e dependências do fluxo autenticado
3. decidir se o preload do gerador continua valendo o custo no pós-login

## Artefatos Planejados

- `docs/reviews/artifacts/v24/BUNDLE_LOADING_REVIEW_V24.md`
- `docs/reviews/artifacts/v24/BUNDLE_LOADING_IMPACT_V24.md`
- `docs/reviews/artifacts/v24/BUNDLE_LOADING_COVERAGE_V24.md`
