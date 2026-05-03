# PDF Quality Review V19

## Contexto

O `V19` concentra a revisão da saída em PDF do sistema. O objetivo é
garantir uma experiência final consistente, legível e adequada ao uso
real em folha `A4`.

## Eixos de revisão do ciclo

- legibilidade da tabela principal
- densidade de informação por página
- consistência entre visualização e exportação
- comportamento em cenários com `2` e `3` organistas
- utilidade prática do resumo do período e do ensaio local

## Diagnóstico visual consolidado da fase 1

O `V19` parte de uma base funcional melhor do que a dos ciclos
anteriores. O `V18` já reduziu divergências informacionais relevantes
entre tela e PDF, então agora o foco passa a ser qualidade de leitura e
acabamento visual.

Os pontos mais sensíveis observados para a fase 2 são:

- dias com `2` organistas, que já aumentam densidade horizontal
- dias com `3` organistas, que pressionam largura útil e abreviações
- serviços vagos que devem continuar visíveis sem parecer ruído
- resumo do período e ensaio local, que precisam ajudar sem roubar
  atenção da grade principal
- equilíbrio entre conteúdo útil e sensação de documento pronto para uso

## Critérios de aceite visual

### 1. Legibilidade em `A4`

- o calendário principal deve continuar sendo o foco da leitura
- nomes, siglas de serviços e datas devem permanecer distinguíveis após
  exportação
- o PDF não deve depender de zoom para ser compreendido em uso normal

### 2. Densidade controlada

- o documento deve acomodar informação operacional sem parecer apertado
- colunas estreitas podem usar abreviações, mas sem virar ambiguidade
- espaços em branco devem existir para separar blocos, não para dispersar
  informação

### 3. Consistência entre tela e PDF

- o PDF deve comunicar o mesmo período, igreja, cultos e ensaio local
- serviços exibidos na grade da tela não devem desaparecer no PDF
- diferenças aceitáveis são visuais; diferenças informacionais não são

### 4. Utilidade dos blocos auxiliares

- resumo do período deve reforçar contexto, não competir com a grade
- ensaio local deve permanecer fácil de localizar
- blocos auxiliares devem parecer parte do documento, não anexos soltos

## Cenários prioritários da fase 2

### 1. Grade principal com `2` organistas no dia

Objetivo: verificar se a tabela continua legível quando há múltiplas
atribuições sem ocupar espaço excessivo.

Sinais de reprovação:

- nomes quebrando de forma confusa
- siglas de serviço difíceis de distinguir
- altura de linha crescendo a ponto de prejudicar o conjunto

### 2. Grade principal com `3` organistas no dia

Objetivo: medir o limite visual da estrutura atual do PDF.

Sinais de reprovação:

- colunas comprimidas além do limite de leitura
- excesso de abreviação sem contexto suficiente
- hierarquia visual perdida entre cabeçalho, dias e serviços

### 3. Serviços vagos mantidos no PDF

Objetivo: garantir consistência visual quando a coluna existe, mas a
atribuição está vazia.

Sinais de reprovação:

- slot vago parecendo erro de renderização
- marcador vazio visualmente mais forte do que o conteúdo real
- desalinhamento entre dias parcialmente preenchidos

### 4. Resumo do período e ensaio local

Objetivo: validar se os blocos auxiliares ajudam na leitura operacional
sem poluir a folha.

Sinais de reprovação:

- bloco lateral ou superior tirando atenção da grade
- texto com peso visual maior do que o necessário
- repetição de informação já clara no cabeçalho principal

## Diretriz de execução da fase 2

1. revisar primeiro a grade principal do PDF
2. ajustar largura, abreviação e alinhamento antes de mexer em detalhes
   cosméticos
3. revisar os blocos auxiliares só depois de estabilizar a leitura da
   tabela
4. registrar risco residual apenas se a troca necessária ultrapassar o
   escopo do `V19`

## Execução inicial da fase 2

### Escopo revisado

O primeiro bloco executado no `V19` foi a grade principal do PDF, por
ser o componente mais sensível à densidade de informação.

Itens trabalhados:

- cenários com `4` e `5` serviços simultâneos no mesmo dia
- paginação mensal em layout paisagem `A4`
- largura útil da tabela em páginas com barra lateral
- legibilidade de data, siglas de serviço e nomes truncados

### Ajuste aplicado

O exportador passou a usar um perfil de layout denso quando a quantidade
de serviços por dia aumenta.

Nesse perfil:

- a grade usa `2` meses por página em vez de `3`
- a barra lateral fica mais compacta
- a coluna de data ganha mais largura
- títulos e nomes da tabela usam fonte ligeiramente maior
- o truncamento de nomes fica menos agressivo

### Resultado parcial

- a largura útil por mês aumentou nos cenários mais carregados
- a leitura de nomes e siglas ficou menos comprimida
- a mudança preserva o contrato atual do PDF e o comportamento dos casos
  menos densos

### Cobertura adicionada

`src/test/pdfGenerator.test.js` agora protege:

- manutenção de serviços vagos visíveis no PDF
- paginação mais folgada em cenário com múltiplos serviços e `3` meses
  no período
- quebra controlada de observação longa no ensaio local

## Consolidação da fase 2

### Blocos executados

- grade principal da tabela mensal
- barra lateral de resumo do período
- bloco de ensaio local com observações

### Resultado consolidado

- a fase 2 reduziu o principal gargalo de largura da grade em `A4`
- o resumo lateral ficou mais compacto nos cenários densos
- o ensaio local passou a acomodar observações maiores com quebra de
  linha controlada
- o contrato do exportador foi preservado, sem alterar o fluxo de
  exportação no restante do sistema

### Risco residual após a fase 2

- a aceitação visual final ainda depende de conferência manual com PDFs
  reais gerados no navegador
- refinamentos finos de espaçamento e percepção gráfica podem ficar para
  o fechamento do ciclo, sem bloquear a consolidação de cobertura e
  impacto

## Resultado esperado do ciclo

Ao final do `V19`, o PDF deve estar visualmente consolidado e com
critérios claros de qualidade para uso real.
