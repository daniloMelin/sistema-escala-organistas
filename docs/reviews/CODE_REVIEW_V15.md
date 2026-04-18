# Code Review V15

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                        |
| ------ | ------------------ | ------------ | ------------------------------------------- |
| 1.0    | 2 de abril de 2026 | Danilo Melin | Criação do ciclo V15                        |
| 1.1    | 2 de abril de 2026 | Danilo Melin | Ajuste de foco do ciclo V15                 |
| 1.2    | 5 de abril de 2026 | Danilo Melin | Revisão da priorização operacional da lista |
| 1.3    | 5 de abril de 2026 | Danilo Melin | Implementação da priorização operacional    |
| 1.4    | 5 de abril de 2026 | Danilo Melin | Refino da clareza da lista priorizada       |
| 1.5    | 6 de abril de 2026 | Danilo Melin | Validação E2E da lista priorizada           |
| 1.6    | 6 de abril de 2026 | Danilo Melin | Consolidação do impacto operacional do V15  |
| 1.7    | 6 de abril de 2026 | Danilo Melin | Consolidação da cobertura funcional do V15  |
| 1.8    | 6 de abril de 2026 | Danilo Melin | Fechamento formal do ciclo V15              |

## Objetivo

Evoluir a lista principal de igrejas após o V14, priorizando ordenação
e destaque operacional para reduzir esforço de decisão quando houver
poucas igrejas cadastradas por pessoa responsável.

## Status do Ciclo

- Status geral: `CONCLUÍDO`
- Data de início: `2 de abril de 2026`
- Data de encerramento: `6 de abril de 2026`
- Contexto: continuidade direta do `CODE_REVIEW_V14`, agora focando em
  priorização visual da lista principal de igrejas

## Diretriz de Prioridade

1. Melhorar priorização da lista sem transformar a tela em painel complexo
2. Evitar campo de busca desnecessário para volume pequeno de igrejas
3. Preservar a visão operacional entregue no V14
4. Manter cobertura de componente e E2E desde o início

## Diagnóstico Inicial

Após o V14, a lista principal de igrejas já oferece uma leitura
operacional melhor, com:

- prontidão resumida por igreja
- modelo de culto
- quantidade de organistas
- quantidade de escalas salvas

O próximo atrito natural passa a ser a priorização do que olhar primeiro
na lista:

- o volume por pessoa tende a ser baixo, muitas vezes até 3 igrejas
- a dor principal não é “achar” a igreja, e sim decidir qual precisa
  atenção primeiro
- busca textual tende a adicionar complexidade com pouco ganho nesse
  cenário
- a lista pode evoluir mais com ordenação e destaque do que com campo de
  busca

## Plano de Implementação

### Fase 1 - Estratégia de Priorização da Lista

#### 1.1 Revisar opções de priorização operacional da lista de igrejas

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - comparar ordenação por status, destaque visual e filtros simples
  - definir a melhoria prioritária do ciclo
  - decidir como preservar a leitura operacional já entregue

#### 1.2 Implementar a priorização operacional prioritária na lista de igrejas

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - ajustar ordenação e destaque da lista principal
  - manter o resumo operacional legível durante o uso
  - atualizar cobertura de componente conforme necessário

### Fase 2 - Experiência Operacional da Lista Priorizada

#### 2.1 Refinar clareza do uso combinado entre priorização e resumo

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar hierarquia visual, labels e destaque do estado operacional
  - preservar a leitura dos sinais operacionais por igreja
  - manter navegação simples para o painel da igreja

#### 2.2 Validar o fluxo ponta a ponta com lista priorizada

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - criar ou atualizar cenário E2E da lista de igrejas
  - garantir coerência da ordenação e do destaque em uso real

### Fase 3 - Consolidação Funcional

#### 3.1 Revisar impacto operacional da priorização da lista

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da nova priorização
  - registrar limitações remanescentes
  - identificar o próximo passo funcional mais natural

#### 3.2 Consolidar cobertura e documentação do fluxo evoluído

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar a cobertura da melhoria entregue
  - consolidar artefatos e decisão funcional do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Encerrar formalmente o V15

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar o resultado do ciclo
  - consolidar próximos passos recomendados
  - fechar formalmente o `CODE_REVIEW_V15`

## Ordem de execução recomendada

1. **Fase 1.1 - revisar opções de priorização operacional da lista**
2. **Fase 1.2 - implementar a melhoria prioritária**
3. **Fase 2.1 - refinar a experiência da lista priorizada**
4. **Fase 2.2 - validar o fluxo ponta a ponta**
5. **Fase 3.1 - revisar impacto operacional**
6. **Fase 3.2 - consolidar cobertura e documentação**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.1 concluída
- [x] Fase 3.2 concluída
- [x] Fase 4.1 concluída

## Critério de Conclusão do V15

- pelo menos uma melhoria relevante de priorização operacional entregue
  na lista principal
- leitura operacional preservada durante o uso da ordenação ou destaque
- documentação do ciclo atualizada com impacto prático e próximos passos

## Artefatos da Fase 1

- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_REVIEW_V15.md`

## Artefatos da Fase 3

- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_IMPACT_V15.md`
- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_COVERAGE_V15.md`

## Resumo Executivo

O V15 concluiu a evolução da lista principal de igrejas iniciada no
V14, com foco em uma decisão funcional simples:

- não priorizar campo de busca para um cenário de baixo volume
- priorizar ordenação operacional e destaque visual leve

Com isso, a lista passou a responder melhor qual igreja precisa ser
vista primeiro, sem aumentar complexidade desnecessária.

## Impacto Prático no Projeto

Ao final do ciclo, o projeto passou a ter:

- lista ordenada por prioridade operacional
- reforço visual coerente com o estado de cada igreja
- clareza maior sobre o motivo da priorização
- validação de componente, hook e E2E para o comportamento novo

O ganho principal do V15 não foi “encontrar” a igreja certa, e sim
reduzir o esforço de decisão sobre qual igreja merece atenção imediata.

## Artefatos Consolidados do Ciclo

- `docs/reviews/CODE_REVIEW_V15.md`
- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_REVIEW_V15.md`
- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_IMPACT_V15.md`
- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_COVERAGE_V15.md`

## Próximos Passos Recomendados

1. avaliar se o volume real de igrejas continua baixo antes de investir
   em busca textual
2. considerar sinais adicionais para a lista, como última atividade ou
   última escala gerada
3. abrir o próximo ciclo técnico para migração de `CRA` para `Vite` com
   `TypeScript`
4. manter `Mantine` como decisão para a etapa posterior à migração
