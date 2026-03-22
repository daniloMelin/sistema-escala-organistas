# **Sistema de Gestão de Escalas para Organistas** 🎹

![Status do Projeto](https://img.shields.io/badge/Status-Em_Produção-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

Uma plataforma web completa (SaaS) para automatizar, gerenciar e
distribuir escalas de organistas para múltiplas congregações. O sistema
substitui planilhas manuais por uma solução inteligente que considera
disponibilidade granular, equidade na distribuição e permite ajustes
manuais finos.

Este projeto foi desenvolvido como parte do **Projeto de Extensão
(PEX)** do curso de Tecnologia em Análise e Desenvolvimento de
Sistemas.

🔗 **Acesse o sistema online:** ( <https://escala-organistas.web.app/> )

---

## Sumário

- [**Sistema de Gestão de Escalas para Organistas** 🎹](#sistema-de-gestão-de-escalas-para-organistas-)
  - [Sumário](#sumário)
  - [✨ **Evolução e Funcionalidades**](#-evolução-e-funcionalidades)
    - [🏢 Arquitetura Multi-Igreja (Multi-Tenant)](#-arquitetura-multi-igreja-multi-tenant)
    - [⚙️ Configuração Dinâmica de Cultos](#️-configuração-dinâmica-de-cultos)
    - [👥 Gestão de Pessoas e Disponibilidade Granular](#-gestão-de-pessoas-e-disponibilidade-granular)
    - [🤖 Automação Inteligente](#-automação-inteligente)
    - [✏️ Flexibilidade Total (Human-in-the-loop)](#️-flexibilidade-total-human-in-the-loop)
    - [📄 Relatórios e Exportação](#-relatórios-e-exportação)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [✅ Pré-requisitos para Rodar Localmente](#-pré-requisitos-para-rodar-localmente)
  - [🚀 Instalação e Configuração](#-instalação-e-configuração)
  - [☁️ _Deploy_](#️-deploy)
  - [🤝 _Como Contribuir_](#-como-contribuir)
  - [📄 Licença](#-licença)

---

## ✨ **Evolução e Funcionalidades**

O projeto evoluiu de um script de automação simples para uma plataforma
robusta com as seguintes capacidades:

### 🏢 Arquitetura Multi-Igreja (Multi-Tenant)

- **Gestão Centralizada:** Um único usuário pode cadastrar e gerenciar
  múltiplas igrejas ou congregações.
- **Isolamento de Dados:** Os dados de organistas e escalas de uma
  igreja são estritamente isolados das outras, garantindo privacidade e
  organização.

### ⚙️ Configuração Dinâmica de Cultos

- **Dias Personalizáveis:** Cada igreja pode configurar seus próprios
  dias de culto. O sistema não é fixo: se a igreja tem culto apenas
  Terça e Sábado, o sistema se adapta.
- **Suporte a RJM:** Configuração específica para incluir ou não a
  Reunião de Jovens e Menores (RJM) aos domingos.

### 👥 Gestão de Pessoas e Disponibilidade Granular

- **Disponibilidade Específica:** O cadastro permite definir
  disponibilidade separada para **Domingo (RJM)** e **Domingo (Culto
  Oficial)**, atendendo à regra de que nem todas as organistas tocam na
  reunião de jovens.
- **CRUD Intuitivo:** Adicione, edite e exclua organistas facilmente
  através do painel de controle.

### 🤖 Automação Inteligente

- **Algoritmo de Distribuição:** Gera escalas automaticamente
  respeitando as configurações da igreja e regras de não-duplicidade
  (ex: não escalar a mesma pessoa para "meia hora" e "culto" no mesmo
  dia).
- **Histórico:** Salva automaticamente todas as escalas geradas para consulta futura.

### ✏️ Flexibilidade Total (Human-in-the-loop)

- **Edição Manual:** Após a geração automática, o administrador pode
  editar manualmente qualquer dia da escala (trocando a organista)
  antes de finalizar.
- **Atualização em Tempo Real:** As alterações são salvas
  instantaneamente no banco de dados.

### 📄 Relatórios e Exportação

- **PDF Profissional:** Geração de PDF formatado com o nome da
  congregação no cabeçalho e nome de arquivo normalizado e seguro (ex:
  `escala_jardim_uira.pdf`).
- **Visualização Mobile:** Interface responsiva para acesso via celular.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna e serverless:

- **Frontend:** [React.js](https://reactjs.org/) (Hooks, Context API,
  React Router v6)
- **Backend as a Service:** [Firebase](https://firebase.google.com/)
  - **Authentication:** Login seguro via Google.
  - **Firestore:** Banco de dados NoSQL para dados em tempo real.
  - **Hosting:** Hospedagem global rápida e segura (HTTPS).
- **Utilitários:**
  - `jspdf`: Para geração de relatórios em PDF no navegador.

---

## ✅ Pré-requisitos para Rodar Localmente

- [Node.js](https://nodejs.org/) (versão 20.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma conta no [Firebase](https://firebase.google.com/) com um projeto criado.

---

## 🚀 Instalação e Configuração

**Clone o Repositório:**

```bash
git clone https://github.com/daniloMelin/sistema-escala-organistas.git
cd sistema-escala-organistas
```

**Instale as Dependências:**

```bash
npm install
```

**Configuração do Firebase:**

- Crie um arquivo `src/firebaseConfig.js` na raiz da pasta `src`.
  Exemplo: `src/firebaseConfig.example.js`
- Cole suas credenciais do Firebase (API Key, Auth Domain, Project ID, etc.).
- _Nota: Este arquivo deve permanecer em `.gitignore` por segurança,
  não o comite._

**Rodar o Projeto:**

```bash
npm start
```

- O app abrirá em <http://localhost:3000>.

---

## ☁️ _Deploy_

O projeto está configurado para o **Firebase Hosting**.

**Gerar Build de Produção:**

```bash
npm run build
```

Isso cria uma pasta `build` otimizada na raiz do projeto.

**Fazer o Deploy (com Firebase CLI):**

```bash
firebase deploy --only hosting
```

_Certifique-se de ter o `firebase-tools` instalado e estar logado (`firebase login`)._

---

## 🤝 _Como Contribuir_

Este projeto segue padrões rigorosos de desenvolvimento:

1. **Conventional Commits:** Utilizamos commits semânticos (`feat:`,
   `fix:`, `docs:`, `style:`) com emojis para facilitar a leitura do
   histórico.
2. **Feature Branches:** Não commite diretamente na `main`. Crie
   branches como `feat/nova-funcionalidade`.

Checklist rápido para PRs:

- Atualize a documentação quando necessário.
- Execute `npm install` e verifique que a aplicação inicia (`npm start`).
- Crie uma branch com nome claro e faça um PR direcionado à branch
  `main` ou à branch de feature correspondente.

Para detalhes completos, leia nosso [Guia de Contribuição](CONTRIBUTING.md).

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE)
para mais detalhes.

---

_Desenvolvido por **Danilo Gianini Melin** como requisito parcial para
obtenção de grau no curso de Análise e Desenvolvimento de Sistemas._
