# Contrato de Schema Firestore

## Histórico de Revisões

| Versão | Data | Autor(es) | Descrição da Revisão |
|---|---|---|---|
| 1.0 | 24 de fevereiro de 2026 | Danilo Melin | Criação do contrato de schema para coleções principais |

## Objetivo

Definir o contrato esperado entre frontend e Firestore para reduzir risco de dados inválidos e alinhar validações de `firestore.rules`.

## Estrutura de Coleções

### `users/{userId}`

Campos permitidos:
- `email`: string (max 320)
- `displayName`: string opcional (max 120)
- `photoURL`: string opcional (max 2000)
- `lastLogin`: timestamp opcional
- `createdAt`: timestamp opcional

### `users/{userId}/churches/{churchId}`

Campos permitidos:
- `name`: string (3..100)
- `code`: string opcional (max 50)
- `config`: map obrigatório
- `createdAt`: timestamp opcional

`config`:
- chaves permitidas: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`
- cada dia: lista de 1..3 serviços
- serviço: `{ id, label, needs }`
  - `id`: `RJM` | `MeiaHoraCulto` | `Culto`
  - `label`: string (1..40)
  - `needs`: int (1..2)

### `users/{userId}/churches/{churchId}/organists/{organistId}`

Campos permitidos:
- `name`: string (2..100)
- `availability`: map obrigatório
- `createdAt`: timestamp opcional
- `fixedDays`: lista opcional
- `blockedDates`: lista opcional
- `stats`: map opcional

`availability`:
- chaves permitidas:
  - `sunday` (legado)
  - `sunday_rjm`
  - `sunday_culto`
  - `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`
- valores: boolean

### `users/{userId}/churches/{churchId}/schedules/{scheduleId}`

Campos permitidos:
- `period`: map obrigatório
  - `start`: string `YYYY-MM-DD`
  - `end`: string `YYYY-MM-DD`
- `generatedAt`: timestamp obrigatório
- `data`: lista obrigatória (1..500 itens)
- `organistCount`: int obrigatório (1..100)

### `users/{userId}/appLogs/{logId}`

Campos permitidos:
- `level`: `error` | `warn`
- `message`: string (1..1000)
- `meta`: map opcional
- `context`: map opcional
- `clientTimestamp`: string opcional (max 80)
- `createdAt`: timestamp obrigatório
- `route`: string opcional (max 200)
- `userAgent`: string opcional (max 1000)

Regras de escrita:
- logs só aceitam `create`
- `update` e `delete` bloqueados

## Compatibilidade com Dados Legados

- `availability.sunday` (legado) permanece aceito.
- campos opcionais de perfil em `users/{userId}` são aceitos para evitar quebra de documentos já existentes.

## Checklist de Deploy

1. Executar deploy:
   - `firebase deploy --only firestore:rules`
2. Validar no simulador:
   - escrita válida em `churches`, `organists`, `schedules`, `appLogs`
   - bloqueio de payload inválido (campo inesperado/tipo inválido)
3. Smoke test no frontend:
   - criar/editar igreja
   - criar/editar/excluir organista
   - gerar/salvar escala
