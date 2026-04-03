# Code Review V15

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão |
| ------ | ------------------ | ------------ | -------------------- |
| 1.0    | 2 de abril de 2026 | Danilo Melin | Criação do ciclo V15 |

## Objetivo

Evoluir a lista principal de igrejas após o V14, adicionando busca e
filtro operacional para reduzir esforço de localização quando houver
múltiplas igrejas cadastradas.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Data de início: `2 de abril de 2026`
- Data de encerramento: `A definir`
- Contexto: continuidade direta do `CODE_REVIEW_V14`, agora focando em
  localização mais rápida dentro da lista principal de igrejas

## Diretriz de Prioridade

1. Melhorar localização sem transformar a lista em painel complexo
2. Priorizar filtro simples e leitura imediata
3. Preservar a visão operacional entregue no V14
4. Manter cobertura de componente e E2E desde o início

## Diagnóstico Inicial

Após o V14, a lista principal de igrejas já oferece uma leitura
operacional melhor, com:

- prontidão resumida por igreja
- modelo de culto
- quantidade de organistas
- quantidade de escalas salvas

O próximo atrito natural passa a ser a localização quando existem várias
igrejas cadastradas:

- a lista ainda depende de leitura sequencial
- não há busca por nome ou código
- não há filtro simples por estado operacional
- a navegação melhora com o resumo, mas ainda pode exigir rolagem demais

## Plano de Implementação

### Fase 1 - Estratégia de Busca e Filtro

#### 1.1 Revisar opções de localização da lista de igrejas

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - comparar busca textual e filtros estruturados simples
  - definir a melhoria prioritária do ciclo
  - decidir como preservar a leitura operacional já entregue

#### 1.2 Implementar a melhoria prioritária na lista de igrejas

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - adicionar mecanismo de localização à lista principal
  - manter o resumo operacional legível durante o uso
  - atualizar cobertura de componente conforme necessário

### Fase 2 - Experiência Operacional da Lista Filtrada

#### 2.1 Refinar clareza do uso combinado entre localização e resumo

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar textos, estados vazios e feedback da busca ou filtro
  - preservar a leitura dos sinais operacionais por igreja
  - manter navegação simples para o painel da igreja

#### 2.2 Validar o fluxo ponta a ponta com lista localizada

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - criar ou atualizar cenário E2E da lista de igrejas
  - garantir coerência do fluxo filtrado em uso real

### Fase 3 - Consolidação Funcional

#### 3.1 Revisar impacto operacional da localização na lista

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da nova localização
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

1. **Fase 1.1 - revisar opções de busca e filtro da lista**
2. **Fase 1.2 - implementar a melhoria prioritária**
3. **Fase 2.1 - refinar a experiência da lista localizada**
4. **Fase 2.2 - validar o fluxo ponta a ponta**
5. **Fase 3.1 - revisar impacto operacional**
6. **Fase 3.2 - consolidar cobertura e documentação**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [ ] Fase 1.1 pendente
- [ ] Fase 1.2 pendente
- [ ] Fase 2.1 pendente
- [ ] Fase 2.2 pendente
- [ ] Fase 3.1 pendente
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V15

- pelo menos um mecanismo relevante de localização por igreja entregue
  na lista principal
- leitura operacional preservada durante o uso da busca ou filtro
- documentação do ciclo atualizada com impacto prático e próximos passos
