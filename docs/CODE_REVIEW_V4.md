# Code Review V4

## Histórico de Revisões

| Versão | Data                    | Autor(es)    | Descrição da Revisão                                                                                    |
| ------ | ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| 1.0    | 24 de fevereiro de 2026 | Danilo Melin | Criação do Code Review V4 com avaliação técnica em padrão sênior e definição das fases de implementação |
| 1.1    | 24 de fevereiro de 2026 | Danilo Melin | Implementação inicial da Fase 1: schema validation em Firestore Rules e documentação de contrato |
| 1.2    | 24 de fevereiro de 2026 | Danilo Melin | Conclusão da Fase 1 após deploy das Firestore Rules em produção |
| 1.3    | 25 de fevereiro de 2026 | Danilo Melin | Implementação da Fase 2.1: correção do fluxo de feedback de sucesso em `useChurchManager` |
| 1.4    | 25 de fevereiro de 2026 | Danilo Melin | Implementação da Fase 2.2: proteção de hooks assíncronos contra `setState` após unmount |

## Objetivo

Elevar robustez de produção com foco em segurança de dados, confiabilidade de fluxo e manutenção.

- Escopo: continuação após `CODE_REVIEW_V2` e `CODE_REVIEW_V3`.
- Critério de avaliação: recomendações e priorização com visão de engenharia sênior.

## Diretriz de Prioridade

1. Segurança e integridade de dados (backend/rules)
2. Estabilidade de fluxos assíncronos e UX de erro/sucesso
3. Sustentabilidade técnica (arquitetura/tooling)

## Plano de Implementação

### Fase 1 - Hardening de Dados (Imediata)

#### 1.1 Validar schema nas Firestore Rules (**AÇÃO INICIAL**)

- Status: `CONCLUÍDO`
- Prioridade: `CRÍTICA`
- Motivo:
  - hoje as rules validam ownership, mas não validam estrutura/tipos dos documentos.
  - risco de gravação de payload inválido por cliente malicioso ou bug de frontend.
- Entregáveis:
  - validações por coleção:
    - `users/{userId}`
    - `churches/{churchId}`
    - `organists/{organistId}`
    - `schedules/{scheduleId}`
    - `appLogs/{logId}`
  - limites de tamanho/tipo para campos críticos (`name`, `code`, `availability`, `config`, `period`, `data`)
  - bloqueio de campos inesperados sensíveis
  - checklist de deploy e validação pós-deploy
- Critério de aceite:
  - rules publicadas com `firebase deploy --only firestore:rules`
  - operações válidas continuam funcionando
  - operações inválidas são bloqueadas no simulador/rules-unit-tests

#### 1.2 Padronizar contrato de payload entre frontend e Firestore

- Status: `IMPLEMENTADO`
- Prioridade: `ALTA`
- Entregáveis:
  - documento curto de schema esperado por coleção (`docs/FIRESTORE_SCHEMA.md`)
  - mapeamento de compatibilidade com dados legados

### Fase 2 - Estabilidade de Aplicação

#### 2.1 Corrigir feedback de sucesso em `useChurchManager`

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Problema:
  - mensagem de sucesso pode ser limpa logo após salvar.

#### 2.2 Proteger hooks assíncronos contra `setState` após unmount

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Arquivos alvo:
  - `src/hooks/useChurchManager.js`
  - `src/hooks/useChurchDashboard.js`
  - `src/hooks/useChurchScheduleGenerator.js`

#### 2.3 Guard explícito no `useChurch` context

- Status: `PENDENTE`
- Prioridade: `MÉDIA`

### Fase 3 - Sustentabilidade Técnica

#### 3.1 Modularizar CSS por domínio/componente

- Status: `PENDENTE`
- Prioridade: `MÉDIA`

#### 3.2 Spike de migração CRA -> Vite (V4)

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo do spike:
  - esforço estimado
  - riscos de compatibilidade
  - plano de rollback

## Ordem de execução confirmada

1. **Iniciar por 1.1 (Firestore Rules schema validation)**  
2. Seguir para fase 2 (estabilidade)  
3. Depois fase 3 (sustentabilidade)

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [ ] Fase 2.3 concluída
- [ ] Fase 3.1 concluída
- [ ] Fase 3.2 concluída
