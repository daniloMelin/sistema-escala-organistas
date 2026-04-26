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

## Resultado esperado do ciclo

Ao final do `V18`, o sistema deve ter:

- checklist operacional consolidado
- regressões críticas tratadas
- evidência objetiva do que foi validado
- base mais estável para ciclos futuros de PDF, regras de negócio e produção
