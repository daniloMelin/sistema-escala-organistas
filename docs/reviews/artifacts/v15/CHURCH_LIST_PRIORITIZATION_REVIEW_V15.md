# Revisão da Priorização Operacional da Lista de Igrejas - V15

## Objetivo

Definir qual melhoria entrega mais valor na lista principal de igrejas
quando o número de igrejas por pessoa responsável tende a ser baixo.

## Contexto de Uso

O cenário real de uso atual indica que:

- normalmente existe um encarregado por igreja
- em alguns casos a mesma pessoa acompanha mais de uma igreja
- mesmo nesses casos, o volume tende a ser pequeno, em torno de até 3
  igrejas

Nesse contexto, a tela inicial não precisa resolver um problema de busca
em listas longas. Ela precisa ajudar a responder rapidamente:

- qual igreja precisa atenção primeiro
- qual igreja já está pronta para operar
- qual igreja pode esperar

## Opções Avaliadas

### 1. Busca textual por nome ou código

- Valor:
  - baixo a médio
  - ajudaria a localizar rapidamente uma igreja específica
- Vantagens:
  - implementação relativamente simples
  - padrão familiar em listas administrativas
- Limitações:
  - pouco ganho para volume pequeno de igrejas
  - adiciona estado e UI extra sem atacar a principal dor atual

### 2. Filtro simples por status operacional

- Valor:
  - médio
  - pode ajudar a isolar igrejas em `Atenção` ou `Incompleta`
- Vantagens:
  - conversa diretamente com o resumo do V14
  - pode ser útil para priorização em cenários pontuais
- Limitações:
  - pode ser mais mecanismo do que necessidade no volume atual
  - ainda exige interação extra para algo que a ordem da lista pode
    resolver de forma mais leve

### 3. Ordenação por prioridade operacional

- Valor:
  - alto
  - resolve melhor a dor de decidir qual igreja olhar primeiro
- Vantagens:
  - usa os sinais já entregues no V14
  - não exige campo novo nem filtro adicional
  - reduz esforço cognitivo com mínima complexidade
- Limitações:
  - exige cuidado para a ordenação não parecer arbitrária
  - precisa deixar o critério visível e previsível

### 4. Destaque visual da igreja que precisa atenção

- Valor:
  - alto
  - reforça a priorização mesmo em listas curtas
- Vantagens:
  - complementa bem a ordenação
  - melhora leitura sem exigir ação do usuário
- Limitações:
  - precisa ser sutil para não transformar a lista em painel pesado

## Decisão da Fase 1.1

A melhoria prioritária do V15 será:

1. priorizar a ordenação operacional da lista de igrejas
2. complementar com destaque visual leve para reforçar o estado
3. deixar busca textual fora da prioridade atual

## Diretriz para a Fase 1.2

- ordenar a lista com foco em prioridade operacional
- manter previsibilidade do critério usado
- preservar a leitura já entregue de:
  - prontidão
  - modelo de culto
  - organistas
  - escalas
- evitar campo de busca nesta etapa

## Ordem Inicial Recomendada

Critério sugerido para a primeira versão:

1. `Incompleta`
2. `Atenção`
3. `Pronta`
4. dentro do mesmo grupo, ordenar por nome

## Conclusão

Para o uso real atual, o melhor ganho não está em “achar” a igreja, e
sim em destacar qual precisa ação primeiro.

Por isso, o V15 deve priorizar:

- ordenação por prioridade operacional
- reforço visual leve da prontidão

Em vez de:

- busca textual
- filtros mais sofisticados
