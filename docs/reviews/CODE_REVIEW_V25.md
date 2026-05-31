# Code Review V25

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                |
| ------ | ------------------ | ------------ | --------------------------------------------------- |
| 1.0    | 30 de maio de 2026 | Danilo Melin | Criação do ciclo V25                                |
| 1.1    | 30 de maio de 2026 | Danilo Melin | Estruturação do ciclo de contraste, SEO e qualidade |

## Objetivo

Consolidar os ganhos complementares de Lighthouse com foco em contraste,
`robots.txt`, higiene de publicação e investigação do impacto do fluxo
de cookies do Firebase Auth no score de Best Practices.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Contexto: ciclo complementar após `V23` e `V24`, voltado a fechar os
  pontos rápidos e separar o que depende da stack de autenticação

## Diretriz de Prioridade

1. Resolver primeiro o que é barato e controlável pela aplicação
2. Fechar acessibilidade e SEO residual antes de investigar a stack
   externa
3. Tratar Best Practices com leitura técnica, não com meta cega
4. Deixar claro o que é limitação local e o que é limitação do provedor

## Diagnóstico Inicial

- os relatórios do `V23` mostraram contraste insuficiente recorrente em
  botões, navegação ativa e texto secundário
- o baseline também indicou `robots.txt is not valid` em todas as
  execuções
- o score de `Best Practices` foi afetado por:
  - `third-party-cookies`
  - `inspector-issues` do tipo `Cookie`
- esse último bloco parece relacionado ao `Firebase Auth` e ao fluxo de
  `gapi iframe`

## Escopo Previsto

### 1. Contraste e tokens visuais

- revisar cores primárias e de sucesso
- revisar contraste do estado ativo da navegação
- revisar textos secundários e rodapé

### 2. SEO e publicação

- corrigir ou criar `public/robots.txt`
- revisar higiene mínima de publicação para a análise de Lighthouse

### 3. Best Practices e cookies

- investigar o impacto real do fluxo de autenticação hospedado
- separar ruído do provedor de problema controlável no app
- registrar decisão técnica sobre a meta de score

### 4. Consolidação do ciclo

- registrar impacto das correções rápidas
- documentar limite prático do score se houver dependência externa

## Fases Propostas

### Fase 1 - Checklist de qualidade complementar

Objetivo:

- consolidar os itens rápidos de contraste e SEO
- mapear quais pontos de Best Practices são internos e quais são
  externos

Saídas esperadas:

- artefato base do ciclo com checklist de contraste, SEO e cookies
- priorização entre correção direta e investigação

### Fase 2 - Ajustes visuais e de publicação

Objetivo:

- corrigir contraste residual
- corrigir `robots.txt`
- revisar a apresentação final para Lighthouse

Saídas esperadas:

- ajustes rastreáveis em tokens visuais e arquivos de publicação
- validação focal de acessibilidade e SEO

### Fase 3 - Cobertura e impacto

Objetivo:

- consolidar o que foi corrigido
- registrar o que ficou como limitação externa ou risco aceito

Saídas esperadas:

- documento de impacto do `V25`
- documento de cobertura do `V25`

### Fase 4 - Fechamento

Objetivo:

- encerrar formalmente o ciclo
- consolidar leitura final dos scores complementares

Saídas esperadas:

- `CODE_REVIEW_V25.md` marcado como concluído
- posição final sobre contraste, `robots.txt` e Best Practices

## Critérios de Saída Propostos

- contraste corrigido nos pontos recorrentes do baseline
- `robots.txt` válido em publicação
- decisão explícita sobre a tratabilidade do score de Best Practices
- baseline complementar pronto para comparação final

## Registro de Progresso

- [x] Estrutura inicial do V25 criada
- [ ] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V25

1. usar o baseline do `V23` para localizar rapidamente os pontos de
   contraste em `src/App.css`, `src/index.css` e `src/components/Auth.css`
2. revisar a criação de `public/robots.txt` como ajuste rápido de SEO
3. registrar separadamente a investigação do fluxo de cookies do
   Firebase Auth antes de assumir meta de `>= 90` em Best Practices

## Artefatos Planejados

- `docs/reviews/artifacts/v25/QUALITY_COMPLEMENT_REVIEW_V25.md`
- `docs/reviews/artifacts/v25/QUALITY_COMPLEMENT_IMPACT_V25.md`
- `docs/reviews/artifacts/v25/QUALITY_COMPLEMENT_COVERAGE_V25.md`
