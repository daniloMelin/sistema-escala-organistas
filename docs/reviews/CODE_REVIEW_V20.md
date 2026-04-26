# Code Review V20

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                                 |
| ------ | ------------------- | ------------ | ---------------------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V20                                 |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de regras de negócio da escala |

## Objetivo

Revisar e consolidar as regras de negócio da geração de escala, com foco
em justiça de distribuição, previsibilidade e aderência ao modelo real
de operação das igrejas.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Data de início: `em aberto`
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

- documentar critérios atuais do algoritmo
- registrar onde a distribuição ainda parece injusta
- definir metas de comportamento esperado

### Fase 2 - Ajustes do algoritmo

- implementar refinamentos de distribuição
- revisar critérios de desempate e escassez
- validar impacto em cenários representativos

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
