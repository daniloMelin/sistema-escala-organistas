# Cobertura do Filtro por Período V12

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão       |
| ------ | ------------------- | ------------ | -------------------------- |
| 1.0    | 27 de março de 2026 | Danilo Melin | Cobertura do histórico V12 |

## Objetivo

Consolidar a cobertura criada no V12 para o fluxo evoluído de filtro
por período e sua combinação com a busca textual no histórico de
escalas.

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
- filtra o histórico por período
- combina período e busca textual
- mostra contagem de resultados
- exibe período ativo
- restaura o fluxo após `Limpar período`
- exibe estado vazio para filtros combinados sem resultado

### Camada 2. Fluxo E2E de geração

Arquivo:

- `e2e/schedule-generation.spec.js`

Validações cobertas:

- geração de escala com mensagem contextual de sucesso
- presença do histórico com contexto operacional
- destaque da escala mais recente
- presença da informação de atualização no item mais recente

### Camada 3. Fluxo E2E de histórico com filtro temporal

Arquivo:

- `e2e/schedule-generation.spec.js`

Validações cobertas:

- seed com múltiplas escalas salvas
- filtro por data inicial e data final
- exibição do período ativo
- combinação de filtro temporal com busca textual
- visualização de escala salva após filtragem
- estado vazio quando os filtros combinados não retornam itens
- restauração da lista completa após `Limpar busca` e `Limpar período`

## Itens Cobertos pelo V12

- localização de escalas por intervalo temporal
- feedback de período ativo
- manutenção da busca textual sobre subconjunto filtrado
- restauração simples do histórico completo
- manutenção da navegação e da visualização após múltiplos recortes

## Itens Ainda Fora do Escopo

- atalhos rápidos de período
- agrupamento por mês
- paginação ou carregamento incremental do histórico
- combinação de múltiplos filtros estruturados
- ordenação customizada pelo usuário

## Conclusão

O V12 deixou o fluxo de filtro temporal do histórico melhor documentado
e melhor protegido:

- a melhoria funcional ficou coberta em componente e em E2E
- o comportamento mais importante já está validado em uso real
- o próximo passo pode se concentrar em ergonomia de consulta, não em
  correção da base recém-evoluída
