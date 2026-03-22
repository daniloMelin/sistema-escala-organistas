# Code Review V8

## Histórico de Revisões

| Versão | Data | Autor(es) | Descrição da Revisão |
| ------ | ---- | --------- | -------------------- |
| 1.0 | 21 de março de 2026 | Danilo Melin | Criação do ciclo V8 |
| 1.1 | 21 de março de 2026 | Danilo Melin | Fase 1.1 concluída |
| 1.2 | 21 de março de 2026 | Danilo Melin | Fase 1.2 concluída |
| 1.3 | 21 de março de 2026 | Danilo Melin | Fase 2.1 concluída |
| 1.4 | 21 de março de 2026 | Danilo Melin | Fase 2.2 concluída |
| 1.5 | 21 de março de 2026 | Danilo Melin | Fase 3.1 concluída |
| 1.6 | 21 de março de 2026 | Danilo Melin | Fase 3.2 concluída |
| 1.7 | 21 de março de 2026 | Danilo Melin | Fase 4.1 concluída |

## Objetivo

Reduzir o passivo de documentação do repositório, deixando os documentos
principais compatíveis com o `markdownlint`, mais consistentes visualmente e
mais sustentáveis para manutenção contínua.

## Status do Ciclo

- Status geral: `CONCLUÍDO`
- Data de início: `21 de março de 2026`
- Data de encerramento: `21 de março de 2026`
- Contexto: continuidade direta do fechamento do `CODE_REVIEW_V7` e da fase de
  padronização de tooling/documentação

## Diretriz de Prioridade

1. Corrigir primeiro os documentos mais ativos do projeto
2. Eliminar erros de lint documental com maior volume e menor risco
3. Estabelecer uma baseline utilizável para `lint:md` e `format:check`
4. Evitar mudanças massivas sem agrupamento lógico

## Diagnóstico Inicial

O passivo atual identificado em `npm run lint:md` concentra-se
principalmente em:

- `MD013`: largura de linha acima do padrão
- `MD060`: estilo de tabelas Markdown
- `MD012`: múltiplas linhas em branco consecutivas
- `MD032`: listas sem espaçamento adequado

Os arquivos mais afetados são:

- `README.md`
- `CONTRIBUTING.md`
- `docs/CODE_REVIEW.md`
- `docs/CODE_REVIEW_V2.md`
- `docs/CODE_REVIEW_V4.md`
- `docs/CODE_REVIEW_V5.md`
- `docs/CODE_REVIEW_V6.md`
- `docs/CODE_REVIEW_V7.md`
- `docs/E2E_GUIDE.md`
- `docs/FIRESTORE_SCHEMA.md`

## Plano de Implementação

### Fase 1 - Documentos Ativos do Ciclo Atual

#### 1.1 Normalizar documentos do fluxo E2E e dos reviews recentes

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - corrigir `CODE_REVIEW_V7`, `E2E_GUIDE`, `E2E_SMOKE_V7`,
    `E2E_CI_POLICY_V7` e `E2E_EXPANSION_V7`
  - reduzir `MD013` e inconsistências de tabelas
  - manter o conteúdo funcionalmente idêntico
  - resultado alcançado:
    - documentos-alvo limpos no `markdownlint`
    - tabelas históricas normalizadas
    - quebras de linha normalizadas sem alterar o conteúdo

#### 1.2 Ajustar documentos institucionais de entrada

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - corrigir `README.md`, `CONTRIBUTING.md` e `CHANGELOG.md`
  - melhorar legibilidade sem reescrever a mensagem dos documentos
  - resultado alcançado:
    - documentos-alvo limpos no `markdownlint`
    - quebras de linha normalizadas
    - links e blocos de código do `README.md` ajustados

### Fase 2 - Documentos Históricos do Projeto

#### 2.1 Sanear documentos legado de review

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - corrigir `docs/CODE_REVIEW.md`, `docs/CODE_REVIEW_V2.md` e
    `docs/CODE_REVIEW_V3.md`
  - remover múltiplas linhas em branco
  - normalizar listas e tabelas
  - resultado alcançado:
    - documentos-alvo limpos no `markdownlint`
    - históricos padronizados em tabela curta
    - tabelas de métricas convertidas para blocos mais sustentáveis

#### 2.2 Sanear documentos técnicos extensos

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - corrigir `docs/FIRESTORE_SCHEMA.md`, `docs/IMPLEMENTATION_GUIDE.md`,
    `docs/SCHEDULE_ALGORITHM.md` e `docs/VITE_SPIKE_V4.md`
  - revisar listas, blocos e largura de linha
  - resultado alcançado:
    - documentos-alvo limpos no `markdownlint`
    - históricos padronizados em tabela curta
    - listas e blocos normalizados com foco em legibilidade

### Fase 3 - Baseline de Formatação do Repositório

#### 3.1 Definir recorte seguro para `format:check`

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - decidir se o repositório deve caminhar para formatação completa ou gradual
  - documentar o recorte inicial seguro
  - evitar PRs gigantes só de estilo
  - resultado alcançado:
    - baseline atual do `format:check` registrada
    - estratégia gradual documentada
    - gate global adiado até redução do passivo

#### 3.2 Validar baseline operacional do lint documental

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - reduzir o volume de erros de `lint:md` a um conjunto residual controlável
  - confirmar se a equipe já consegue usar `lint:md` no fluxo diário
  - resultado alcançado:
    - baseline operacional do `lint:md` registrada
    - passivo residual isolado em poucos documentos
    - uso do comando como diagnóstico local validado

### Fase 4 - Fechamento do Ciclo

#### 4.1 Consolidar padrão documental do repositório

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar a baseline alcançada
  - documentar critérios de continuidade
  - fechar formalmente o `CODE_REVIEW_V8`
  - resultado alcançado:
    - baseline documental consolidada
    - passivo residual isolado em poucos arquivos
    - fechamento formal do ciclo registrado

## Ordem de execução recomendada

1. **Fase 1.1 - Documentos do fluxo E2E e reviews recentes**
2. **Fase 1.2 - Documentos institucionais de entrada**
3. **Fase 2.1 - Reviews históricos**
4. **Fase 2.2 - Documentos técnicos extensos**
5. **Fase 3.1 - Baseline de formatação**
6. **Fase 3.2 - Baseline operacional do lint**
7. **Fase 4.1 - Fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.1 concluída
- [x] Fase 3.2 concluída
- [x] Fase 4.1 concluída

## Critério de Conclusão do V8

- documentos mais ativos sem passivo crítico de Markdown
- baseline documental suficientemente limpa para uso real de `lint:md`
- padrão de manutenção futura documentado

## Resumo Executivo

O ciclo V8 reorganizou a base documental do repositório e transformou o
lint de Markdown em um diagnóstico utilizável de verdade.

Principais resultados:

- documentos ativos e técnicos normalizados
- históricos de revisão padronizados em tabela curta
- baseline do `format:check` documentada
- baseline do `lint:md` documentada
- passivo residual reduzido a um conjunto pequeno e explícito

## Impacto Prático no Projeto

- a documentação principal do projeto ficou mais consistente
- o time passa a ter critério claro para evolução de Markdown e
  formatação
- `lint:md` deixou de apontar um passivo difuso e passou a mostrar um
  backlog residual controlável
- novas entregas podem seguir um padrão documental já estabelecido

## Artefatos Consolidados do Ciclo

- `docs/CODE_REVIEW_V8.md`
- `docs/PRETTIER_BASELINE_V8.md`
- `docs/MARKDOWNLINT_BASELINE_V8.md`

## Passivo Residual Mapeado

- `docs/CODE_REVIEW_V4.md`
- `docs/CODE_REVIEW_V5.md`
- `docs/CODE_REVIEW_V6.md`
- `docs/E2E_CONSOLIDATION_V6.md`
- `docs/E2E_COVERAGE_V5.md`
- `docs/E2E_STRATEGY.md`

## Próximos Passos Recomendados

1. Tratar o passivo residual do `markdownlint` em uma PR curta e
   dirigida.
2. Revisar depois o recorte seguro de `Prettier` por grupos lógicos,
   sem aplicar `--write` no repositório inteiro.
3. Manter o padrão de histórico em tabela curta nos próximos ciclos.
