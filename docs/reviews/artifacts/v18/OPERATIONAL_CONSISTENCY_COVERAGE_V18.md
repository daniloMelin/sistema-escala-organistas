# Operational Consistency Coverage V18

## Contexto

Este artefato consolida a cobertura relevante criada ou ampliada
durante o `V18`.

A diretriz do ciclo foi ampliar testes apenas quando a proteção reduz
risco real de regressão nos fluxos operacionais principais.

## Cobertura por fluxo

### Igrejas

Arquivo principal:

- `src/test/useChurchManager.test.js`

Comportamentos protegidos:

- preservação de `code` legado ao editar igreja
- reconstrução da configuração ao trocar modelo de culto
- exclusão da igreja em edição com reset do formulário
- carregamento e persistência do ensaio local
- ordenação por prioridade operacional

Valor da cobertura:

- protege a base de dados usada por organistas e geração de escala
- reduz risco de regressão na compatibilidade com registros antigos

### Organistas

Arquivo principal:

- `src/test/useChurchDashboard.test.js`

Comportamentos protegidos:

- bloqueio de envio com nome inválido
- duplicidade de nome dentro da igreja
- edição mantendo nome legado
- mapeamento de disponibilidade antiga de domingo
- exclusão da organista em edição com reset do formulário

Arquivos de apoio:

- `src/test/organistForm.test.js`
- `src/test/organistList.test.js`
- `src/test/validation.test.js`

Valor da cobertura:

- protege as regras de formulário do `V17`
- reduz risco de estado visual obsoleto após exclusão

### Escala

Arquivo principal:

- `src/test/useChurchScheduleGenerator.test.js`

Comportamentos protegidos:

- bloqueio de período que entra no quarto mês
- geração e salvamento de escala válida dentro de `3` meses
- recarga do histórico após salvar
- reabertura de escala salva preservando período e dados

Arquivos de apoio:

- `src/test/scheduleLogic.test.js`
- `src/test/scheduleControls.test.js`
- `src/test/scheduleHistoryList.test.js`
- `src/test/validation.test.js`

Valor da cobertura:

- conecta validação de período, algoritmo, persistência e histórico
- protege o fluxo operacional, não apenas funções isoladas

### Visualização e PDF

Arquivo principal:

- `src/test/pdfGenerator.test.js`

Comportamentos protegidos:

- exportação de resumo por organista no PDF
- presença de ensaio local no PDF
- manutenção de serviços sem atribuição que aparecem na visualização
- colunas `M. Hora`, `P1` e `P2` preservadas mesmo com slots vagos

Arquivo de apoio:

- `src/test/scheduleGridView.test.js`

Valor da cobertura:

- reduz divergência informacional entre tela e PDF
- deixa o refinamento visual do `V19` partir de uma base mais estável

## Validações executadas

Durante a fase 2, foram executadas validações focadas por bloco:

- testes de igreja
- testes de organistas
- testes de geração e histórico de escala
- testes de visualização e PDF
- `npm run format:check`
- `npm run lint:md`
- `npm run lint -- --max-warnings=0`

## Lacunas conscientes

O `V18` não tentou transformar toda validação operacional em teste
automatizado.

Lacunas aceitas:

- validação visual fina do PDF em `A4`
- validação manual completa em ambiente real
- cobertura E2E nova para todos os blocos da fase
- regras avançadas de distribuição fora do escopo da consistência
  operacional

Essas lacunas permanecem aceitáveis porque os próximos ciclos já
isolam PDF, regras de negócio e preparação para produção.
