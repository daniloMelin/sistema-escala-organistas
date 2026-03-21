# Code Review V8

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                            |
| ------ | ------------------ | ------------ | ----------------------------------------------------------------------------------------------- |
| 1.0    | 21 de março de 2026 | Danilo Melin | Criação do Code Review V8 com foco em saneamento documental, aderência ao markdownlint e baseline de formatação |

## Objetivo

Reduzir o passivo de documentação do repositório, deixando os documentos
principais compatíveis com o `markdownlint`, mais consistentes visualmente e
mais sustentáveis para manutenção contínua.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Data de início: `21 de março de 2026`
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

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - corrigir `CODE_REVIEW_V7`, `E2E_GUIDE`, `E2E_SMOKE_V7`,
    `E2E_CI_POLICY_V7` e `E2E_EXPANSION_V7`
  - reduzir `MD013` e inconsistências de tabelas
  - manter o conteúdo funcionalmente idêntico

#### 1.2 Ajustar documentos institucionais de entrada

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - corrigir `README.md`, `CONTRIBUTING.md` e `CHANGELOG.md`
  - melhorar legibilidade sem reescrever a mensagem dos documentos

### Fase 2 - Documentos Históricos do Projeto

#### 2.1 Sanear documentos legado de review

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - corrigir `docs/CODE_REVIEW.md`, `docs/CODE_REVIEW_V2.md` e
    `docs/CODE_REVIEW_V3.md`
  - remover múltiplas linhas em branco
  - normalizar listas e tabelas

#### 2.2 Sanear documentos técnicos extensos

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - corrigir `docs/FIRESTORE_SCHEMA.md`, `docs/IMPLEMENTATION_GUIDE.md`,
    `docs/SCHEDULE_ALGORITHM.md` e `docs/VITE_SPIKE_V4.md`
  - revisar listas, blocos e largura de linha

### Fase 3 - Baseline de Formatação do Repositório

#### 3.1 Definir recorte seguro para `format:check`

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - decidir se o repositório deve caminhar para formatação completa ou gradual
  - documentar o recorte inicial seguro
  - evitar PRs gigantes só de estilo

#### 3.2 Validar baseline operacional do lint documental

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - reduzir o volume de erros de `lint:md` a um conjunto residual controlável
  - confirmar se a equipe já consegue usar `lint:md` no fluxo diário

### Fase 4 - Fechamento do Ciclo

#### 4.1 Consolidar padrão documental do repositório

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar a baseline alcançada
  - documentar critérios de continuidade
  - fechar formalmente o `CODE_REVIEW_V8`

## Ordem de execução recomendada

1. **Fase 1.1 - Documentos do fluxo E2E e reviews recentes**
2. **Fase 1.2 - Documentos institucionais de entrada**
3. **Fase 2.1 - Reviews históricos**
4. **Fase 2.2 - Documentos técnicos extensos**
5. **Fase 3.1 - Baseline de formatação**
6. **Fase 3.2 - Baseline operacional do lint**
7. **Fase 4.1 - Fechamento do ciclo**

## Registro de progresso

- [ ] Fase 1.1 concluída
- [ ] Fase 1.2 concluída
- [ ] Fase 2.1 concluída
- [ ] Fase 2.2 concluída
- [ ] Fase 3.1 concluída
- [ ] Fase 3.2 concluída
- [ ] Fase 4.1 concluída

## Critério de Conclusão do V8

- documentos mais ativos sem passivo crítico de Markdown
- baseline documental suficientemente limpa para uso real de `lint:md`
- padrão de manutenção futura documentado
