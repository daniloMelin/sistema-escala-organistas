# Baseline Markdownlint V8

## Objetivo

Registrar o estado operacional atual do `npm run lint:md` após o
saneamento documental executado no ciclo V8.

## Comando Avaliado

```bash
npm run lint:md
```

## Resultado Atual

O lint documental ainda não está totalmente limpo no repositório
inteiro, mas o passivo deixou de ser difuso e passou a estar
concentrado em um conjunto residual identificável.

## Situação Consolidada no V8

Documentos já estabilizados no ciclo:

- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `docs/reviews/CODE_REVIEW.md`
- `docs/reviews/CODE_REVIEW_V2.md`
- `docs/reviews/CODE_REVIEW_V3.md`
- `docs/reviews/CODE_REVIEW_V7.md`
- `docs/reviews/CODE_REVIEW_V8.md`
- `docs/testing/E2E_GUIDE.md`
- `docs/testing/E2E_SMOKE_V7.md`
- `docs/testing/E2E_CI_POLICY_V7.md`
- `docs/testing/E2E_EXPANSION_V7.md`
- `docs/architecture/FIRESTORE_SCHEMA.md`
- `docs/architecture/IMPLEMENTATION_GUIDE.md`
- `docs/architecture/SCHEDULE_ALGORITHM.md`
- `docs/planning/VITE_SPIKE_V4.md`

Resultado:

- esses arquivos já podem ser tratados como baseline confiável do novo
  padrão documental

## Passivo Residual Identificado

O `lint:md` ainda acusa problemas concentrados em:

- `docs/reviews/CODE_REVIEW_V4.md`
- `docs/reviews/CODE_REVIEW_V5.md`
- `docs/reviews/CODE_REVIEW_V6.md`
- `docs/testing/E2E_CONSOLIDATION_V6.md`
- `docs/testing/E2E_COVERAGE_V5.md`
- `docs/testing/E2E_STRATEGY.md`

## Perfil do Passivo Residual

Os erros restantes estão concentrados principalmente em:

- `MD013`: linhas longas acima do limite atual
- `MD060`: estilo de tabelas Markdown

Conclusão:

- o repositório já saiu do estado de passivo generalizado
- o passivo restante é pequeno o suficiente para ser tratado em ciclos
  curtos e dirigidos

## Decisão Operacional do V8

No fechamento desta fase:

- `npm run lint:md` passa a ser utilizável como diagnóstico real
- o comando ainda não deve ser tratado como gate global obrigatório
- o próximo avanço recomendado é atacar apenas o conjunto residual
  identificado

## Próximo Recorte Recomendado

Ordem sugerida para continuidade:

1. `docs/reviews/CODE_REVIEW_V4.md`
2. `docs/reviews/CODE_REVIEW_V5.md`
3. `docs/reviews/CODE_REVIEW_V6.md`
4. `docs/testing/E2E_CONSOLIDATION_V6.md`
5. `docs/testing/E2E_COVERAGE_V5.md`
6. `docs/testing/E2E_STRATEGY.md`

## Resultado Esperado

Após tratar esse recorte residual, o projeto fica próximo de um estado
em que:

- `lint:md` possa ser promovido a gate confiável
- a manutenção documental diária seja previsível
- novos documentos já nasçam dentro de uma baseline clara
