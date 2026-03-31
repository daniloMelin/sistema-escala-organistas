# Code Review V14

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                                  |
| ------ | ------------------- | ------------ | ----------------------------------------------------- |
| 1.0    | 28 de março de 2026 | Danilo Melin | Criação do ciclo V14                                  |
| 1.1    | 31 de março de 2026 | Codex        | Revisão dos sinais operacionais mais úteis por igreja |

## Objetivo

Evoluir a lista de igrejas para oferecer visão operacional mais clara
de cada igreja, ajudando quem administra uma ou mais igrejas a entender
rapidamente o estado de preparo antes de entrar no painel ou gerar a
escala.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `28 de março de 2026`
- Data de encerramento: `A definir`
- Contexto: continuidade funcional após o `CODE_REVIEW_V13`, agora com
  foco em leitura operacional no nível da igreja

## Diretriz de Prioridade

1. Melhorar leitura do estado da igreja antes de exigir navegação
2. Priorizar sinais operacionais simples e confiáveis
3. Evitar painel excessivamente complexo para um fluxo de uso
   relativamente direto
4. Reaproveitar os dados já existentes antes de criar novas estruturas

## Diagnóstico Inicial

Após o V13, o sistema já consegue representar melhor a realidade de
cada igreja no fluxo de geração da escala.

O próximo atrito natural está na tela inicial de gerenciamento de
igrejas:

- a lista ainda mostra pouca informação operacional
- quem administra mais de uma igreja precisa entrar em cada uma para
  entender o estado atual
- ainda não há resumo rápido de preparo, cadastro e uso recente

Os sinais mais promissores para esta etapa são:

- modelo de culto configurado
- quantidade de organistas cadastradas
- quantidade de escalas salvas
- indicador simples de prontidão da igreja

## Plano de Implementação

### Fase 1 - Estratégia do Resumo Operacional

#### 1.1 Revisar sinais operacionais mais úteis por igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - revisar quais sinais resumidos mais ajudam na lista de igrejas
  - comparar opções de resumo sem inflar a interface
  - definir a melhoria prioritária do ciclo

#### 1.2 Implementar resumo operacional prioritário na lista de igrejas

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - enriquecer cada item da lista de igrejas com resumo operacional
  - preservar simplicidade visual e clique principal da navegação
  - atualizar cobertura de componente conforme necessário

### Fase 2 - Experiência Operacional da Lista

#### 2.1 Refinar clareza e leitura do resumo por igreja

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar labels, hierarquia visual e legibilidade do resumo
  - ajustar a forma de exibir prontidão ou atenção por igreja
  - manter consistência com o restante da interface

#### 2.2 Validar o novo fluxo ponta a ponta

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - criar ou atualizar cenário E2E da lista de igrejas
  - garantir coerência da leitura operacional no uso real

### Fase 3 - Consolidação Funcional

#### 3.1 Revisar impacto operacional da visão por igreja

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da nova leitura por igreja
  - registrar limitações remanescentes
  - identificar o próximo passo funcional mais natural

#### 3.2 Consolidar cobertura e documentação do fluxo evoluído

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar a cobertura da melhoria entregue
  - consolidar artefatos e decisão funcional do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Encerrar formalmente o V14

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar o resultado do ciclo
  - consolidar próximos passos recomendados
  - fechar formalmente o `CODE_REVIEW_V14`

## Ordem de execução recomendada

1. **Fase 1.1 - revisar sinais operacionais por igreja**
2. **Fase 1.2 - implementar resumo operacional**
3. **Fase 2.1 - refinar clareza da lista**
4. **Fase 2.2 - validar fluxo ponta a ponta**
5. **Fase 3.1 - revisar impacto operacional**
6. **Fase 3.2 - consolidar cobertura e documentação**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [ ] Fase 1.2 pendente
- [ ] Fase 2.1 pendente
- [ ] Fase 2.2 pendente
- [ ] Fase 3.1 pendente
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V14

- pelo menos um resumo operacional relevante por igreja entregue na
  lista principal
- leitura da lista melhorada sem aumentar complexidade de navegação
- documentação do ciclo atualizada com impacto prático e próximos passos

## Artefatos da Fase 1

- `docs/reviews/artifacts/v14/CHURCH_OPERATIONAL_SUMMARY_REVIEW_V14.md`
