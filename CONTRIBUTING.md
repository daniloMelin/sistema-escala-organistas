# Guia de Contribuição para o Projeto de Escala de Organistas

Agradecemos o seu interesse em contribuir para este projeto! Para manter a qualidade e a organização do código, seguimos algumas diretrizes detalhadas abaixo.

## ✍️ Padrão de Commits (Conventional Commits)

Este projeto utiliza a convenção **Conventional Commits** para as mensagens de commit. Essa convenção define um conjunto de regras para criar um histórico de commit explícito, o que facilita a automação e o entendimento das alterações.

A estrutura de um commit semântico é: `<tipo>[escopo opcional]: <descrição>`

### Tipos de Commit

* **`feat` ✨:** Para a inclusão de um **novo recurso** (feature).
* **`fix` 🐛:** Para a **correção de um bug**.
* **`refactor` ♻️:** Para refatoração de código que não altera a funcionalidade final.
* **`docs` 📚:** Para alterações na **documentação** (como este arquivo).
* **`style` 💄:** Para alterações de **formatação de código** (espaçamento, ponto e vírgula, etc.).
* **`build` 📦:** Para modificações em arquivos de **build ou dependências**.
* **`perf` ⚡:** Para alterações de código que melhoram a **performance**.
* **`test` 🧪:** Para adicionar ou modificar **testes**.
* **`chore` 🔧:** Para atualizações de tarefas de build, configurações, etc. (ex: `.gitignore`).
* **`ci` 🧱:** Para mudanças relacionadas à **integração contínua** (CI).
* **`cleanup` 🧹:** Para **limpeza de código** (remover código comentado, arquivos não utilizados).
* **`remove` 🗑️:** Para **exclusão** de arquivos, diretórios ou funcionalidades.
* **`raw` 🗃️:** Para mudanças relacionadas a arquivos de configurações, dados, features, parâmetros.

### Exemplos de Mensagens de Commit

```bash
git commit -m "feat: ✨ Adiciona login com Google"
git commit -m "fix: 🐛 Corrige cálculo de distribuição de organistas"
git commit -m "docs: 📚 Atualiza o Guia de Contribuição"