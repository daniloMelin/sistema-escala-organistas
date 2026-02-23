# Code Review V3 - Plano de Execução

## Objetivo do ciclo

Evoluir qualidade e consistência do projeto com foco em:

1. Coverage em CI (meta inicial >= 70% em utilitários e hooks críticos)
2. Padronização final de UI e remoção de estilos inline remanescentes
3. Testes E2E dos fluxos principais (**executar por último**)

Data de início: **23/02/2026**

## Ordem de execução (definida)

### Etapa 1 - Coverage em CI

- [x] Criar script de cobertura com gate para arquivos críticos
- [x] Integrar gate no workflow de CI (`.github/workflows/ci.yml`)
- [ ] Atingir e manter >= 70% nos arquivos críticos definidos

Arquivos críticos atuais:
- `src/utils/validation.js`
- `src/utils/scheduleLogic.js`
- `src/utils/dateUtils.js`
- `src/hooks/useChurchDashboard.js`

### Etapa 2 - Padronização de UI

- [x] Início da migração: `App.js` e `Auth.js` sem estilos inline
- [x] Base visual centralizada em `src/App.css` com classes e variáveis CSS
- [ ] Remover inline styles remanescentes dos componentes de domínio
- [ ] Revisar consistência de tamanhos e variantes de botões

### Etapa 3 - E2E (por último)

- [ ] Definir stack E2E (Cypress ou Playwright)
- [ ] Implementar cenário E2E: autenticação + cadastro de igreja + cadastro de organista
- [ ] Implementar cenário E2E: geração de escala + edição + exportação PDF
- [ ] Integrar E2E ao CI com gatilho dedicado

## Critério de conclusão do V3

- CI bloqueia PR quando coverage crítica ficar abaixo de 70%.
- Componentes principais sem estilos inline repetitivos.
- Fluxos principais cobertos por E2E executando no CI.
