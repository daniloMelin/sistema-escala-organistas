# Cobertura do Ensaio Local por Igreja - V16

## Objetivo

Consolidar a cobertura funcional e automatizada do fluxo de ensaio local
introduzido no `V16`, deixando explícito o que já foi validado e o que
continua fora do escopo do ciclo.

## Cobertura de Formulário

Arquivo:

- `src/test/churchForm.test.js`

Cenários cobertos:

- exibição do bloco de ensaio local no formulário da igreja
- alteração de:
  - semana do mês
  - dia da semana
  - horário
  - observação opcional
- integração do ensaio com o submit do formulário
- manutenção do fluxo de edição com botão `Cancelar`

## Cobertura do Hook

Arquivo:

- `src/test/useChurchManager.test.js`

Cenários cobertos:

- persistência do ensaio local estruturado ao cadastrar igreja
- carregamento do ensaio local ao iniciar edição da igreja
- manutenção do ensaio no mesmo fluxo do cadastro principal

## Cobertura de Exibição

Arquivos:

- `src/test/churchList.test.js`
- `src/test/churchDashboard.test.js`

Cenários cobertos:

- resumo do ensaio local na lista de igrejas
- exibição do ensaio local mesmo sem resumo operacional
- exibição do ensaio local no painel da igreja
- exibição da observação opcional no painel quando presente

## Cobertura de Validação

Arquivo:

- `src/test/validation.test.js`

Cenários cobertos:

- ensaio ausente
- horário inválido
- ensaio completo válido

## Cobertura Ponta a Ponta

Arquivo:

- `e2e/church-management.spec.js`

Cenários cobertos:

- cadastro de nova igreja com ensaio local
- edição de igreja existente com atualização do ensaio local
- exibição do ensaio local na lista após persistência
- exibição do ensaio local no painel da igreja
- preservação do restante do fluxo de gerenciamento de igrejas

## Itens ainda fora do escopo

O `V16` não cobre ainda:

- exibição do ensaio local no PDF da escala
- cálculo automático da data real do ensaio em cada mês
- alertas ou regras automáticas relacionadas ao ensaio local
- uso do ensaio local dentro do algoritmo de geração da escala

## Conclusão

O fluxo principal do ensaio local ficou coberto em quatro camadas:

1. formulário
2. hook de gerenciamento
3. exibição na interface
4. validação ponta a ponta

Com isso, o `V16` chega ao final do ciclo com cobertura funcional
compatível com o escopo entregue.
