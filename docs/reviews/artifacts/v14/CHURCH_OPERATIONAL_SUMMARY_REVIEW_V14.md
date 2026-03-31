# Revisão do Resumo Operacional por Igreja - V14

## Objetivo

Definir quais sinais resumidos entregam mais valor na lista de igrejas
sem transformar a tela inicial em um painel pesado.

## Contexto de Uso

O sistema é usado por encarregados que normalmente administram uma
igreja, mas em alguns cenários a mesma pessoa acompanha mais de uma.
Nesse contexto, a lista principal de igrejas precisa responder
rapidamente:

- qual igreja está pronta para operar
- qual igreja ainda demanda ação básica
- qual igreja tem histórico recente de uso

A tela não precisa virar dashboard analítico. Ela precisa melhorar a
leitura operacional antes da navegação para o painel da igreja.

## Sinais Avaliados

### 1. Modelo de culto configurado

- Valor:
  - alto
  - ajuda a identificar rapidamente a complexidade da operação da igreja
- Vantagens:
  - dado já existe
  - leitura simples
  - ajuda a contextualizar o tipo de escala esperada
- Limitações:
  - sozinho não informa se a igreja está pronta

### 2. Quantidade de organistas cadastradas

- Valor:
  - alto
  - ajuda a perceber igrejas vazias ou com base reduzida
- Vantagens:
  - dado fácil de entender
  - indica prontidão mínima de operação
- Limitações:
  - quantidade não garante disponibilidade útil

### 3. Quantidade de escalas salvas

- Valor:
  - médio
  - ajuda a perceber uso recente do fluxo de geração
- Vantagens:
  - sinal simples de atividade
  - útil para quem administra mais de uma igreja
- Limitações:
  - não indica qualidade da configuração atual
  - pode crescer sem refletir o estado operacional atual

### 4. Indicador simples de prontidão

- Valor:
  - muito alto
  - sintetiza melhor o estado operacional da igreja
- Leitura proposta:
  - `Pronta`: possui configuração mínima e organistas cadastradas
  - `Atenção`: configuração presente, mas base de organistas insuficiente
  - `Incompleta`: ausência de configuração útil ou ausência de organistas
- Vantagens:
  - sinal direto
  - reduz necessidade de entrar na igreja só para descobrir problema básico
- Limitações:
  - precisa de critério claro e previsível
  - não deve prometer mais precisão do que realmente consegue medir

## Opções Consideradas

### Opção A - Exibir apenas números

- Exemplos:
  - organistas cadastradas
  - escalas salvas
- Conclusão:
  - insuficiente
  - melhora leitura, mas não responde rapidamente se a igreja está pronta

### Opção B - Exibir status de prontidão sem contexto adicional

- Conclusão:
  - simples demais
  - o usuário vê o status, mas perde contexto sobre o motivo

### Opção C - Combinar um status principal com poucos sinais de apoio

- Composição recomendada:
  - status de prontidão
  - modelo de culto
  - quantidade de organistas
  - quantidade de escalas salvas
- Conclusão:
  - melhor equilíbrio entre valor operacional e simplicidade visual

## Decisão da Fase 1.1

A melhoria prioritária do V14 será:

1. exibir um indicador simples de prontidão por igreja
2. complementar esse indicador com três sinais curtos:
   - modelo de culto
   - quantidade de organistas cadastradas
   - quantidade de escalas salvas

## Diretrizes para a Fase 1.2

- Hierarquia visual:
  - prontidão deve ser o sinal principal
  - os demais dados devem funcionar como apoio, não como ruído visual
- Escopo:
  - não incluir busca ou filtros nesta etapa
  - não transformar a lista em grade analítica
  - não incluir métricas históricas complexas
- Critério funcional mínimo:
  - a lista de igrejas deve permitir que o usuário identifique, sem entrar na igreja:
  - se ela está pronta para operar
  - qual modelo de culto utiliza
  - se já possui base mínima de organistas
  - se já possui histórico de escalas salvas

## Próximo passo recomendado

Seguir para a Fase 1.2 implementando um resumo operacional compacto em
cada item da lista de igrejas.
