# Code Review V18

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                              |
| ------ | ------------------- | ------------ | ------------------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V18                              |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de consistência operacional |
| 1.2    | 27 de abril de 2026 | Danilo Melin | Consolidação da fase 1 do V18                     |
| 1.3    | 27 de abril de 2026 | Danilo Melin | Validação operacional do fluxo de igrejas         |

## Objetivo

Consolidar a consistência operacional do sistema antes de novos
incrementos funcionais, com foco nos fluxos mais usados e nos pontos com
maior risco de regressão.

O `V18` nasce após o encerramento do `V17`, aproveitando a melhoria da
qualidade de formulários para revisar o comportamento ponta a ponta das
funções já existentes.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `25 de abril de 2026`
- Data de encerramento: `em aberto`
- Contexto: estabilização da base após o fechamento do `V17` e limpeza
  das branches locais e remotas

## Diretriz de Prioridade

1. Garantir que os fluxos principais funcionem sem regressão
2. Reduzir inconsistências entre tela, persistência e PDF
3. Corrigir primeiro problemas de operação real antes de expandir novas funcionalidades
4. Fechar o ciclo com evidência objetiva de cobertura e impacto

## Diagnóstico Inicial

Após os ciclos recentes, o sistema evoluiu bem em validação,
responsividade e qualidade do PDF, mas ainda vale uma revisão
operacional mais integrada:

- os fluxos de cadastro e edição precisam ser conferidos como jornada completa
- a geração da escala precisa continuar coerente com o período fechado de `3` meses
- a visualização da escala e o PDF precisam permanecer alinhados
- a experiência real de uso ainda depende de testes manuais em pontos críticos
- o sistema ainda está em fase de refinamento, então ajustes de consistência são baratos agora

## Escopo Previsto

### 1. Igrejas

- validar cadastro de igreja
- validar edição de igreja
- validar exclusão de igreja
- conferir persistência do ensaio local e do modelo de culto

### 2. Organistas

- validar cadastro de organista
- validar edição de organista
- validar exclusão de organista
- revisar impacto das novas regras de nome e disponibilidade

### 3. Escala

- validar geração da escala no período fechado de `3` meses
- revisar coerência da distribuição em cenários com `2` e `3` organistas por dia
- conferir persistência e recarga da escala gerada

### 4. Visualização e PDF

- revisar consistência entre visualização da escala e PDF exportado
- confirmar presença correta de resumo do período e ensaio local
- identificar diferenças visuais ou informacionais que gerem dúvida operacional

### 5. Consolidação do ciclo

- registrar impacto prático das validações
- consolidar cobertura relevante do ciclo
- fechar o `V18` com critérios de saída claros

## Fases Propostas

### Fase 1 - Mapeamento operacional

Objetivo:

- listar os fluxos críticos do sistema
- definir checklist de validação funcional
- registrar riscos e comportamentos esperados por fluxo

Saídas esperadas:

- artefato base do ciclo com checklist operacional
- priorização do que deve ser testado primeiro

Resultado consolidado:

- Status: `CONCLUÍDO`
- Checklist operacional detalhado no artefato
  `docs/reviews/artifacts/v18/OPERATIONAL_CONSISTENCY_REVIEW_V18.md`
- Priorização inicial definida para igreja, organista, escala,
  visualização e PDF
- Critério de execução definido: registrar comportamento esperado antes
  de corrigir e automatizar apenas o que reduzir risco real

### Fase 2 - Execução e correções

Objetivo:

- executar a revisão dos fluxos principais
- corrigir regressões ou inconsistências encontradas
- manter cada ajuste pequeno e rastreável

Saídas esperadas:

- correções validadas por fluxo
- atualização de testes quando a regressão justificar proteção automatizada

Execução inicial:

- fluxo de igrejas revisado como primeira prioridade operacional
- cadastro, edição, compatibilidade legada de `code`, ensaio local,
  modelo de culto e exclusão avaliados
- cobertura de `useChurchManager` ampliada para preservar `code` legado
  durante edição, atualizar modelo de culto e limpar edição ao excluir
  a igreja em edição

### Fase 3 - Cobertura e impacto

Objetivo:

- consolidar o impacto operacional do ciclo
- registrar o que ficou protegido por testes
- separar claramente risco resolvido de risco residual

Saídas esperadas:

- documento de impacto do `V18`
- documento de cobertura do `V18`

### Fase 4 - Fechamento

Objetivo:

- encerrar formalmente o ciclo
- registrar resumo executivo, artefatos e próximos passos

Saídas esperadas:

- `CODE_REVIEW_V18.md` marcado como concluído
- recomendações para o próximo ciclo

## Critérios de Saída Propostos

- fluxos principais de igreja, organista, escala e PDF revisados
- inconsistências relevantes registradas e tratadas
- cobertura ampliada apenas onde ela reduz risco real
- documentação do ciclo consolidada com impacto e pendências residuais

## Registro de Progresso

- [x] Estrutura inicial do V18 criada
- [x] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V18

1. executar o checklist operacional da fase 2 pelos fluxos priorizados
2. registrar inconsistências encontradas com escopo pequeno de correção
3. ampliar testes somente quando a proteção reduzir risco real de regressão
