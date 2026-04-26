# Code Review V21

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                     |
| ------ | ------------------- | ------------ | ---------------------------------------- |
| 1.0    | 25 de abril de 2026 | Danilo Melin | Criação do ciclo V21                     |
| 1.1    | 25 de abril de 2026 | Danilo Melin | Estruturação do ciclo de UX mobile final |

## Objetivo

Consolidar a experiência mobile do sistema, com foco em navegação,
legibilidade, ações críticas e adaptação dos fluxos principais em tela
pequena.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Data de início: `em aberto`
- Data de encerramento: `em aberto`
- Contexto: fechamento da experiência de uso em smartphone após ajustes pontuais anteriores

## Diretriz de Prioridade

1. Garantir leitura clara em smartphone
2. Manter ações críticas acessíveis sem competir com o conteúdo
3. Evitar quebras ruins em formulários, cards e toolbars
4. Fechar o ciclo com checklist real de uso mobile

## Diagnóstico Inicial

- várias telas já receberam correções pontuais de mobile
- ainda vale validar a experiência como conjunto, não só por ajuste isolado
- ações de editar, excluir, gerar escala e baixar PDF continuam sensíveis em tela pequena
- o sistema precisa parecer deliberado no mobile, não apenas “quebrar menos”

## Escopo Previsto

### 1. Igrejas

- revisar gerenciamento de igrejas em smartphone
- revisar formulário e lista de igrejas
- revisar leitura dos cards e ações

### 2. Organistas

- revisar gerenciamento de organistas em smartphone
- revisar ordem de leitura entre conteúdo e ações
- revisar tamanho e alinhamento dos botões

### 3. Escala

- revisar tela de geração
- revisar visualização da escala
- revisar toolbar de ações e blocos auxiliares

### 4. Consolidação do ciclo

- registrar impacto da revisão mobile
- consolidar proteção por testes quando fizer sentido
- fechar o ciclo com checklist operacional final

## Fases Propostas

### Fase 1 - Checklist de uso mobile

- definir telas prioritárias
- listar pontos críticos de interação
- registrar comportamentos esperados por tela

### Fase 2 - Ajustes visuais e estruturais

- corrigir quebras ruins
- revisar alinhamento, espaçamento e ordem de leitura
- manter consistência entre mobile e desktop

### Fase 3 - Cobertura e impacto

- registrar o que ficou protegido por teste
- consolidar impacto prático da revisão
- separar pendência residual de aprovação final

### Fase 4 - Fechamento

- encerrar formalmente o ciclo
- deixar base pronta para preparação de produção

## Critérios de Saída Propostos

- telas principais navegáveis em smartphone
- ações críticas estáveis em mobile
- regressões visuais relevantes tratadas
- impacto e cobertura consolidados na documentação
