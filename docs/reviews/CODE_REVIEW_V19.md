# Code Review V19

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                      |
| ------ | ------------------- | ------------ | ----------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V19                      |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de qualidade do PDF |
| 1.2    | 3 de maio de 2026   | Danilo Melin | Consolidação da fase 1 do V19             |
| 1.3    | 3 de maio de 2026   | Danilo Melin | Refino inicial da grade principal do PDF  |
| 1.4    | 3 de maio de 2026   | Danilo Melin | Consolidação da fase 2 do V19             |

## Objetivo

Consolidar a qualidade final do PDF gerado pelo sistema, com foco em
legibilidade, densidade de informação e consistência visual em folha
`A4`.

O `V19` dá continuidade natural ao `V18`, assumindo que os fluxos
operacionais principais já passaram por revisão e que agora vale
refinar a saída final mais importante para uso prático.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `3 de maio de 2026`
- Data de encerramento: `em aberto`
- Contexto: refinamento da saída final do sistema para uso real

## Diretriz de Prioridade

1. Garantir legibilidade em folha `A4`
2. Reduzir diferença entre tela e PDF
3. Manter densidade de informação sem poluir o layout
4. Fechar o ciclo com casos cobrindo `2` e `3` organistas por dia

## Diagnóstico Inicial

- o PDF já evoluiu bastante, mas ainda é um ponto de sensibilidade visual
- cenários com múltiplos organistas no mesmo dia exigem equilíbrio entre espaço e clareza
- resumo do período e ensaio local precisam continuar úteis sem competir com a grade principal
- pequenas variações visuais ainda podem afetar a percepção de “pronto para uso”

## Escopo Previsto

### 1. Estrutura visual do PDF

- revisar hierarquia visual de título, subtítulo e blocos auxiliares
- revisar margens, espaçamentos e densidade da tabela
- revisar consistência do uso da folha `A4`

### 2. Casos de distribuição

- revisar comportamento com `2` organistas no dia
- revisar comportamento com `3` organistas no dia
- revisar abreviações e largura de colunas

### 3. Blocos auxiliares

- revisar posição e utilidade do resumo do período
- revisar posição e formatação do ensaio local
- revisar equilíbrio entre blocos laterais e calendário principal

### 4. Consolidação do ciclo

- registrar impacto visual e operacional do PDF final
- consolidar cobertura específica do exportador
- fechar o ciclo com critérios objetivos de aceite

## Fases Propostas

### Fase 1 - Diagnóstico visual

Objetivo:

- consolidar os critérios visuais e operacionais do PDF
- registrar os cenários com maior sensibilidade de largura e leitura
- definir o checklist que deve orientar os ajustes da fase 2

Saídas esperadas:

- artefato base do ciclo com critérios de aceite do PDF
- priorização dos cenários que precisam ser testados primeiro

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v19/PDF_QUALITY_REVIEW_V19.md`
- critérios de aceite definidos para legibilidade, densidade,
  consistência entre tela e PDF e utilidade dos blocos auxiliares
- cenários prioritários mapeados para revisão visual:
  - cultos com `2` organistas no dia
  - cultos com `3` organistas no dia
  - serviços vagos exibidos na grade
  - resumo do período e ensaio local competindo por espaço
- sequência da fase 2 definida para atacar primeiro grade principal,
  largura de colunas, blocos auxiliares e consistência visual em `A4`

### Fase 2 - Refino do layout

Objetivo:

- ajustar a estrutura do PDF com foco em leitura real
- validar cenários densos em folha `A4`
- corrigir conflitos de largura, altura e alinhamento

Saídas esperadas:

- refinamentos visuais rastreáveis no exportador
- proteção automatizada para os cenários mais sensíveis

Execução inicial:

- grade principal revisada nos cenários com `4` e `5` serviços por dia
- layout passou a reagir à densidade da tabela, reduzindo de `3` para
  `2` meses por página quando a quantidade de serviços pressiona a
  largura útil
- largura da coluna de data e tamanhos de fonte foram ampliados no modo
  denso para preservar leitura de dia, serviço e nome da organista
- área lateral de resumo foi compactada no modo denso para devolver
  espaço à grade principal
- cobertura de `pdfGenerator` ampliada para garantir paginação mais
  folgada nos meses densos

Resultado parcial:

- Status: `CONCLUÍDO`
- principal gargalo visual de largura foi reduzido sem alterar o
  contrato do exportador
- cenários com múltiplos serviços passaram a privilegiar legibilidade em
  vez de concentrar `3` meses por página a qualquer custo
- bloco lateral de resumo e ensaio local foi compactado para competir
  menos com a grade principal
- observações longas do ensaio passaram a quebrar de forma controlada no
  PDF
- cobertura do exportador ampliada para layout denso e textos laterais

### Fase 3 - Cobertura e impacto

- consolidar testes relevantes do PDF
- registrar impacto prático do refinamento
- separar risco residual de resultado aprovado

### Fase 4 - Fechamento

- encerrar formalmente o ciclo
- documentar próximos passos ligados ao motor de escala

## Critérios de Saída Propostos

- PDF legível em `A4`
- cenários com `2` e `3` organistas revisados
- resumo do período e ensaio local mantidos com boa utilidade
- cobertura e impacto consolidados em artefatos próprios

## Registro de Progresso

- [x] Estrutura inicial do V19 criada
- [x] Fase 1 concluída
- [x] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V19

1. consolidar cobertura específica do exportador na fase 3
2. registrar impacto visual e operacional das mudanças do PDF
3. separar risco residual de refinamento fino para os próximos ciclos

## Artefatos da Fase 1

- `docs/reviews/artifacts/v19/PDF_QUALITY_REVIEW_V19.md`
