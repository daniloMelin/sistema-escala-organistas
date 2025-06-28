# Sistema de Escala de Organistas 🎶

Este é um aplicativo web desenvolvido para automatizar a criação e o gerenciamento de escalas de organistas para cultos religiosos de uma igreja. O sistema visa substituir o processo manual, garantindo uma distribuição mais equitativa das tarefas, considerando a disponibilidade de cada participante e facilitando o compartilhamento da escala final.

Este projeto foi desenvolvido como parte do Projeto de Extensão (PEX) do curso de Tecnologia em Análise e Desenvolvimento de Sistemas.

## ✨ Funcionalidades Principais

* **Cadastro de Organistas:** Permite cadastrar os músicos e suas disponibilidades semanais.
* **Autenticação Segura:** Login exclusivo via contas Google para acesso ao sistema.
* **Geração Automática de Escala:** Cria uma escala para um período determinado com distribuição justa.
* **Visualização Clara:** Exibe a escala gerada em um formato de lista textual por data.
* **Exportação para PDF:** Gera um arquivo PDF da escala para fácil compartilhamento.
* **Histórico de Escalas:** Exibe as 3 últimas escalas geradas para consulta rápida.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React](https://reactjs.org/)
* **Autenticação, Backend e Banco de Dados:** [Firebase](https://firebase.google.com/)
* **Geração de PDF:** [jsPDF](https://github.com/parallax/jsPDF)
* **Roteamento:** [React Router](https://reactrouter.com/)

## ✅ Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 16.x ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Uma conta no [Firebase](https://firebase.google.com/)

## ⚙️ Configuração do Projeto

1. **Clone o Repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/sistema-escala-organistas.git](https://github.com/seu-usuario/sistema-escala-organistas.git)
    cd sistema-escala-organistas
    ```

2. **Instale as Dependências:**

    ```bash
    npm install
    ```

3. **Configure o Firebase:**

    * Crie um arquivo `src/firebaseConfig.js` com as suas credenciais do Firebase.
    * **⚠️ IMPORTANTE:** Adicione `src/firebaseConfig.js` ao seu arquivo `.gitignore`.

## 📜 Comandos Principais

* **`npm start`**: Inicia o servidor de desenvolvimento.
* **`npm run build`**: Gera a versão de produção do projeto na pasta `build`.
* **`firebase deploy --only hosting`**: Faz o deploy para o Firebase Hosting (após o build).

## 🤝 Como Contribuir

Este projeto segue um padrão de desenvolvimento e contribuição para manter o código organizado e o histórico de alterações legível.

Para mais detalhes sobre o padrão de commits, configuração do ambiente e outras diretrizes, por favor, leia nosso **[Guia de Contribuição (`CONTRIBUTING.md`)](CONTRIBUTING.md)**
