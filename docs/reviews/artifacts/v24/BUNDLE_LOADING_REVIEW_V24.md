# Bundle Loading Review V24

## Contexto

O `V24` é o ciclo planejado para revisar o peso do bundle inicial e a
estratégia de lazy loading do sistema.

Ele parte do baseline do `V23`, que identificou JavaScript inicial acima
do ideal nas rotas avaliadas e apontou o bundle principal como um dos
custos recorrentes da experiência inicial.

## Foco previsto do ciclo

- revisar a composição do bundle principal
- identificar dependências fora da rota crítica
- planejar lazy loading deliberado por fluxo de uso
- reduzir impacto de exportação, histórico e caminhos secundários no
  carregamento inicial

## Resultado consolidado da fase 1

O `V24` foi aberto oficialmente após o fechamento do `V23`, usando o
novo baseline do shell autenticado já estabilizado.

Leitura operacional desta fase:

- o problema principal agora não é mais "tela saltando", e sim quanto
  JavaScript ainda chega cedo demais
- o corte mais promissor não está na home isolada, e sim na fronteira
  entre shell autenticado, fluxo de escala e exportação
- a fase 2 deve buscar ganho real de bundle sem desmontar o trabalho de
  estabilidade visual já entregue

## Hipóteses iniciais de trabalho

### 1. O shell principal carrega mais do que a rota precisa

Leitura derivada do `V23`:

- Home com economia estimada de `120 KiB`
- Lista de igrejas e dashboard com economia estimada de `79–82 KiB`

Diretriz:

- medir o que participa diretamente da primeira renderização
- separar o que pode esperar por interação do usuário

Evidências locais atuais:

- o arquivo `build/static/js/main.3557ff9d.js` está em torno de `696 KB`
  não comprimidos no build local de referência
- o diretório `build/static/js` soma cerca de `8.3 MB` com sourcemaps e
  chunks, mostrando uma base ainda relevante de código entregue ao app

### 2. Fluxos secundários podem sair do caminho crítico

Áreas prováveis:

- gerador de escala
- histórico de escalas
- exportação em PDF

Diretriz:

- avaliar imports dinâmicos e divisão mais explícita por rota ou ação

Mapeamento atual no código:

- `src/hooks/useChurchScheduleGenerator.js` ainda importa
  `exportScheduleToPDF` diretamente de `src/utils/pdfGenerator.js`
- `src/utils/pdfGenerator.js` importa `jspdf` logo no topo do módulo
- isso sugere que o custo de PDF continua entrando cedo demais no fluxo
  do gerador, mesmo quando o usuário ainda não pediu exportação

### 3. A otimização precisa preservar previsibilidade visual

Diretriz:

- qualquer ganho de bundle deve manter o shell estável e a leitura das
  telas principais
- otimização de carga não deve reabrir problemas de `CLS`

Mapeamento atual no código:

- `src/App.js` já usa `React.lazy` para dashboard e gerador
- após login, o app faz preload dessas duas rotas
- isso preserva percepção de uso, mas também impõe um trade-off:
  continuamos aquecendo cedo duas rotas grandes, então a fase 2 precisa
  revisar o quanto desse preload ainda vale o custo

## Pontos concretos priorizados para a fase 2

### 1. PDF sob demanda

Arquivos-alvo:

- `src/hooks/useChurchScheduleGenerator.js`
- `src/utils/pdfGenerator.js`

Hipótese:

- trocar o caminho atual por import dinâmico no clique de exportação
  deve aliviar a carga do fluxo do gerador sem mexer na rota inicial

Execução inicial:

- `src/hooks/useChurchScheduleGenerator.js` deixou de importar
  `exportScheduleToPDF` de forma estática
- o exportador passou a ser carregado com `import()` apenas quando o
  usuário aciona a exportação

Leitura:

- esse corte é o primeiro ajuste de melhor relação risco/benefício do
  `V24`
- ele reduz carga antecipada no gerador sem reabrir problemas de
  previsibilidade visual

### 2. Revisão do preload pós-login

Arquivos-alvo:

- `src/App.js`

Hipótese:

- vale reavaliar se dashboard e gerador precisam do mesmo tratamento de
  preload, ou se o gerador pode ficar mais tardio

Execução inicial:

- `src/App.js` manteve o preload imediato do dashboard
- o gerador deixou de ser aquecido logo no início da sessão
- agora o preload do gerador acontece apenas em momento ocioso do
  navegador, com fallback temporizado para ambientes sem
  `requestIdleCallback`

Leitura:

- essa passada reduz disputa por carga logo após o login
- o shell principal preserva o caminho mais provável de navegação
- a próxima medição deve mostrar se esse adiamento já é suficiente ou se
  o preload do gerador ainda pode ser removido

### 3. Fronteira do fluxo autenticado

Arquivos-alvo:

- `src/App.js`
- `src/components/Auth.js`
- `src/firebaseConfig.js`

Hipótese:

- a home e a transição para o shell autenticado ainda podem estar
  carregando mais dependências do que a rota crítica realmente precisa

Execução inicial:

- `src/components/Auth.js` passou a carregar via `import()` as APIs de
  login Google e sincronização de perfil somente no clique de login
- `src/App.js` passou a carregar o listener de sessão e o `signOut`
  dinamicamente no momento de uso

Leitura:

- essa passada empurra parte do custo do Firebase Auth e do Firestore
  para mais perto do uso real
- o objetivo é aliviar a home e o bootstrap sem alterar o contrato da
  autenticação

## Atualização da fase 2 no gerador

Execução inicial:

- `src/hooks/useChurchScheduleGenerator.js` deixou de bloquear a carga
  principal da rota esperando o histórico de escalas
- igreja e organistas continuam na primeira frente do carregamento
- o histórico passa a hidratar em paralelo, com estado dedicado
  `isHistoryLoading`

Leitura:

- essa passada reduz o trabalho crítico da rota `/igreja/:id/escala`
- o shell do gerador fica disponível antes, deixando o histórico como
  parte progressiva do fluxo
- o objetivo direto é melhorar `LCP` percebido do gerador sem reabrir
  regressão visual do shell

## Checklist inicial da fase 1

- mapear dependências do `main.js`
- revisar pontos de lazy loading já existentes
- identificar imports caros em fluxos de baixa frequência
- separar corte provável de corte arriscado
- definir ordem de execução da fase 2

Status:

- [x] dependências e pontos de preload revisados
- [x] fluxo de PDF identificado como primeiro corte provável
- [x] trade-off do preload pós-login documentado
- [x] ordem de execução da fase 2 definida

## Resultado esperado do ciclo

Ao final do `V24`, o projeto deve ter uma base mais enxuta para as
rotas principais, sem perder previsibilidade de UX nem reintroduzir
instabilidade visual.
