# Cobertura da Busca no Histórico V11

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão       |
| ------ | ------------------- | ------------ | -------------------------- |
| 1.0    | 26 de março de 2026 | Danilo Melin | Cobertura do histórico V11 |

## Objetivo

Consolidar a cobertura criada no V11 para o fluxo evoluído de busca e
consulta do histórico de escalas.

## Cobertura Implementada

### Camada 1. Componente

Arquivo:

- `src/test/scheduleHistoryList.test.js`

Validações cobertas:

- não renderiza durante edição
- mantém ordem estável dos hooks ao alternar edição e visualização
- exibe badge `Mais recente`
- mantém ação de `Visualizar`
- filtra o histórico por texto
- mostra contagem de resultados
- restaura a lista após `Limpar busca`
- exibe estado vazio com o termo pesquisado

### Camada 2. Fluxo E2E de geração

Arquivo:

- `e2e/schedule-generation.spec.js`

Validações cobertas:

- geração de escala com mensagem contextual de sucesso
- presença do histórico com contexto operacional
- destaque da escala mais recente
- presença da informação de atualização no item mais recente

### Camada 3. Fluxo E2E de histórico com busca

Arquivo:

- `e2e/schedule-generation.spec.js`

Validações cobertas:

- seed com múltiplas escalas salvas
- busca textual no histórico
- contagem de resultados após filtragem
- visualização de escala salva após aplicar filtro
- estado vazio quando a busca não retorna itens
- restauração da lista completa após `Limpar busca`

## Itens Cobertos pelo V11

- localização textual de escalas salvas
- feedback de quantidade de resultados filtrados
- clareza do estado vazio de busca
- manutenção da navegação e da visualização após filtragem
- estabilidade do componente ao alternar entre edição e visualização

## Itens Ainda Fora do Escopo

- filtro estruturado por período
- agrupamento por mês
- paginação ou carregamento incremental do histórico
- combinação de múltiplos filtros no mesmo fluxo
- ordenação customizada pelo usuário

## Conclusão

O V11 deixou o fluxo de busca do histórico melhor documentado e melhor
protegido:

- a melhoria funcional ficou coberta em componente e em E2E
- o comportamento mais importante já está validado em uso real
- o próximo passo pode se concentrar em expansão funcional da consulta,
  não em correção da base recém-evoluída
