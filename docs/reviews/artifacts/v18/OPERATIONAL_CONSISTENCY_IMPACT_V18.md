# Operational Consistency Impact V18

## Contexto

Este artefato consolida o impacto operacional observado durante a
fase 2 do `V18`.

O objetivo do ciclo foi revisar fluxos já existentes como jornadas
completas, corrigindo inconsistências reais e evitando expandir
funcionalidade antes de estabilizar a base.

## Impacto por fluxo

### Igrejas

O fluxo de igrejas foi validado como base dos demais fluxos.

Impacto prático:

- edição de igreja legada continua preservando `code`, mesmo sem campo
  visível na interface
- troca de modelo de culto reconstrói a configuração esperada
- exclusão da igreja em edição limpa o formulário e evita estado visual
  inconsistente
- ensaio local permanece visível na lista quando há dado válido

Resultado: o cadastro de igreja fica mais confiável como origem dos
dados usados por organistas, escala e PDF.

### Organistas

O fluxo de organistas foi revisado com foco nas regras de nome do `V17`
e na consistência da disponibilidade.

Impacto prático:

- nomes inválidos são bloqueados antes da persistência
- duplicidade dentro da mesma igreja continua protegida
- nomes legados permanecem editáveis quando não são alterados
- disponibilidade antiga de domingo continua compatível com
  `sunday_culto`
- exclusão da organista em edição agora limpa o formulário

Resultado: o painel da igreja fica menos propenso a manter estados
obsoletos durante edição e exclusão.

### Escala

O fluxo de geração foi revisado no limite operacional de `3` meses.

Impacto prático:

- períodos que entram no quarto mês são bloqueados antes de gerar
- escala válida é gerada, salva e recarregada no histórico
- escala salva pode ser reaberta preservando período e dados
- modelos com `2` e `3` organistas por dia continuam cobertos pela
  lógica de distribuição

Resultado: a geração da escala fica protegida como jornada completa,
não apenas como algoritmo isolado.

### Visualização e PDF

A comparação entre tela e PDF identificou uma divergência
informacional: serviços configurados, mas ainda vagos, apareciam na
tela e podiam desaparecer do PDF.

Impacto prático:

- o PDF passou a manter colunas de serviços sem atribuição
- slots como `Parte 1` e `Parte 2` não somem quando estão vagos
- tela e PDF agora preservam a mesma estrutura informacional da escala

Resultado: o PDF fica mais fiel à visualização operacional, mesmo antes
do refinamento visual previsto para o `V19`.

## Resultado consolidado

A fase 2 reduziu risco operacional nos pontos que alimentam o uso real:

- origem dos dados: igreja
- pessoas e disponibilidade: organistas
- produção da escala: geração e histórico
- saída final: visualização e PDF

O ganho principal do `V18` não foi adicionar novas funções, mas reduzir
surpresas em fluxos existentes.

## Risco residual

O risco residual aceito nesta fase é visual, não informacional.

- revisão fina de layout do PDF em `A4` permanece no `V19`
- regras avançadas de distribuição permanecem no `V20`
- validação manual completa em ambiente real ainda pode revelar ajustes
  de ergonomia

Para o escopo do `V18`, os fluxos revisados estão consistentes o
suficiente para seguir para cobertura, fechamento e próximos ciclos.
