# Operational Consistency Review V18

## Contexto

O `V18` foca em consistência operacional. A intenção do ciclo não é
abrir grande frente funcional nova, mas confirmar que o que já existe
está estável, coerente e pronto para suportar os próximos incrementos.

O sistema ainda está em fase de refinamento, com uso principal em teste
manual. Isso reduz o custo de ajuste e torna este um bom momento para
revisar os fluxos principais como jornada completa.

## Eixos de revisão do ciclo

### Igrejas

- cadastro de igreja com ensaio local
- edição de igreja com manutenção do modelo de culto
- exclusão de igreja sem efeito colateral indevido

### Organistas

- cadastro de organista com as regras do `V17`
- edição de disponibilidade
- exclusão e atualização da listagem

### Escala

- geração no intervalo fechado de `3` meses
- coerência da distribuição entre organistas
- persistência e reabertura da escala já salva

### Visualização e PDF

- alinhamento de informações entre tela e PDF
- resumo do período exibido corretamente
- ensaio local presente e formatado corretamente
- legibilidade e uso real da folha A4

## Riscos iniciais observados

- regressões silenciosas em fluxo já ajustado recentemente
- diferença entre comportamento manual e proteção automatizada
- divergência entre o que aparece na tela e o que sai no PDF
- dependência excessiva de conferência visual sem checklist consolidado

## Diretriz de trabalho

- começar pelos fluxos que mais afetam a operação
- registrar comportamento esperado antes de alterar código
- corrigir com escopo pequeno sempre que possível
- proteger com teste apenas o que reduz risco real de regressão

## Checklist operacional da fase 1

### 1. Igrejas

Objetivo: confirmar que o cadastro de igreja continua funcionando como
jornada completa após os ciclos de ensaio local, modelo de culto e
qualidade de formulário.

Checklist:

- cadastrar igreja com nome válido, modelo de culto e ensaio local
- editar nome, modelo de culto, dias de culto e ensaio local
- confirmar que o campo `Código` não aparece na experiência principal
- conferir se igrejas legadas com `code` continuam abrindo e editando
- excluir igreja e confirmar remoção da lista
- validar mensagens de erro para nome inválido e ensaio incompleto

Critério de aceite:

- a igreja salva deve voltar na lista com nome, modelo operacional e
  ensaio local coerentes
- a edição não deve apagar dados não alterados
- a exclusão não deve deixar a lista em estado visual inconsistente

### 2. Organistas

Objetivo: validar o fluxo principal de organistas com as regras
introduzidas no `V17`.

Checklist:

- cadastrar organista com primeiro nome
- cadastrar organista com nome e sobrenome
- rejeitar números, símbolos e mais de duas palavras
- editar disponibilidade sem alterar nome
- preservar organista legado quando o nome antigo não atender ao novo
  limite
- impedir duplicidade de nome dentro da mesma igreja
- excluir organista e confirmar atualização da lista

Critério de aceite:

- mensagens de erro devem aparecer no campo correto
- disponibilidade deve persistir de forma coerente com os dias visíveis
- dados legados devem continuar editáveis quando o nome for mantido

### 3. Escala

Objetivo: confirmar que a geração continua coerente com o limite de
período e com os modelos de culto configuráveis.

Checklist:

- gerar escala dentro do período máximo de `3` meses
- bloquear tentativa de gerar período que entra no quarto mês
- validar cenário com `2` organistas por dia
- validar cenário com `3` organistas por dia
- confirmar que reservas e cultos independentes não se misturam
- salvar escala gerada e recarregar histórico

Critério de aceite:

- a escala gerada deve respeitar o modelo da igreja
- o período exibido deve corresponder ao período solicitado
- histórico salvo deve reabrir sem perda de dados relevantes

### 4. Visualização e PDF

Objetivo: revisar a consistência entre o que aparece na tela e o que é
exportado.

Checklist:

- comparar período exibido na tela com período do PDF
- conferir se o ensaio local aparece com a mesma recorrência
- validar presença dos cultos esperados no PDF
- validar nomes de organistas em cenários com múltiplas atribuições
- revisar legibilidade básica em `A4`
- identificar divergências de informação entre tela e PDF

Critério de aceite:

- PDF e tela devem comunicar o mesmo período, igreja e ensaio local
- diferenças visuais são aceitáveis; diferenças informacionais não são
- qualquer divergência operacional deve virar correção ou risco residual
  documentado

## Priorização inicial da fase 2

1. Igreja com ensaio local e modelo de culto
2. Organistas com regras novas do `V17`
3. Geração de escala no limite de `3` meses
4. Comparação entre visualização e PDF

Essa ordem privilegia os fluxos que alimentam os demais: primeiro a
base de igreja, depois os dados de organistas, em seguida a geração e,
por fim, a saída visual/PDF.

## Execução da fase 2 - fluxo de igrejas

### Escopo de igrejas revisado

O primeiro bloco executado foi o fluxo de igrejas, por ser a base dos
demais fluxos operacionais.

Itens avaliados:

- cadastro de igreja com ensaio local estruturado
- edição de igreja com alteração de nome, modelo de culto e manutenção
  dos dias selecionados
- preservação de `code` legado mesmo sem campo visível na interface
- exibição do ensaio local na lista com e sem resumo operacional
- ausência do campo `Código` na experiência principal
- exclusão de igreja e limpeza do estado de edição quando a igreja
  excluída era a que estava aberta no formulário

### Resultado em igrejas

Não foi identificada regressão funcional no fluxo de igrejas.

A revisão apontou apenas a necessidade de deixar alguns comportamentos
críticos mais protegidos por testes automatizados:

- edição de igreja legada preservando `code`
- troca de modelo de culto durante edição
- exclusão da igreja atualmente em edição limpando o formulário

### Cobertura adicionada em igrejas

`src/test/useChurchManager.test.js` passou a cobrir:

- atualização de igreja legada preservando `code`
- reconstrução da configuração ao trocar o modelo para
  `culto_unico_com_reserva`
- exclusão da igreja em edição com reset de `editingId`, `churchName` e
  `pendingDeleteChurch`

### Validação executada em igrejas

- testes focados:

  ```bash
  npm test -- --runTestsByPath \
    src/test/useChurchManager.test.js \
    src/test/churchForm.test.js \
    src/test/churchList.test.js \
    src/test/rehearsal.test.js \
    src/test/churchCultModel.test.js \
    --watchAll=false
  ```

- `npm run lint -- --max-warnings=0`

## Execução da fase 2 - fluxo de organistas

### Escopo de organistas revisado

O segundo bloco executado foi o fluxo de organistas, aproveitando as
regras de qualidade de formulário consolidadas no `V17`.

Itens avaliados:

- cadastro com primeiro nome e nome com sobrenome
- bloqueio de números, símbolos e mais de duas palavras
- validação no envio, além do feedback ao perder foco
- prevenção de duplicidade dentro da mesma igreja
- edição de disponibilidade sem alterar nome
- preservação de nome legado quando mantido sem alteração
- mapeamento de disponibilidade antiga de `sunday` para `sunday_culto`
- exclusão de organista e atualização do estado do formulário

### Resultado em organistas

Foi identificada uma inconsistência operacional pequena:

- ao excluir a organista que estava aberta em edição, o formulário podia
  permanecer com o estado de edição preenchido

A correção aplicada faz o fluxo cancelar a edição quando a organista
excluída é a mesma que está aberta no formulário.

### Cobertura adicionada em organistas

`src/test/useChurchDashboard.test.js` passou a cobrir:

- bloqueio de envio com nome inválido da organista
- limpeza de `editingId`, `newOrganistName`, `availability` e
  `pendingDeleteOrganist` ao excluir a organista em edição

### Validação executada em organistas

- testes focados:

  ```bash
  npm test -- --runTestsByPath \
    src/test/useChurchDashboard.test.js \
    src/test/organistForm.test.js \
    src/test/organistList.test.js \
    src/test/validation.test.js \
    --watchAll=false
  ```

## Resultado esperado do ciclo

Ao final do `V18`, o sistema deve ter:

- checklist operacional consolidado
- regressões críticas tratadas
- evidência objetiva do que foi validado
- base mais estável para ciclos futuros de PDF, regras de negócio e produção
