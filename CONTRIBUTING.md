# Guia de Contribuição para o Projeto de Escala de Organistas

Agradecemos o seu interesse em contribuir para este projeto! Para
manter a qualidade e a organização do código, seguimos algumas
diretrizes detalhadas abaixo.

## ✍️ Padrão de Commits (Conventional Commits)

Este projeto utiliza a convenção **Conventional Commits** para as
mensagens de commit. Essa convenção define um conjunto de regras para
criar um histórico de commit explícito, o que facilita a automação e o
entendimento das alterações.

A estrutura de um commit semântico é: `<tipo>[escopo opcional]: <descrição>`

### Tipos de Commit

- **`feat` ✨:** Para a inclusão de um **novo recurso** (feature).
- **`fix` 🐛:** Para a **correção de um bug**.
- **`refactor` ♻️:** Para refatoração de código que não altera a
  funcionalidade final.
- **`docs` 📚:** Para alterações na **documentação** (como este arquivo).
- **`style` 💄:** Para alterações de **formatação de código**
  (espaçamento, ponto e vírgula, etc.).
- **`build` 📦:** Para modificações em arquivos de **build ou dependências**.
- **`perf` ⚡:** Para alterações de código que melhoram a **performance**.
- **`test` 🧪:** Para adicionar ou modificar **testes**.
- **`chore` 🔧:** Para atualizações de tarefas de build, configurações,
  etc. (ex: `.gitignore`).
- **`ci` 🧱:** Para mudanças relacionadas à **integração contínua** (CI).
- **`cleanup` 🧹:** Para **limpeza de código** (remover código
  comentado, arquivos não utilizados).
- **`remove` 🗑️:** Para **exclusão** de arquivos, diretórios ou funcionalidades.
- **`raw` 🗃️:** Para mudanças relacionadas a arquivos de configurações,
  dados, features, parâmetros.

### Exemplos de Mensagens de Commit

```bash
git commit -m "feat: ✨ Adiciona login com Google"
git commit -m "fix: 🐛 Corrige cálculo de distribuição de organistas"
git commit -m "docs: 📚 Atualiza o Guia de Contribuição"
```

## ✅ Rotina Local Mínima Antes de Abrir PR

Antes de abrir uma PR, siga esta sequência mínima local:

```bash
npm run format:check
npm run lint:md
npm run lint
```

Se a alteração afetar comportamento da aplicação, execute também:

```bash
npm test -- --watchAll=false --runInBand
```

Se a alteração afetar a suíte E2E, o fluxo de autenticação ou o CI de
testes ponta a ponta, execute também:

```bash
npm run test:e2e
```

### Ordem recomendada

1. Corrija primeiro problemas de formatação com `Prettier`.
2. Em seguida, resolva problemas de Markdown com `lint:md`.
3. Depois, valide `lint` e os testes realmente impactados pela mudança.

### Regra prática

- Não rode a suíte completa sem necessidade se a alteração for apenas documental.
- Não abra PR com `format:check` ou `lint:md` quebrados.
- Se a mudança mexer em workflow, documentação técnica ou comandos do
  projeto, trate a validação local como obrigatória.
