# Performance Impact V23

## Contexto

Este artefato consolida o impacto prático do `V23` após a execução da
fase 2.

O ciclo foi desenhado para atacar primeiro a performance percebida do
shell autenticado, especialmente nos pontos em que a aplicação parecia
"saltar" ou só se organizar tarde demais durante carregamento.

## Impacto por frente

### Shell autenticado

O ganho mais consistente do `V23` foi tornar o shell autenticado mais
previsível.

Impacto prático:

- a lista de igrejas passou a renderizar uma base útil mais cedo
- o dashboard deixou de depender apenas de `selectedChurch` e passou a
  responder melhor a acessos diretos por rota
- placeholders e alturas mínimas reduziram a troca brusca entre estado
  vazio e estado carregado

Resultado:

- a experiência principal ficou visualmente mais estável
- o dashboard deixou de concentrar um `CLS` extremo como no baseline
  inicial

### Entrada e fallback de carregamento

O segundo impacto foi na percepção do bootstrap.

Impacto prático:

- o app deixou de usar um fallback seco de `Carregando...`
- o `Suspense` passou a mostrar um shell próximo da tela real
- as rotas lazy principais começaram a ser pré-carregadas após
  autenticação

Resultado:

- a entrada ficou menos abrupta
- a home respondeu melhor ao objetivo central do ciclo, estabilizando o
  `CLS`

### Gerador e histórico de escala

O terceiro impacto foi reduzir ambiguidade visual no fluxo de escala.

Impacto prático:

- igreja, organistas e histórico passaram a carregar em paralelo
- o histórico não parece mais vazio enquanto ainda está hidratando
- o topo do gerador ficou com altura mais previsível

Resultado:

- o gerador ficou mais coerente como experiência
- ainda assim, ele permaneceu como a rota com pior `CLS` residual entre
  as telas autenticadas medidas

### Qualidade complementar

O bloco final do `V23` atacou ganhos rápidos fora do núcleo do bundle.

Impacto prático:

- contraste de botões principais e textos de apoio ficou mais forte
- `robots.txt` válido deixou de ser pendência aberta

Resultado:

- o ciclo eliminou duas frentes baratas de `Accessibility` e `SEO`
- isso não foi suficiente para deslocar a nota de `Performance`, mas
  limpou o terreno para os próximos ciclos

## Resultado consolidado

O impacto real do `V23` foi mudar o gargalo dominante do sistema:

- no começo do ciclo, o principal problema era `CLS` alto no shell
  autenticado
- ao fim da fase 2, esse risco caiu de forma consistente
- com isso, o gargalo dominante ficou mais claramente exposto em `LCP`
  e carga inicial de rota

Em outras palavras:

- o `V23` não fechou a meta de `> 80` nas telas autenticadas
- mas ele entregou a base correta para que o `V24` trate o próximo
  problema de verdade, em vez de continuar brigando com sintomas visuais

## Risco residual

O risco residual aceito ao final do `V23` é:

- `LCP` ainda alto na lista autenticada, dashboard e gerador
- bundle inicial ainda maior do que o ideal para a rota crítica
- Best Practices ainda influenciado pelo fluxo de cookies de terceiros do
  Firebase Auth

Para o escopo do `V23`, esse residual é aceitável porque o ciclo cumpriu
o papel de estabilizar a percepção do shell e preparar uma frente mais
cirúrgica para o `V24`.
