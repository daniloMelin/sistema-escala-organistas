# Code Review V20

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                                 |
| ------ | ------------------- | ------------ | ---------------------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V20                                 |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de regras de negócio da escala |
| 1.2    | 3 de maio de 2026   | Danilo Melin | Consolidação da fase 1 do V20                        |
| 1.3    | 6 de maio de 2026   | Danilo Melin | Ajuste inicial de justiça da distribuição no V20     |

## Objetivo

Revisar e consolidar as regras de negócio da geração de escala, com foco
em justiça de distribuição, previsibilidade e aderência ao modelo real
de operação das igrejas.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `3 de maio de 2026`
- Data de encerramento: `em aberto`
- Contexto: maturação da lógica principal do produto após revisão operacional e visual

## Diretriz de Prioridade

1. Melhorar a justiça da distribuição
2. Evitar concentração indevida de escala em poucas organistas
3. Respeitar limites do período fechado de `3` meses
4. Tratar a regra de negócio como eixo central do produto

## Diagnóstico Inicial

- a percepção de justiça da escala é uma das partes mais sensíveis do sistema
- melhorias visuais resolvem pouco se a distribuição parecer inadequada
- cenários com mais de uma função no mesmo dia exigem equilíbrio mais fino
- a regra de período fechado de `3` meses já é importante e deve permanecer estável

## Escopo Previsto

### 1. Critérios de distribuição

- revisar rotação entre organistas elegíveis
- revisar impacto da carga histórica
- revisar empates e critérios secundários

### 2. Restrições de período

- consolidar regra de geração apenas dentro do período fechado
- revisar consistência da validação entre tela, lógica e PDF

### 3. Casos especiais

- revisar cenários com `2` e `3` organistas no mesmo dia
- revisar influência do modelo de culto na distribuição
- revisar efeitos de disponibilidade reduzida

### 4. Consolidação do ciclo

- registrar o impacto funcional das regras refinadas
- ampliar a cobertura do algoritmo onde houver risco real
- fechar o ciclo com critérios claros de aceite

## Fases Propostas

### Fase 1 - Mapeamento das regras

Objetivo:

- documentar critérios atuais do algoritmo
- registrar onde a distribuição ainda pode parecer injusta
- definir metas de comportamento esperado antes de alterar a lógica

Saídas esperadas:

- artefato base do ciclo com checklist das regras principais
- priorização dos cenários de distribuição que devem ser validados primeiro

Resultado consolidado:

- Status: `CONCLUÍDO`
- artefato base consolidado em
  `docs/reviews/artifacts/v20/SCHEDULE_RULES_REVIEW_V20.md`
- critérios centrais mapeados para rotação, escassez, desempate e
  preservação do período fechado de `3` meses
- cenários prioritários definidos para:
  - rotação entre elegíveis com mesma disponibilidade
  - impacto de organistas escassas em dias concorridos
  - distribuição em modelos com `2` e `3` funções no mesmo dia
  - efeito de histórico recente e carga acumulada
- diretriz de execução definida: registrar comportamento esperado antes
  de tratar o algoritmo como problema de implementação

### Fase 2 - Ajustes do algoritmo

Objetivo:

- implementar refinamentos de distribuição
- revisar critérios de desempate e escassez
- validar impacto em cenários representativos

Saídas esperadas:

- ajustes rastreáveis na lógica do algoritmo
- cenários com comportamento esperado protegidos por testes focados

Execução inicial:

- lógica de escolha em `assignSingleCulto` revisada para priorizar carga
  total antes de zerar contagem por função quando houver alternativa
  viável
- lógica de dupla `Culto + Reserva` revisada para privilegiar a dupla de
  menor carga total antes de esgotar candidatas mais carregadas
- cobertura de `scheduleLogic` ampliada para proteger:
  - escolha por menor carga total em slot único
  - escolha da dupla mais leve em `Culto + Reserva`

Resultado parcial:

- Status: `EM ANDAMENTO`
- algoritmo passou a tratar justiça global de carga como critério mais
  forte em cenários simples de empate funcional
- comportamento segue preservando restrições de disponibilidade e
  rotação por função como critérios relevantes, mas não dominantes
- próximos ajustes da fase 2 devem revisar escassez e impacto em
  cenários com `3` funções no mesmo dia

### Fase 3 - Cobertura e impacto

- proteger as regras principais com testes
- documentar comportamento antes e depois
- registrar risco residual aceito

### Fase 4 - Fechamento

- encerrar formalmente o ciclo
- consolidar próximos passos para produção

## Critérios de Saída Propostos

- distribuição percebida como mais justa
- período fechado de `3` meses preservado
- cenários sensíveis protegidos por testes relevantes
- impacto funcional consolidado na documentação

## Registro de Progresso

- [x] Estrutura inicial do V20 criada
- [x] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Próximos Passos do V20

1. revisar escassez e critérios de desempate em cenários mais densos
2. validar impacto da mudança em modelos com `3` funções no mesmo dia
3. consolidar a fase 2 antes de avançar para cobertura e impacto

## Artefatos da Fase 1

- `docs/reviews/artifacts/v20/SCHEDULE_RULES_REVIEW_V20.md`
