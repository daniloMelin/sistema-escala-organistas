# Baseline Prettier V8

## Objetivo

Definir um recorte seguro para adoção gradual do `format:check`, sem
gerar uma PR massiva de estilo e sem misturar formatação com mudanças
funcionais.

## Diagnóstico do Ciclo

No estado atual do repositório, o comando abaixo ainda acusa um volume
alto de arquivos:

```bash
npm run format:check
```

O passivo atual cobre principalmente:

- workflows em `.github/workflows/`
- configurações e arquivos de raiz
- documentação em `docs/` e arquivos institucionais
- testes E2E em `e2e/`
- código de aplicação em `src/`

Conclusão:

- o repositório ainda não está em condição de adotar `prettier . --check`
  como gate global sem gerar ruído excessivo

## Decisão do V8

No ciclo V8, a decisão é:

- não aplicar `Prettier --write` no repositório inteiro
- não transformar `format:check` em gate global neste momento
- adotar uma estratégia gradual por grupos lógicos de arquivos

## Recorte Seguro Inicial

O recorte seguro recomendado para próximas entregas é:

1. documentação ativa e histórica já revisada no V8
2. arquivos institucionais principais
3. testes E2E
4. código de aplicação em `src/`
5. workflows e configs de raiz

## Ordem Recomendada

### 1. Documentação

Prioridade:

- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `docs/CODE_REVIEW*.md`
- `docs/E2E*.md`
- `docs/FIRESTORE_SCHEMA.md`
- `docs/IMPLEMENTATION_GUIDE.md`
- `docs/SCHEDULE_ALGORITHM.md`
- `docs/VITE_SPIKE_V4.md`

Motivo:

- menor risco funcional
- diffs mais fáceis de revisar
- já está alinhado ao saneamento documental do V8

### 2. Testes E2E

Prioridade:

- `e2e/**/*.js`

Motivo:

- menor risco que arquivos de produção
- facilita manutenção futura da suíte

### 3. Código de Aplicação

Prioridade:

- `src/**/*.js`
- `src/**/*.css`

Motivo:

- maior volume
- exige mais cuidado para não misturar forma com comportamento

### 4. Workflows e Configurações

Prioridade:

- `.github/workflows/*.yml`
- `.vscode/*.json`
- `firebase.json`
- `tsconfig.json`

Motivo:

- baixo volume
- fácil validação
- pode ser tratado em PR curta dedicada

## Regra Operacional Recomendada

Até a baseline ficar estável:

- usar `npm run format:check` como diagnóstico local
- aplicar `npm run format` apenas em recortes pequenos e planejados
- evitar rodar `Prettier --write` em todo o repositório sem branch
  dedicada

## Critério para Avançar a Baseline

O recorte pode ser ampliado quando:

- o grupo atual estiver limpo e revisado
- os diffs forem pequenos e compreensíveis
- não houver mistura com refatorações funcionais

## Resultado Esperado

Ao final desse processo, o projeto deve chegar a um estado em que:

- `format:check` seja utilizável de forma previsível
- o passivo residual seja pequeno
- o time consiga tratar formatação como manutenção contínua, e não como
  mutirão eventual
