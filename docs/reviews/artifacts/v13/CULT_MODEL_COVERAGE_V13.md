# Cobertura do Modelo de Culto Configurável V13

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão   |
| ------ | ------------------- | ------------ | ---------------------- |
| 1.0    | 27 de março de 2026 | Danilo Melin | Cobertura do fluxo V13 |

## Objetivo

Consolidar a cobertura criada no V13 para o fluxo evoluído de modelo de
culto configurável por igreja.

## Cobertura Implementada

### Camada 1. Utilitário de modelo de culto

Arquivo:

- `src/test/churchCultModel.test.js`

Validações cobertas:

- montagem da `config` para o modelo `Culto + Reserva`
- inferência correta do modelo a partir da configuração persistida
- reconstrução dos dias selecionados a partir da config existente
- detecção dos dias visíveis com `Reserva`, `Parte 1` e `Parte 2`

### Camada 2. Cadastro e leitura da igreja

Arquivos:

- `src/test/churchForm.test.js`
- `src/test/useChurchDashboard.test.js`

Validações cobertas:

- seleção do modelo de culto no formulário da igreja
- exibição da descrição contextual do modelo selecionado
- leitura correta dos dias visíveis no painel da igreja após carregar a
  configuração salva

### Camada 3. Geração da escala

Arquivo:

- `src/test/scheduleLogic.test.js`

Validações cobertas:

- geração do modelo `Culto + Reserva`
- geração do modelo `Meia Hora + Parte 1 + Parte 2`
- preservação da regra de dobradinha apenas em `Meia Hora + Culto`
- preservação da prioridade de `RJM`

### Camada 4. Visualização e PDF

Arquivos:

- `src/test/scheduleGridView.test.js`
- `src/test/pdfGenerator.test.js`

Validações cobertas:

- labels amigáveis na grade para:
  - `Meia Hora`
  - `Culto`
  - `Reserva`
- exportação do PDF com labels dinâmicos para:
  - `RJM`
  - `Meia Hora`
  - `Parte 1`
  - `Parte 2`
  - `Reserva`

### Camada 5. Fluxos E2E

Arquivos:

- `e2e/church-management.spec.js`
- `e2e/schedule-generation.spec.js`

Validações cobertas:

- cadastro e edição da igreja com seleção do modelo de culto
- geração de escala no modelo `Culto + Reserva`
- preservação do fluxo já existente de geração e histórico
- visualização correta da grade após geração

## Itens Cobertos pelo V13

- configuração do modelo de culto no cadastro da igreja
- persistência e releitura coerente do modelo salvo
- geração da escala conforme o modelo da igreja
- exibição e exportação da escala com os slots corretos
- manutenção da regra atual de `RJM`

## Itens Ainda Fora do Escopo

- criação livre de slots personalizados por igreja
- múltiplas reservas no mesmo culto
- resumo visual do modelo já na lista de igrejas
- validações preventivas mais fortes no cadastro da igreja
- políticas específicas de substituição de reserva no dia do culto

## Conclusão

O V13 deixou o fluxo de modelo de culto configurável melhor documentado
e melhor protegido:

- a melhoria funcional ficou coberta em utilitário, componente e E2E
- o comportamento mais importante já está validado em uso real
- o próximo passo pode se concentrar em refinamento operacional, não em
  correção da base recém-evoluída
