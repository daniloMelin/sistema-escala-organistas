# Schedule Rules Impact V20

## Contexto

Este artefato consolida o impacto funcional observado durante a fase 2
do `V20`.

O objetivo do ciclo foi refinar a lógica principal da geração de escala,
com foco em justiça percebida, previsibilidade e coerência com o modelo
real de operação das igrejas.

## Impacto por frente

### Justiça global de carga

O primeiro impacto relevante do `V20` foi reduzir a chance de o
algoritmo “zerar uma função” às custas de piorar a distribuição total.

Impacto prático:

- a escolha em slots simples passou a considerar carga total antes de
  buscar equilíbrio fino por função
- o algoritmo evita melhor concentrar novas atribuições em quem já está
  mais carregada
- a distribuição fica mais fácil de justificar quando várias candidatas
  são elegíveis

Resultado: a sensação de justiça melhora em cenários simples de empate,
sem abrir mão das restrições existentes.

### Dupla de `Culto + Reserva`

O segundo impacto foi tornar a composição da dupla menos propensa a
reforçar concentrações silenciosas.

Impacto prático:

- a dupla escolhida passa a privilegiar menor carga total acumulada
- o algoritmo evita esgotar candidatas mais carregadas quando existe
  par mais leve viável
- a distribuição entre papéis continua respeitando coerência por função

Resultado: o modelo com `Culto + Reserva` fica mais defensável como
regra de negócio, e não apenas como preenchimento local do dia.

### Escassez em três funções

O terceiro impacto foi melhorar a forma como a lógica trata organistas
escassas no modelo com `MeiaHoraCulto`, `Parte1` e `Parte2`.

Impacto prático:

- o trio do dia passa a preferir equipe mais flexível quando isso cobre
  o dia sem depender da organista escassa
- a organista escassa deixa de ser consumida em empates confortáveis
- a regra fica mais alinhada à ideia de preservar opções futuras

Resultado: o modelo com `3` funções ganha uma noção mais madura de
escassez, especialmente em cenários com alternativas suficientes.

## Resultado consolidado

O ganho principal do `V20` até a fase 3 foi tornar a regra de negócio
mais explicável do ponto de vista operacional:

- menos concentração desnecessária por carga total
- escolha mais defensável em dupla `Culto + Reserva`
- preservação melhor de organistas escassas em cenários densos

O ciclo melhora a qualidade da decisão algorítmica sem precisar ampliar
escopo funcional do produto.

## Risco residual

O risco residual aceito nesta fase é de refinamento fino, não de falha
estrutural.

- ainda pode haver ajustes menores de desempate em cenários muito
  específicos
- a percepção humana de justiça ao longo de períodos maiores continua
  relevante como validação manual
- regras futuras podem aprofundar histórico e prioridade por contexto de
  igreja sem invalidar os ganhos atuais

Para o escopo do `V20`, a lógica da escala já está mais coerente e
defensável para o fechamento do ciclo.
