# Schedule Rules Review V20

## Contexto

O `V20` trata a lógica de geração da escala como eixo central do
produto. O foco do ciclo é revisar justiça, previsibilidade e
consistência da distribuição entre organistas.

## Eixos de revisão do ciclo

- critérios de rotação
- impacto do histórico na distribuição
- cenários com múltiplas funções no mesmo dia
- proteção do período fechado de `3` meses
- relação entre disponibilidade e sensação de justiça

## Mapeamento consolidado da fase 1

O `V20` parte de uma base mais estável do que nos ciclos anteriores. O
`V18` deixou a jornada operacional mais consistente e o `V19` refinou a
saída final em PDF. Agora o centro da revisão passa a ser a qualidade da
decisão algorítmica.

Os pontos mais sensíveis observados para a fase 2 são:

- rotação entre organistas com disponibilidade parecida
- percepção de repetição indevida quando a mesma organista aparece em
  papéis próximos
- peso de organistas escassas em dias com múltiplas funções
- cenários em que uma regra local parece correta, mas gera sensação
  global de injustiça ao longo do período
- preservação da regra de período fechado como proteção de previsibilidade

## Critérios de aceite funcional

### 1. Justiça percebida

- a escala deve evitar concentração desnecessária em poucas organistas
- quando houver múltiplas elegíveis, a rotação deve parecer razoável ao
  longo do período
- decisões de escassez devem ser explicáveis, não apenas válidas

### 2. Previsibilidade do algoritmo

- cenários equivalentes devem produzir resultados coerentes
- critérios de desempate não devem parecer arbitrários
- a influência da disponibilidade precisa permanecer compreensível

### 3. Respeito às restrições do sistema

- o período fechado de `3` meses deve continuar sendo bloqueio firme
- a regra deve respeitar o modelo de culto configurado por igreja
- papéis múltiplos no mesmo dia devem preservar coerência entre funções

### 4. Defensabilidade do resultado

- o comportamento da regra deve ser documentável em linguagem de negócio
- ajustes devem melhorar o resultado sem transformar a lógica em caixa
  preta
- risco residual deve ficar claro quando a percepção humana ainda exigir
  validação manual

## Cenários prioritários da fase 2

### 1. Rotação entre elegíveis equivalentes

Objetivo: verificar se o algoritmo distribui de forma equilibrada quando
duas ou mais organistas têm disponibilidade semelhante.

Sinais de reprovação:

- repetição frequente da mesma organista sem motivo claro
- distribuição que parece depender demais da ordem de entrada
- diferença de carga que cresce rápido em período curto

### 2. Escassez em dia com múltiplas funções

Objetivo: avaliar se a lógica preserva organistas escassas para os
papéis em que elas realmente fazem falta.

Sinais de reprovação:

- organista escassa consumida cedo em papel pouco crítico
- papel mais restrito ficando com menos opções viáveis sem necessidade
- resultado final correto, mas difícil de justificar operacionalmente

### 3. Modelos com `2` e `3` funções no mesmo dia

Objetivo: validar se a distribuição continua equilibrada quando o modelo
da igreja exige mais coordenação no mesmo dia.

Sinais de reprovação:

- concentração de nomes em blocos repetidos ao longo do período
- parte do modelo sendo sempre favorecida na distribuição
- equilíbrio local ruim mesmo com conjunto suficiente de elegíveis

### 4. Disponibilidade reduzida e carga histórica

Objetivo: revisar como a regra reage quando poucas organistas podem
tocar em determinados dias.

Sinais de reprovação:

- histórico recente não ajuda a aliviar concentração
- disponibilidade baixa gera repetição além do necessário
- algoritmo fica correto no detalhe, mas injusto na percepção do mês

## Diretriz de execução da fase 2

1. revisar primeiro os critérios de rotação e escassez
2. registrar comportamento esperado por cenário antes de mudar a lógica
3. ampliar testes apenas onde a mudança reduzir risco real de regressão
4. separar claramente problema de justiça percebida e problema de bug
   funcional

## Resultado esperado do ciclo

Ao final do `V20`, a regra de negócio da escala deve estar mais clara,
mais defensável e melhor protegida contra regressão.
