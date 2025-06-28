# Sistema de Escala de Organistas 🎶

Este é um aplicativo web desenvolvido para automatizar a criação e o gerenciamento de escalas de organistas para cultos religiosos de uma igreja. O sistema visa substituir o processo manual, garantindo uma distribuição mais equitativa das tarefas, considerando a disponibilidade de cada participante e facilitando o compartilhamento da escala final.

Este projeto foi desenvolvido como parte do Projeto de Extensão (PEX) do curso de Tecnologia em Análise e Desenvolvimento de Sistemas.

## ✨ Funcionalidades Principais

* **Cadastro de Organistas:** Permite cadastrar os músicos e suas disponibilidades para cada dia da semana.
* **Geração Automática de Escala:** Cria uma escala para um período determinado, aplicando um algoritmo para distribuição justa das designações.
* **Visualização Clara:** Exibe a escala gerada em um formato de lista textual, agrupada por data.
* **Exportação para PDF:** Gera um arquivo PDF da escala para fácil compartilhamento e impressão.
* **Armazenamento de Dados:** Utiliza o Firebase (Firestore) para persistir as informações.
* **Histórico de Escalas:** Exibe as 3 últimas escalas geradas para consulta rápida.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React](https://reactjs.org/)
* **Backend e Banco de Dados:** [Firebase](https://firebase.google.com/) (Firestore e Hosting)
* **Geração de PDF:** [jsPDF](https://github.com/parallax/jsPDF)
* **Roteamento:** [React Router](https://reactrouter.com/)

## ✅ Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 16.x ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Uma conta no [Firebase](https://firebase.google.com/)

## ⚙️ Configuração do Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### 1\. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2\. Instale as Dependências

Na pasta raiz do projeto, instale todas as dependências necessárias:

```bash
npm install
```

ou

```bash
yarn install
```

### 3\. Configure o Firebase

Para que o aplicativo se conecte ao seu banco de dados, você precisa configurar suas credenciais do Firebase.

1. Crie um projeto no [Console do Firebase](https://console.firebase.google.com/).

2. Adicione um aplicativo Web ao seu projeto.

3. O Firebase fornecerá um objeto de configuração. Copie este objeto.

4. Na pasta `src/`, crie um arquivo chamado `firebaseConfig.js`.

5. Cole o objeto de configuração neste arquivo, como no exemplo abaixo, substituindo pelos seus dados reais:

    ```javascript
    // src/firebaseConfig.js
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    // Inicializa o Firebase
    const app = initializeApp(firebaseConfig);

    // Inicializa o Firestore e exporta
    export const db = getFirestore(app);
    ```

**⚠️ IMPORTANTE:** Adicione `src/firebaseConfig.js` ao seu arquivo `.gitignore` para evitar expor suas credenciais em repositórios públicos.

## 📜 Scripts Disponíveis

Na pasta do projeto, você pode executar os seguintes comandos:

### `npm start`

Executa o aplicativo em modo de desenvolvimento.  
Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) para visualizá-lo em seu navegador.

A página recarregará automaticamente quando você fizer alterações no código.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.  
Este comando otimiza os arquivos para o melhor desempenho e os prepara para o deploy.

## 🚀 Deploy (Publicação Online)

Este projeto está configurado para ser facilmente implantado usando o **Firebase Hosting**.

### 1\. Instale as Ferramentas do Firebase

```bash
npm install -g firebase-tools
```

### 2\. Faça o Login e Inicialize o Hosting

No terminal, na raiz do projeto:

```bash
# Faça o login com sua conta do Google associada ao Firebase
firebase login

# Inicie a configuração do hosting
firebase init hosting
```

Siga as instruções:

* **Selecione:** `Use an existing project` e escolha seu projeto.
* **Diretório público:** Digite `build`.
* **Configurar como single-page app:** Digite `Y` (Sim).
* **Configurar builds automáticos com GitHub:** Digite `N` (Não) por enquanto.

### 3\. Faça o Deploy

Após configurar o hosting e ter feito o build do seu projeto (`npm run build`), execute:

```bash
firebase deploy --only hosting
```

Após a conclusão, o terminal fornecerá a URL onde seu aplicativo está hospedado online (ex: `https://seu-projeto.web.app`).
