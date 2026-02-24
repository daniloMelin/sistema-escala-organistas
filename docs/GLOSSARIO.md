# Glossário do Projeto (EN -> PT-BR)

## Histórico de Revisões

| Versão | Data                    | Autor(es)    | Descrição da Revisão         |
| ------ | ----------------------- | ------------ | ---------------------------- |
| 1.0    | 24 de fevereiro de 2026 | Danilo Melin | Criação inicial do documento |


Este glossário serve como referência rápida para descrições de testes e nomes técnicos do código.

## 1. Descrições de testes unitários

### `src/test/App.test.js`

| Inglês         | Português (PT-BR)              |
| -------------- | ------------------------------ |
| `sanity check` | verificação básica de sanidade |

### `src/test/churchForm.test.js`

| Inglês                                   | Português (PT-BR)                             |
| ---------------------------------------- | --------------------------------------------- |
| `submits form and triggers callbacks`    | envia o formulário e dispara os callbacks     |
| `shows cancel button only while editing` | mostra o botão cancelar apenas durante edição |

### `src/test/churchList.test.js`

| Inglês                                   | Português (PT-BR)                                      |
| ---------------------------------------- | ------------------------------------------------------ |
| `calls select, edit and delete handlers` | chama os manipuladores de selecionar, editar e excluir |

### `src/test/organistForm.test.js`

| Inglês                      | Português (PT-BR)                 |
| --------------------------- | --------------------------------- |
| `handles form interactions` | trata as interações do formulário |
| `shows empty-days warning`  | exibe aviso de dias vazios        |

### `src/test/organistList.test.js`

| Inglês                              | Português (PT-BR)                 |
| ----------------------------------- | --------------------------------- |
| `renders list and triggers actions` | renderiza a lista e dispara ações |

### `src/test/scheduleControls.test.js`

| Inglês                                  | Português (PT-BR)                |
| --------------------------------------- | -------------------------------- |
| `changes dates and triggers generation` | altera datas e dispara a geração |

### `src/test/scheduleGridView.test.js`

| Inglês                                                | Português (PT-BR)                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| `shows non-empty day cards while not editing`         | mostra cartões de dias não vazios fora do modo edição               |
| `handles toolbar and assignment change while editing` | trata barra de ferramentas e alteração de atribuição durante edição |

### `src/test/scheduleHistoryList.test.js`

| Inglês                                   | Português (PT-BR)                              |
| ---------------------------------------- | ---------------------------------------------- |
| `does not render while editing`          | não renderiza durante edição                   |
| `renders items and triggers view action` | renderiza itens e dispara ação de visualização |

### `src/test/scheduleLogic.test.js`

| Inglês                                                                  | Português (PT-BR)                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `returns empty list when there are no organists`                        | retorna lista vazia quando não há organistas                                    |
| `returns empty list when date range is invalid`                         | retorna lista vazia quando o intervalo de datas é inválido                      |
| `fills two sunday slots with different organists`                       | preenche dois slots de domingo com organistas diferentes                        |
| `does not assign organist outside fixedDays`                            | não escala organista fora dos dias fixos (`fixedDays`)                          |
| `applies double duty when Culto is assigned first`                      | aplica dobradinha quando `Culto` é atribuído primeiro                           |
| `distributes assignments fairly among organists with same availability` | distribui atribuições de forma justa entre organistas com mesma disponibilidade |

### `src/test/validation.test.js`

| Inglês                                          | Português (PT-BR)                               |
| ----------------------------------------------- | ----------------------------------------------- |
| `rejects empty name`                            | rejeita nome vazio                              |
| `rejects dangerous characters`                  | rejeita caracteres perigosos                    |
| `accepts valid name`                            | aceita nome válido                              |
| `requires at least 2 chars`                     | exige ao menos 2 caracteres                     |
| `accepts empty code`                            | aceita código vazio                             |
| `rejects invalid code pattern`                  | rejeita padrão de código inválido               |
| `accepts valid code`                            | aceita código válido                            |
| `rejects missing dates`                         | rejeita datas ausentes                          |
| `rejects invalid order`                         | rejeita ordem inválida                          |
| `rejects periods longer than one year`          | rejeita períodos maiores que um ano             |
| `accepts valid range`                           | aceita intervalo válido                         |
| `removes dangerous chars and normalizes spaces` | remove caracteres perigosos e normaliza espaços |

## 2. Funções principais do projeto

### `src/utils/scheduleLogic.js`

| Função                        | Finalidade                                                       |
| ----------------------------- | ---------------------------------------------------------------- |
| `generateSchedule`            | função principal que gera a escala no período informado          |
| `canOrganistPlayOnDay`        | valida se a organista pode tocar naquele dia/culto               |
| `calculateAvailabilityScores` | calcula escore de disponibilidade de cada organista              |
| `runPrimaryAllocation`        | executa alocação principal por dia/culto com critério de justiça |
| `applyDoubleDutyRule`         | aplica regra de dobradinha quando houver slot complementar vazio |
| `buildPeriodDates`            | monta os dias do período com base na configuração da igreja      |
| `initializeAllocationState`   | inicializa estado de estatísticas e controle de duplicidade      |

### `src/utils/validation.js`

| Função                 | Finalidade                    |
| ---------------------- | ----------------------------- |
| `validateChurchName`   | valida nome da igreja         |
| `validateOrganistName` | valida nome da organista      |
| `validateChurchCode`   | valida código curto da igreja |
| `validateDateRange`    | valida intervalo de datas     |
| `sanitizeString`       | higieniza string de entrada   |

### `src/utils/pdfGenerator.js`

| Função                | Finalidade                                                  |
| --------------------- | ----------------------------------------------------------- |
| `exportScheduleToPDF` | gera e exporta PDF da escala                                |
| `hasValidAssignments` | valida se item da escala tem atribuição útil para impressão |

### `src/services/firebaseService.js`

| Função                                                                        | Finalidade                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| `addChurch` / `updateChurch` / `deleteChurch`                                 | CRUD da igreja                             |
| `deleteChurchWithSubcollections`                                              | exclusão em cascata (igreja + subcoleções) |
| `getChurches` / `getChurch`                                                   | leitura de igrejas                         |
| `addOrganistToChurch` / `updateOrganistInChurch` / `deleteOrganistFromChurch` | CRUD de organistas por igreja              |
| `getOrganistsByChurch`                                                        | lista organistas da igreja                 |
| `saveScheduleToChurch` / `getChurchSchedules`                                 | persistência e histórico de escalas        |

## 3. Variáveis e estruturas-chave

### `src/utils/scheduleLogic.js`

| Nome                      | Significado                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `SERVICE_TEMPLATES`       | templates dos cultos (`RJM`, `MeiaHoraCulto`, `Culto`)                  |
| `DAY_INDEX_TO_CONFIG_KEY` | mapeamento de `getDay` (0-6) para chave de config da igreja             |
| `availabilityScores`      | mapa `organistId -> quantidade de slots possíveis`                      |
| `organistStats`           | estatísticas por organista (`meiaHora`, `culto`, `total`)               |
| `assignedDates`           | controle para impedir dupla escala da mesma organista no mesmo dia      |
| `periodDates`             | lista dos dias de culto dentro do período                               |
| `schedule`                | resultado final da escala                                               |
| `SERVICE_PRIORITY`        | prioridade dos cultos na alocação (`RJM` -> `MeiaHoraCulto` -> `Culto`) |
