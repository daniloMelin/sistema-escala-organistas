# Revisão do Modelo de Culto Configurável V13

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão       |
| ------ | ------------------- | ------------ | -------------------------- |
| 1.0    | 27 de março de 2026 | Danilo Melin | Revisão do modelo de culto |

## Objetivo

Formalizar como o sistema deve representar o modelo de culto por
igreja, de forma que cadastro, geração, visualização e PDF passem a
seguir a regra operacional real das igrejas.

## Problema Atual

Hoje o sistema assume uma estrutura fixa para os cultos:

- `RJM`
- `Meia Hora`
- `Culto`

Essa lógica está embutida principalmente em:

- `src/hooks/useChurchManager.js`
- `src/utils/scheduleLogic.js`
- `src/utils/pdfGenerator.js`

Isso atende o modelo atual, mas não cobre o uso real desejado:

- Igreja A:
  - `Culto`
  - `Reserva`
- Igreja B:
  - `Meia Hora`
  - `Culto`
- Igreja C:
  - `Meia Hora`
  - `Parte 1`
  - `Parte 2`

## Premissas Confirmadas

- várias organistas continuam sendo cadastradas normalmente
- o modelo da igreja define apenas os slots obrigatórios da escala
- apenas a Igreja A usa `Reserva`
- Igrejas B e C não usam reserva
- a regra de `RJM` permanece igual

## Opções Avaliadas

### Opção 1. Apenas quantidade de organistas por culto

Ideia:

- salvar apenas um número, como `1`, `2` ou `3`

Vantagens:

- implementação inicial simples

Limitações:

- não resolve nomes diferentes dos slots
- não representa `Reserva`
- não deixa claro o que deve aparecer na tela e no PDF

Conclusão:

- insuficiente para o domínio real

### Opção 2. Modelo nomeado por igreja

Ideia:

- cada igreja escolhe um modelo fechado, pré-definido

Modelos do primeiro ciclo:

- `culto_unico_com_reserva`
- `meia_hora_e_culto`
- `meia_hora_parte1_parte2`

Vantagens:

- cobre o domínio confirmado
- simplifica a UI do cadastro
- reduz erro de configuração
- facilita geração, visualização e PDF

Limitações:

- menos flexível para variações futuras fora desses três modelos

Conclusão:

- melhor opção para o primeiro ciclo

### Opção 3. Slots totalmente livres configurados manualmente

Ideia:

- permitir que a igreja defina qualquer quantidade e nome de slots

Vantagens:

- máxima flexibilidade

Limitações:

- muito mais complexidade na UI
- aumenta risco de configuração inconsistente
- exige validação muito mais forte já no primeiro ciclo

Conclusão:

- valiosa no futuro, mas excessiva para agora

## Modelo Prioritário Escolhido

Para o V13, a melhor opção é:

- **modelo nomeado por igreja**

Modelos suportados no primeiro ciclo:

1. `culto_unico_com_reserva`
2. `meia_hora_e_culto`
3. `meia_hora_parte1_parte2`

## Representação Recomendada

Além da configuração atual de dias, a igreja deve passar a armazenar um
campo específico para o modelo de culto.

Representação sugerida:

```js
{
  name: 'Igreja Exemplo',
  code: 'EX',
  config: {
    sunday: [{ id: 'RJM' }, { id: 'Culto' }, { id: 'Reserva' }],
    tuesday: [{ id: 'Culto' }, { id: 'Reserva' }],
  },
  cultoModel: 'culto_unico_com_reserva'
}
```

## Regra Recomendada para o Primeiro Ciclo

### Modelo `culto_unico_com_reserva`

Slots principais:

- `Culto`
- `Reserva`

### Modelo `meia_hora_e_culto`

Slots principais:

- `MeiaHoraCulto`
- `Culto`

### Modelo `meia_hora_parte1_parte2`

Slots principais:

- `MeiaHoraCulto`
- `Parte1`
- `Parte2`

### Regra de `RJM`

- permanece opcional e independente
- continua sendo adicionada quando configurada para domingo

## Relação entre Modelo de Culto e Dias Configurados

Diretriz recomendada:

- os dias configurados continuam definindo **em quais dias há culto**
- o modelo de culto passa a definir **quais slots esse culto possui**

Exemplo:

- se a igreja usa o modelo `meia_hora_parte1_parte2`
- e terça-feira está ativa
- então terça-feira deve gerar:
  - `MeiaHoraCulto`
  - `Parte1`
  - `Parte2`

## Consequências Técnicas Diretas

A decisão desta fase implica adaptações futuras em:

- `src/hooks/useChurchManager.js`
- `src/hooks/useChurchDashboard.js`
- `src/utils/scheduleLogic.js`
- `src/utils/pdfGenerator.js`
- componentes de visualização da escala

## Próximo Passo

Implementar a escolha do modelo de culto no cadastro/edição da igreja,
preservando a regra atual de `RJM` e ajustando a persistência da
configuração.
