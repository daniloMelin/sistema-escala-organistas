# Cobertura da Priorização Operacional da Lista de Igrejas V15

## Objetivo

Consolidar a cobertura funcional e documental da priorização
operacional entregue no V15, registrando o que ficou protegido em
componente, hook e fluxo ponta a ponta.

## Escopo Coberto no V15

O ciclo passou a proteger a lista principal de igrejas em três camadas:

1. componente de apresentação da lista
2. hook responsável pelo enriquecimento e ordenação da lista
3. fluxo E2E de uso real da tela

## Camada 1 - Componente da Lista

Arquivo:

- `src/test/churchList.test.js`

Coberturas consolidadas:

- renderização do resumo operacional por igreja
- exibição do selo de prontidão
- exibição do detalhe textual do status
- exibição do modelo de culto, total de organistas e total de escalas
- manutenção das ações existentes:
  - selecionar igreja
  - editar
  - excluir
- preservação do estado vazio
- não exibição do estado vazio quando há erro de carregamento
- aplicação do destaque visual por classe de prioridade:
  - `church-list__item--incomplete`
  - `church-list__item--warning`
  - `church-list__item--ready`
- exibição da dica de priorização no topo da lista
- exibição dos labels auxiliares:
  - `Prioridade incompleta`
  - `Prioridade atenção`
  - `Prioridade pronta`

## Camada 2 - Hook de Gerenciamento da Lista

Arquivo:

- `src/test/useChurchManager.test.js`

Coberturas consolidadas:

- manutenção da lista carregada quando o resumo de uma igreja falha
- preservação do carregamento das demais igrejas válidas
- uso da contagem total real de escalas no resumo operacional
- ordenação por prioridade operacional:
  1. `Incompleta`
  2. `Atenção`
  3. `Pronta`
- desempate por nome dentro do mesmo grupo de prioridade

Essa camada protege a regra mais importante do V15:

- a lista não apenas mostra o estado operacional
- ela também decide a ordem de apresentação conforme a urgência prática

## Camada 3 - Fluxo Ponta a Ponta

Arquivo:

- `e2e/church-management.spec.js`

Coberturas consolidadas:

- exibição simultânea de igrejas `Pronta`, `Atenção` e `Incompleta`
- validação da dica de priorização no topo da lista
- validação da ordem operacional dos itens exibidos
- validação dos labels auxiliares por prioridade
- preservação da navegação da lista para o painel da igreja

Essa camada confirma que a priorização não ficou restrita ao nível de
componente isolado: ela funciona no fluxo real de uso da tela.

## Itens Protegidos pelo V15

Ao final do ciclo, ficaram cobertos:

- decisão de não priorizar busca textual no cenário atual
- ordenação operacional da lista principal
- reforço visual leve por prioridade
- clareza textual sobre o motivo da prioridade
- robustez do carregamento quando uma igreja falha no enriquecimento
- manutenção da navegação normal para o painel da igreja

## Itens Fora do Escopo Atual

Continuam fora do V15:

- campo de busca por igreja
- filtros por status ou modelo
- métricas adicionais como última atividade
- sinais operacionais mais avançados
- detalhamento de distribuição por organista na lista principal

## Conclusão

O V15 consolidou cobertura suficiente para a melhoria proposta:

- a lista principal passou a priorizar melhor o que deve ser visto
  primeiro
- essa priorização ficou protegida em apresentação, regra e uso real
- a documentação agora deixa claro o que foi coberto e o que permanece
  como evolução futura
