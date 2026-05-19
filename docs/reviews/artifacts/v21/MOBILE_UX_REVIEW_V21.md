# Mobile UX Review V21

## Contexto

O `V21` consolida a experiência mobile do sistema, reunindo ajustes
pontuais anteriores em um ciclo de revisão mais completo e orientado por
uso real.

## Eixos de revisão do ciclo

- gerenciamento de igrejas
- gerenciamento de organistas
- geração de escala
- visualização da escala
- ações críticas em smartphone

## Checklist consolidado da fase 1

O `V21` parte de uma base funcional e visual mais madura do que nos
ciclos anteriores. O `V18` estabilizou fluxos principais, o `V19`
refinou o PDF e o `V20` consolidou a regra de negócio da escala. Agora o
foco passa a ser a qualidade da experiência em smartphone como conjunto.

Os pontos mais sensíveis observados para a fase 2 são:

- toolbars com muitas ações na mesma linha
- cards e listas com texto e botões competindo por espaço
- formulários com campos, erros e ações de submit em coluna estreita
- visualização da escala com blocos densos em largura reduzida
- necessidade de manter as ações críticas visíveis sem quebrar leitura

## Critérios de aceite mobile

### 1. Leitura clara em smartphone

- o conteúdo principal deve aparecer antes de detalhes secundários
- títulos, labels e valores não podem colidir ou cortar informação útil
- cards e listas devem continuar legíveis sem depender de zoom

### 2. Ações críticas acessíveis

- editar, excluir, gerar escala e baixar PDF devem continuar fáceis de
  acionar
- botões não devem competir de forma caótica com o conteúdo
- a ordem visual das ações deve seguir a prioridade operacional

### 3. Fluxo contínuo de uso

- formulários devem funcionar bem em coluna única
- mensagens de erro precisam aparecer perto do campo correto
- o avanço entre leitura, edição e confirmação deve parecer natural

### 4. Consistência entre mobile e desktop

- a adaptação para mobile deve reorganizar, não degradar
- o layout pode mudar, mas o fluxo principal não deve ficar ambíguo
- o comportamento responsivo deve parecer deliberado, não remendado

## Telas prioritárias da fase 2

### 1. Igrejas

Objetivo: revisar listagem, card e formulário de igreja em smartphone.

Checklist:

- validar leitura dos cards com nome, resumo e ações
- revisar posição dos botões de editar e excluir
- conferir se formulário de igreja respeita coluna única
- validar ensaio local e modelo de culto em largura estreita

Sinais de reprovação:

- ação crítica espremida ou fora de ordem
- resumo quebrando o card de forma confusa
- campos e mensagens de erro desalinhados

### 2. Organistas

Objetivo: revisar cadastro, lista e ações de organistas em smartphone.

Checklist:

- validar leitura do nome e disponibilidade
- revisar alinhamento entre conteúdo e ações
- conferir botões de editar e excluir em largura reduzida
- validar o formulário com erros em coluna única

Sinais de reprovação:

- ações competindo com o nome da organista
- disponibilidade ficando difícil de escanear
- formulário com botões ou mensagens fora de ritmo visual

### 3. Geração de escala

Objetivo: revisar os controles de geração em smartphone.

Checklist:

- validar datas, seleção de igreja e ações principais
- revisar ordem de leitura antes do clique em gerar
- conferir se loading, erro e sucesso continuam claros

Sinais de reprovação:

- toolbar ou controles quebrando em várias linhas sem critério
- CTA principal perdendo destaque
- erros ou estados de carregamento ficando pouco visíveis

### 4. Visualização da escala

Objetivo: revisar a tela mais densa do sistema em smartphone.

Checklist:

- validar toolbar com editar, salvar e baixar PDF
- revisar cards da escala e blocos auxiliares
- conferir leitura do resumo do período e do ensaio local
- validar se a navegação continua fluida em scroll vertical

Sinais de reprovação:

- muitas ações na mesma faixa horizontal
- cards com conteúdo comprimido demais
- resumo e ações empurrando a escala para baixo sem critério

## Diretriz de execução da fase 2

1. corrigir primeiro o que atrapalha uso real em smartphone
2. priorizar hierarquia visual e ergonomia antes de detalhes cosméticos
3. proteger com teste apenas o que reduz risco real de regressão
4. manter a experiência mobile coerente com o desktop sem tentar
   replicar o mesmo layout

## Execução inicial da fase 2

### Escopo revisado

O primeiro bloco executado no `V21` priorizou as áreas em que ações e
conteúdo disputavam espaço com mais frequência em smartphone.

Itens trabalhados:

- toolbar do painel de organistas
- listas de igrejas e organistas com ações laterais
- formulários principais em coluna única
- visualização da escala e seus blocos auxiliares

### Ajustes aplicados

- remoção de larguras rígidas em botões do painel
- reorganização de ações em grid responsivo nas listas mobile
- melhor distribuição de espaço em formulários e mensagens
- cards da escala em coluna única com linhas menos comprimidas
- toolbar da escala e resumo do período mais estáveis em largura
  reduzida

### Resultado parcial

- leitura do conteúdo principal passou a vir antes das ações com mais
  clareza
- botões críticos ficaram mais acessíveis em largura estreita
- a visualização da escala ficou menos apertada em smartphone
- a experiência mobile passou a parecer mais deliberada e menos
  dependente de quebra automática do layout

### Validação executada

- `npm test -- --runTestsByPath src/test/churchDashboard.test.js`
  `src/test/churchForm.test.js src/test/organistForm.test.js`
  `src/test/scheduleGridView.test.js --watchAll=false`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

## Resultado esperado do ciclo

Ao final do `V21`, o sistema deve ter uma experiência mobile estável,
legível e coerente nas telas principais.
