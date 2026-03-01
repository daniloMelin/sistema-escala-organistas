# Spike de Migração CRA para Vite

## Histórico de Revisões

| Versão | Data                    | Autor(es)    | Descrição da Revisão                                                        |
| ------ | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| 1.0    | 25 de fevereiro de 2026 | Danilo Melin | Criação do spike técnico da Fase 3.2 para avaliar migração de CRA para Vite |

## Objetivo

Avaliar a viabilidade técnica de migrar o projeto de `Create React App (CRA)` para `Vite`, com foco em:

- impacto real no projeto atual
- riscos de compatibilidade
- esforço estimado
- plano de rollback
- decisão recomendada para o próximo ciclo

## Escopo do Spike

Este spike não executa a migração completa.

Ele cobre:

- levantamento dos acoplamentos atuais ao CRA
- validação do baseline atual de build
- análise dos pontos que precisariam ser adaptados no projeto
- recomendação técnica sobre quando migrar

## Baseline Atual Validado

Comando executado:

```bash
npm run build
```

Resultado:

- build atual com CRA executado com sucesso
- saída gerada em `build/`
- Firebase Hosting atual aponta para `build` em `firebase.json`

## Estado Atual do Projeto

### Tooling atual

- bundler/dev server: `react-scripts@5.0.1`
- React: `19.1.0`
- React Router DOM: `7.6.0`
- testes: Jest via `react-scripts test`
- lint: ESLint via script próprio
- deploy: Firebase Hosting com pasta `build`

### Acoplamentos identificados ao CRA

#### 1. Scripts do `package.json`

O projeto depende diretamente de:

```json
"start": "react-scripts start"
"build": "react-scripts build"
"test": "react-scripts test"
```

Impacto:

- precisam ser substituídos por scripts do Vite
- testes precisam continuar com Jest ou migrar futuramente para Vitest

#### 2. Variáveis de ambiente com prefixo `REACT_APP_`

Arquivo impactado:

- `src/firebaseConfig.js`

Hoje o projeto usa:

- `process.env.REACT_APP_FIREBASE_API_KEY`
- `process.env.REACT_APP_FIREBASE_AUTH_DOMAIN`
- `process.env.REACT_APP_FIREBASE_PROJECT_ID`
- `process.env.REACT_APP_FIREBASE_STORAGE_BUCKET`
- `process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `process.env.REACT_APP_FIREBASE_APP_ID`

No Vite, o padrão seria:

- `import.meta.env.VITE_FIREBASE_API_KEY`
- etc.

Impacto:

- exige adaptação do carregamento de env vars
- documentação `.env` deve ser atualizada

#### 3. Uso de `process.env.NODE_ENV`

Arquivos impactados:

- `src/utils/logger.js`
- `src/services/firestoreLoggerReporter.js`
- `src/components/ErrorBoundary.js`

No Vite, o equivalente preferencial é:

- `import.meta.env.DEV`
- `import.meta.env.PROD`

Impacto:

- baixo
- precisa ajuste pontual

#### 4. `public/index.html` com `%PUBLIC_URL%`

Arquivo impactado:

- `public/index.html`

No CRA, o HTML usa:

- `%PUBLIC_URL%/favicon.ico`
- `%PUBLIC_URL%/logo192.png`
- `%PUBLIC_URL%/manifest.json`

No Vite, o `index.html` tem outra convenção.

Impacto:

- precisa revisão do HTML base
- baixo risco

#### 5. Firebase Hosting aponta para `build`

Arquivo impactado:

- `firebase.json`

Hoje:

```json
"public": "build"
```

Com Vite, o padrão será:

```json
"public": "dist"
```

Impacto:

- ajuste simples
- exige validação final de deploy

#### 6. Testes acoplados ao `react-scripts test`

Arquivos impactados:

- `package.json`
- `.github/workflows/ci.yml`

Impacto:

- médio
- a migração para Vite não obriga trocar Jest neste ciclo
- porém os scripts de teste e build da CI precisam ser revisados em conjunto

## Itens Sem Risco Relevante Identificado

Os seguintes pontos não apresentam risco alto para a migração:

- React lazy loading
- Context API
- Hooks customizados
- integração com Firebase SDK no frontend
- `jspdf`
- estrutura de componentes atual
- CSS atual separado por domínio

## Riscos Reais da Migração

### Risco 1. Variáveis de ambiente quebrarem a inicialização do Firebase

Se a troca de `REACT_APP_*` para `VITE_*` não for feita corretamente, o app pode subir sem configuração válida.

Mitigação:

- migrar `.env.example`
- validar `src/firebaseConfig.js`
- testar login e leitura/gravação básica

### Risco 2. Build funcionar localmente, mas quebrar no deploy

O Firebase Hosting hoje usa `build/`; Vite gera `dist/`.

Mitigação:

- ajustar `firebase.json`
- executar `npm run build`
- revisar deploy antes do merge

### Risco 3. Testes e CI perderem estabilidade temporária

Mesmo mantendo Jest, a troca de bundler muda scripts e exige revisão do pipeline.

Mitigação:

- migrar scripts com cuidado
- validar `npm test`, `npm run lint` e `npm run build` no ciclo da migração

## Esforço Estimado

Estimativa para migração controlada em branch dedicada:

- preparação de ambiente e scripts: `0,5 dia`
- migração de env vars e HTML base: `0,5 dia`
- ajuste de Firebase Hosting e validação local: `0,5 dia`
- revisão de CI e testes: `0,5 dia`
- margem para correções: `0,5 dia`

Estimativa total:

- `2 a 3 dias úteis` para uma migração segura e revisada

## Plano de Migração Recomendado

### Etapa 1. Criar branch dedicada

Sugestão:

```bash
git checkout -b review/v4-fase-3-vite-migration
```

### Etapa 2. Instalar Vite e plugin React

Dependências esperadas:

- `vite`
- `@vitejs/plugin-react`

### Etapa 3. Criar configuração base

Arquivos esperados:

- `vite.config.js`
- `index.html` na raiz

### Etapa 4. Ajustar scripts

Exemplo esperado:

```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```

### Etapa 5. Adaptar env vars

Converter de:

- `REACT_APP_*`

Para:

- `VITE_*`

### Etapa 6. Revisar deploy Firebase

Atualizar `firebase.json` para:

```json
"public": "dist"
```

### Etapa 7. Validar fluxos críticos

Checklist mínimo:

- login com Google
- carregar igrejas
- cadastrar igreja
- cadastrar organista
- gerar escala
- exportar PDF
- build de produção

## Plano de Rollback

Se a migração falhar:

1. manter branch do spike isolada
2. não fazer merge na `main`
3. manter `react-scripts` como padrão
4. registrar incompatibilidades encontradas
5. reagendar a migração para ciclo futuro

Rollback operacional:

- basta descartar a branch da migração
- nenhum impacto em produção se não houver merge

## Decisão Técnica do Spike

### Conclusão

A migração de CRA para Vite é **viável e recomendada**, mas **não deve ser feita junto com mudanças funcionais**.

### Decisão recomendada

- concluir a Fase 3.2 como spike de avaliação técnica
- manter o projeto em CRA neste momento
- executar a migração real apenas em branch dedicada e ciclo próprio

### Justificativa

- o projeto está estável hoje
- a migração traz ganho de sustentabilidade e velocidade de desenvolvimento
- o risco não está na regra de negócio, e sim em tooling, env vars e deploy
- portanto, o melhor custo-benefício é migrar em um ciclo separado e controlado

## Próximo Passo Recomendado

Criar um ciclo exclusivo para a migração técnica quando a prioridade não estiver em entrega funcional.

Sugestão de branch futura:

```bash
review/v4-fase-3-vite-migration
```
