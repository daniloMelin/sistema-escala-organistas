# Revisão de Filtro por Período do Histórico V12

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão           |
| ------ | ------------------- | ------------ | ------------------------------ |
| 1.0    | 26 de março de 2026 | Danilo Melin | Revisão de filtro temporal V12 |

## Objetivo

Comparar opções de filtro temporal para o histórico de escalas e
escolher a melhoria de maior valor imediato para o ciclo V12.

## Problema Atual

Após o V11, o histórico já permite:

- busca textual
- contagem de resultados
- limpeza rápida da busca

Isso reduziu o atrito de consulta, mas ainda deixa uma lacuna clara:

- quando o usuário lembra o período aproximado da escala, mas não um
  texto específico, a busca textual ainda exige tentativa e erro

## Opções Avaliadas

### Opção 1. Filtro por data inicial e data final

Ideia:

- permitir ao usuário informar um intervalo de datas
- exibir apenas escalas cujo período esteja dentro do recorte informado

Vantagens:

- alinhamento forte com o domínio da escala
- alta precisão para localizar intervalos específicos
- combina bem com a busca textual já existente

Limitações:

- exige regras claras de comparação entre intervalo filtrado e período
  salvo
- adiciona mais campos à interface

### Opção 2. Filtro por mês e ano

Ideia:

- permitir recorte do histórico por um mês/ano específico

Vantagens:

- interface mais compacta
- bom valor para navegação de histórico mais extenso

Limitações:

- menos preciso para escalas que atravessam meses
- força um recorte mensal mesmo quando o usuário pensa em intervalo

### Opção 3. Atalhos prontos de período

Ideia:

- criar opções como:
  - últimas 5 escalas
  - este mês
  - último mês

Vantagens:

- interação rápida
- pouco esforço de preenchimento

Limitações:

- baixo controle para casos mais específicos
- pode gerar pouco valor se usado antes de um filtro estruturado base

## Melhoria Prioritária Escolhida

Para a Fase 1.2, a melhoria de maior valor imediato é:

- **filtro por data inicial e data final**

## Justificativa da Escolha

- resolve uma lacuna real não coberta pela busca textual
- respeita melhor o domínio do histórico de escalas
- permite coexistir com a busca já entregue no V11
- cria base mais sólida para futuros atalhos ou agrupamentos

## Regra Recomendada para a Fase 1.2

O filtro deve considerar:

- `Data inicial do filtro`
- `Data final do filtro`

Critério recomendado:

- exibir a escala quando o período salvo estiver contido no intervalo
  informado pelo usuário

Exemplos:

- filtro `01/03/2026` até `31/03/2026` deve exibir escalas inteiramente
  dentro de março
- filtro `01/02/2026` até `02/02/2026` deve exibir exatamente a escala
  daquele período

## Coexistência com a Busca Textual

Diretriz recomendada:

- aplicar o filtro temporal primeiro
- aplicar a busca textual sobre o subconjunto resultante

Isso preserva a clareza do fluxo:

- período reduz o conjunto macro
- busca textual refina o conjunto final

## Escopo Recomendado para a Fase 1.2

- dois campos de data no histórico:
  - início
  - fim
- filtragem em tempo real ou após mudança dos campos
- compatibilidade com a busca textual já existente
- estado vazio coerente para combinação de busca e período
- cobertura inicial de componente para o novo comportamento

## Próximo Passo

Implementar o filtro por data inicial e data final no histórico,
preservando a busca textual do V11 e cobrindo a nova combinação com
teste de componente.
