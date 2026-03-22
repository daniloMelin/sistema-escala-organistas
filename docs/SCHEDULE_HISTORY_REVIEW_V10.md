# Revisão do Histórico de Escalas V10

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão     |
| ------ | ------------------- | ------------ | ------------------------ |
| 1.0    | 22 de março de 2026 | Danilo Melin | Revisão do histórico V10 |

## Objetivo

Registrar a leitura funcional do histórico de escalas antes de
implementar a próxima melhoria no fluxo operacional.

## Estado Atual

O histórico atual apresenta, para cada escala salva:

- período da escala
- data/hora da última atualização
- ação `Visualizar`

Comportamento observado:

- a lista é ocultada durante edição
- os itens são exibidos em ordem recente
- o fluxo E2E atual só valida presença do histórico e do botão de
  visualização

## Pontos Fortes

- o histórico já existe e está integrado ao fluxo principal de geração
- a ação de visualização é direta e reutiliza o mesmo fluxo da escala
  atual
- a atualização da lista após geração e edição já está coberta pelo hook

## Lacunas de Experiência

### 1. Baixo contexto por item

Hoje os itens do histórico ajudam pouco a responder rapidamente:

- quantos dias essa escala cobre
- quantas organistas participaram do contexto salvo
- qual item é o mais recente sem depender apenas da data

### 2. Diferenciação visual limitada

Quando houver múltiplas escalas próximas, o histórico tende a ficar
homogêneo demais. O usuário precisa ler data e período com atenção para
identificar a entrada desejada.

### 3. Cobertura funcional ainda superficial

O cenário E2E atual valida a existência do histórico, mas não o valor
informacional dos itens exibidos ao usuário.

## Melhoria Prioritária Escolhida

Para a Fase 1.2, a melhoria de maior valor imediato é:

- enriquecer cada item do histórico com um resumo contextual curto
- destacar visualmente a escala mais recente

Resumo proposto por item:

- período
- data/hora da atualização
- quantidade de dias da escala salva
- quantidade de organistas consideradas no momento do salvamento

Destaque adicional:

- primeiro item identificado como `Mais recente`

## Justificativa da Escolha

- agrega valor operacional imediato sem ampliar demais o escopo
- reaproveita dados que o sistema já salva, como `organistCount`
- melhora leitura do histórico sem alterar o fluxo principal de geração
- cria uma evolução funcional clara e fácil de validar por teste

## Próximo Passo

Implementar a melhoria priorizada no componente de histórico, atualizar
testes unitários e reforçar a cobertura E2E do fluxo.
