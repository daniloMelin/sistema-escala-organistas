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

## Hipóteses iniciais de trabalho

### 1. O shell principal carrega mais do que a rota precisa

Leitura derivada do `V23`:

- Home com economia estimada de `120 KiB`
- Lista de igrejas e dashboard com economia estimada de `79–82 KiB`

Diretriz:

- medir o que participa diretamente da primeira renderização
- separar o que pode esperar por interação do usuário

### 2. Fluxos secundários podem sair do caminho crítico

Áreas prováveis:

- gerador de escala
- histórico de escalas
- exportação em PDF

Diretriz:

- avaliar imports dinâmicos e divisão mais explícita por rota ou ação

### 3. A otimização precisa preservar previsibilidade visual

Diretriz:

- qualquer ganho de bundle deve manter o shell estável e a leitura das
  telas principais
- otimização de carga não deve reabrir problemas de `CLS`

## Checklist inicial da fase 1

- mapear dependências do `main.js`
- revisar pontos de lazy loading já existentes
- identificar imports caros em fluxos de baixa frequência
- separar corte provável de corte arriscado
- definir ordem de execução da fase 2

## Resultado esperado do ciclo

Ao final do `V24`, o projeto deve ter uma base mais enxuta para as
rotas principais, sem perder previsibilidade de UX nem reintroduzir
instabilidade visual.
