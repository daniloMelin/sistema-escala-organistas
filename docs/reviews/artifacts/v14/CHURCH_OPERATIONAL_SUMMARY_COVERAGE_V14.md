# Cobertura da Visão por Igreja V14

## Histórico de Revisões

| Versão | Data               | Autor(es) | Descrição da Revisão   |
| ------ | ------------------ | --------- | ---------------------- |
| 1.0    | 2 de abril de 2026 | Codex     | Cobertura do fluxo V14 |

## Objetivo

Consolidar a cobertura criada no V14 para o fluxo evoluído de visão
operacional da lista principal de igrejas.

## Cobertura Implementada

### Camada 1. Componente da lista de igrejas

Arquivo:

- `src/test/churchList.test.js`

Validações cobertas:

- clique na igreja para navegação
- ações de `Editar` e `Excluir`
- exibição do resumo operacional quando disponível
- exibição do selo de prontidão
- exibição do detalhe textual do status
- exibição dos dados de:
  - modelo de culto
  - quantidade de organistas
  - quantidade de escalas
- preservação do estado vazio
- preservação do comportamento quando há erro de carregamento

### Camada 2. Hook de enriquecimento operacional

Arquivo:

- `src/test/useChurchManager.test.js`

Validações cobertas:

- manutenção da lista carregada quando o resumo de uma igreja falha
- contagem total de escalas sem truncamento artificial
- preservação do carregamento das igrejas válidas mesmo com falha
  localizada

### Camada 3. Fluxo E2E da lista operacional

Arquivo:

- `e2e/church-management.spec.js`

Validações cobertas:

- cadastro de nova igreja com feedback de sucesso
- edição de igreja existente
- exibição de igreja `Pronta`
- exibição de igreja `Atenção`
- exibição de igreja `Incompleta`
- leitura do motivo curto do status
- exibição de modelo, organistas e escalas
- manutenção da navegação da lista para o painel da igreja

## Itens Cobertos pelo V14

- leitura operacional resumida por igreja na lista principal
- prontidão da igreja com contexto curto
- exibição de modelo de culto, organistas e escalas
- robustez da lista diante de falha localizada no enriquecimento
- contagem real de escalas no resumo

## Itens Ainda Fora do Escopo

- busca por igreja
- filtro por status ou modelo de culto
- métricas adicionais como última atualização
- alertas operacionais mais avançados
- detalhamento de distribuição por organista na lista principal

## Conclusão

O V14 deixou a visão por igreja mais bem documentada e protegida:

- a leitura principal da lista está coberta em componente, hook e E2E
- os estados operacionais mais importantes já estão validados em uso
  real
- o próximo passo pode se concentrar em novos sinais operacionais, e não
  em corrigir a base recém-entregue
