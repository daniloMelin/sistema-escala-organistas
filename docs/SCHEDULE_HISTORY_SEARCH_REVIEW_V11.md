# Revisão de Busca e Filtro do Histórico V11

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão          |
| ------ | ------------------- | ------------ | ----------------------------- |
| 1.0    | 24 de março de 2026 | Danilo Melin | Revisão de busca do histórico |

## Objetivo

Comparar opções de localização para o histórico de escalas e escolher a
melhoria de maior valor imediato para o ciclo V11.

## Problema Atual

Após o V10, o histórico ficou mais legível, mas ainda depende de leitura
linear quando o volume de escalas aumenta.

O usuário ainda precisa percorrer a lista manualmente para:

- localizar um período específico
- diferenciar rapidamente escalas próximas
- encontrar uma entrada antiga sem abrir múltiplos itens

## Opções Avaliadas

### Opção 1. Busca textual simples

Ideia:

- adicionar um campo de busca acima do histórico
- filtrar a lista por texto digitado

Campos naturalmente pesquisáveis com a estrutura atual:

- período formatado
- data de atualização formatada
- resumo contextual do item

Vantagens:

- implementação direta
- baixo acoplamento
- pouco impacto visual
- valor imediato para listas maiores

Limitações:

- depende de o usuário digitar parte do texto esperado
- não organiza semanticamente por mês ou categoria

### Opção 2. Filtro por período/data

Ideia:

- adicionar filtros mais estruturados por data inicial/final
- ou por mês/ano

Vantagens:

- alinhamento forte com o domínio da escala
- boa precisão para localizar intervalos específicos

Limitações:

- exige interface mais pesada
- adiciona mais decisão para o usuário
- aumenta o escopo do componente logo no início do ciclo

### Opção 3. Agrupamento por mês

Ideia:

- separar o histórico por grupos de mês/ano

Vantagens:

- melhora navegação em volume maior
- mantém interação passiva, sem exigir digitação

Limitações:

- resolve organização, mas não busca direta
- aumenta a complexidade visual
- pode ser melhor como evolução posterior, não como primeiro passo

## Melhoria Prioritária Escolhida

Para a Fase 1.2, a melhoria de maior valor imediato é:

- **busca textual simples no histórico de escalas**

## Justificativa da Escolha

- reaproveita os dados já exibidos no histórico
- entrega ganho de localização sem ampliar demais o escopo
- mantém o fluxo atual simples
- cria base natural para filtros ou agrupamento em ciclos futuros

## Escopo Recomendado para a Fase 1.2

- campo de busca acima da lista de histórico
- filtro em tempo real
- mensagem de estado vazio específica para busca sem resultados
- preservação do destaque `Mais recente` quando aplicável ao conjunto filtrado

## Próximo Passo

Implementar a busca textual no histórico, cobrir o comportamento com
teste de componente e validar o fluxo em cenário E2E com múltiplas
escalas salvas.
