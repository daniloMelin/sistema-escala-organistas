# Code Review V13

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão |
| ------ | ------------------- | ------------ | -------------------- |
| 1.0    | 27 de março de 2026 | Danilo Melin | Criação do ciclo V13 |
| 1.1    | 27 de março de 2026 | Danilo Melin | Fase 1.1 concluída   |
| 1.2    | 27 de março de 2026 | Danilo Melin | Fase 1.2 concluída   |
| 1.3    | 27 de março de 2026 | Danilo Melin | Fase 2.1 concluída   |

## Objetivo

Evoluir o sistema para permitir configuração do modelo de culto por
igreja, refletindo a regra operacional real de quantas organistas
ocupam slots principais do culto e quando existe slot de reserva.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `27 de março de 2026`
- Data de encerramento: `A definir`
- Contexto: continuidade direta do `CODE_REVIEW_V12`, priorizando agora
  a regra central de configuração do culto antes de novos refinamentos
  administrativos

## Diretriz de Prioridade

1. Refletir a regra real das igrejas na configuração do sistema
2. Tratar cadastro, geração, visualização e PDF como um fluxo único
3. Preservar a regra atual de `RJM`
4. Evitar solução parcial que mude só a tela, sem mudar o algoritmo

## Diagnóstico Inicial

Hoje o sistema assume uma estrutura de culto mais rígida, baseada em
regras fixas por dia, o que já não cobre o uso real esperado.

A necessidade funcional agora é suportar modelos de culto distintos por
igreja:

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

Premissas adicionais:

- várias organistas seguem cadastradas normalmente
- o modelo define os slots principais da escala
- apenas a Igreja A usa `Reserva`
- a regra de `RJM` continua igual

## Plano de Implementação

### Fase 1 - Estratégia do Modelo de Culto

#### 1.1 Revisar e formalizar o modelo configurável por igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - definir como o modelo será representado nos dados da igreja
  - formalizar os modelos suportados no primeiro ciclo
  - decidir a relação entre modelo do culto e dias configurados
  - resultado alcançado:
    - modelo configurável formalizado em documento próprio
    - modelos suportados do primeiro ciclo definidos
    - relação entre dias configurados, slots e `RJM` explicitada

#### 1.2 Implementar configuração do modelo no cadastro da igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - permitir escolher o modelo do culto no cadastro/edição da igreja
  - preservar a lógica atual de `RJM`
  - ajustar a persistência da configuração
  - resultado alcançado:
    - cadastro e edição da igreja passaram a permitir escolha do modelo
    - persistência de `cultoModel` adicionada aos dados da igreja
    - montagem da configuração ficou centralizada em util próprio
    - leitura da configuração existente passou a inferir modelo e dias

### Fase 2 - Geração e Visualização da Escala

#### 2.1 Adaptar a geração de escala ao modelo da igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - fazer o algoritmo preencher os slots corretos conforme o modelo
  - garantir comportamento coerente para:
    - `Culto + Reserva`
    - `Meia Hora + Culto`
    - `Meia Hora + Parte 1 + Parte 2`
  - resultado alcançado:
    - algoritmo passou a suportar `Reserva`, `Parte 1` e `Parte 2`
    - regra de dobradinha foi preservada apenas para `Meia Hora + Culto`
    - helper E2E passou a respeitar o `cultoModel` da igreja
    - cobertura unitária e E2E atualizada para os novos modelos

#### 2.2 Adaptar visualização e PDF ao modelo configurado

- Status: `PENDENTE`
- Prioridade: `ALTA`
- Escopo:
  - refletir os slots corretos na tela
  - refletir os slots corretos no PDF
  - manter clareza operacional da escala exportada

### Fase 3 - Consolidação Funcional

#### 3.1 Revisar impacto operacional da nova configuração

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da configuração por igreja
  - registrar limitações remanescentes
  - avaliar o próximo passo funcional mais natural

#### 3.2 Consolidar cobertura e documentação do fluxo evoluído

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar a cobertura do novo comportamento
  - consolidar artefatos e decisão funcional do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Encerrar formalmente o V13

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar o resultado do ciclo
  - consolidar próximos passos recomendados
  - fechar formalmente o `CODE_REVIEW_V13`

## Ordem de execução recomendada

1. **Fase 1.1 - revisar modelo configurável por igreja**
2. **Fase 1.2 - implementar configuração no cadastro**
3. **Fase 2.1 - adaptar a geração**
4. **Fase 2.2 - adaptar visualização e PDF**
5. **Fase 3.1 - revisar impacto operacional**
6. **Fase 3.2 - consolidar cobertura e documentação**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [ ] Fase 2.2 pendente
- [ ] Fase 3.1 pendente
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V13

- pelo menos um modelo configurável de culto por igreja entregue de
  ponta a ponta
- geração, visualização e PDF alinhados ao modelo escolhido
- documentação do ciclo atualizada com impacto prático e próximos passos
