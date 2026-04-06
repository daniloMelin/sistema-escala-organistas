# Code Review V15

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                        |
| ------ | ------------------ | ------------ | ------------------------------------------- |
| 1.0    | 2 de abril de 2026 | Danilo Melin | Criação do ciclo V15                        |
| 1.1    | 2 de abril de 2026 | Codex        | Ajuste de foco do ciclo V15                 |
| 1.2    | 5 de abril de 2026 | Codex        | Revisão da priorização operacional da lista |
| 1.3    | 5 de abril de 2026 | Codex        | Implementação da priorização operacional    |
| 1.4    | 5 de abril de 2026 | Codex        | Refino da clareza da lista priorizada       |
| 1.5    | 6 de abril de 2026 | Codex        | Validação E2E da lista priorizada           |

## Objetivo

Evoluir a lista principal de igrejas após o V14, priorizando ordenação
e destaque operacional para reduzir esforço de decisão quando houver
poucas igrejas cadastradas por pessoa responsável.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `2 de abril de 2026`
- Data de encerramento: `A definir`
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

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da nova priorização
  - registrar limitações remanescentes
  - identificar o próximo passo funcional mais natural

#### 3.2 Consolidar cobertura e documentação do fluxo evoluído

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar a cobertura da melhoria entregue
  - consolidar artefatos e decisão funcional do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Encerrar formalmente o V15

- Status: `PENDENTE`
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
- [ ] Fase 3.1 pendente
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V15

- pelo menos uma melhoria relevante de priorização operacional entregue
  na lista principal
- leitura operacional preservada durante o uso da ordenação ou destaque
- documentação do ciclo atualizada com impacto prático e próximos passos

## Artefatos da Fase 1

- `docs/reviews/artifacts/v15/CHURCH_LIST_PRIORITIZATION_REVIEW_V15.md`
