# **Sistema de Gestão de Escalas Multi-Igreja** 🎹

![Status do Projeto](https://img.shields.io/badge/Status-Em_Produção-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

Uma plataforma web completa (SaaS) para automatizar, gerenciar e distribuir escalas de organistas para múltiplas congregações. O sistema substitui planilhas manuais por uma solução inteligente que considera disponibilidade, equidade e permite ajustes manuais.

Este projeto foi desenvolvido como parte do **Projeto de Extensão (PEX)** do curso de Tecnologia em Análise e Desenvolvimento de Sistemas.

🔗 **Acesse o sistema online:** ( <https://escala-organistas.web.app/> )

---

## Sumário

- [**Sistema de Gestão de Escalas Multi-Igreja** 🎹](#sistema-de-gestão-de-escalas-multi-igreja-)
  - [Sumário](#sumário)
  - [✨ **Evolução e Funcionalidades**](#-evolução-e-funcionalidades)
    - [🏢 Arquitetura Multi-Igreja (Multi-Tenant)](#-arquitetura-multi-igreja-multi-tenant)
    - [👥 Gestão de Pessoas](#-gestão-de-pessoas)
    - [⚙️ Automação Inteligente](#️-automação-inteligente)
    - [✏️ Flexibilidade Total (Human-in-the-loop)](#️-flexibilidade-total-human-in-the-loop)
    - [📄 Relatórios e Exportação](#-relatórios-e-exportação)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [✅ Pré-requisitos para Rodar Localmente](#-pré-requisitos-para-rodar-localmente)
  - [🚀 Instalação e Configuração](#-instalação-e-configuração)
  - [☁️ *Deploy*](#️-deploy)
  - [🤝 *Como Contribuir*](#-como-contribuir)
  - [📄 Licença](#-licença)

---

## ✨ **Evolução e Funcionalidades**

O projeto evoluiu de um script de automação simples para uma plataforma robusta com as seguintes capacidades:

### 🏢 Arquitetura Multi-Igreja (Multi-Tenant)

- **Gestão Centralizada:** Um único usuário pode cadastrar e gerenciar múltiplas igrejas ou congregações.
- **Isolamento de Dados:** Os dados de organistas e escalas de uma igreja são estritamente isolados das outras, garantindo privacidade e organização.

### 👥 Gestão de Pessoas

- **Cadastro Completo:** Registro de organistas com nome e disponibilidade semanal flexível.
- **CRUD Intuitivo:** Adicione, edite e exclua organistas facilmente através do painel de controle.

### ⚙️ Automação Inteligente

- **Algoritmo de Distribuição:** Gera escalas automaticamente respeitando regras de não-duplicidade (não tocar "meia hora" e "culto" no mesmo dia) e priorizando quem tocou menos.
- **Histórico:** Salva automaticamente todas as escalas geradas para consulta futura.

### ✏️ Flexibilidade Total (Human-in-the-loop)

- **Edição Manual:** Após a geração automática, o administrador pode editar manualmente qualquer dia da escala (trocando a organista ou definindo como "VAGO") antes de finalizar.
- **Atualização em Tempo Real:** As alterações são salvas instantaneamente no banco de dados.

### 📄 Relatórios e Exportação

- **PDF Profissional:** Geração de PDF formatado com o nome da congregação no cabeçalho e nome de arquivo normalizado (ex: `escala_jardim_uira.pdf`).
- **Visualização Mobile:** Interface responsiva para acesso via celular.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna e serverless:

- **Frontend:** [React.js](https://reactjs.org/) (Hooks, Context API, React Router v6)
- **Backend as a Service:** [Firebase](https://firebase.google.com/)
  - **Authentication:** Login seguro via Google.
  - **Firestore:** Banco de dados NoSQL para dados em tempo real.
  - **Hosting:** Hospedagem global rápida e segura (HTTPS).
- **Utilitários:**
  - `jspdf`: Para geração de relatórios em PDF no navegador.

---

## ✅ Pré-requisitos para Rodar Localmente

- [Node.js](https://nodejs.org/) (versão 16.x ou superior)
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

- Crie um arquivo `src/firebaseConfig.js` a partir do exemplo `src/firebaseConfig.example.js` (já incluído neste repositório).
- Cole suas credenciais do Firebase (API Key, Auth Domain, Project ID, etc.).
- *Nota: Este arquivo deve permanecer em `.gitignore` por segurança — não o comite.*

   > Alternativa com variáveis de ambiente (opcional): exporte as chaves como `REACT_APP_FIREBASE_API_KEY`, etc., e importe no `src/firebaseConfig.js`. Lembre-se que em aplicações frontend as chaves aparecem no bundle; trate regras de segurança no Firebase (restrição de domínios, regras do Firestore).

**Instalação e uso do Firebase CLI (opcional, para deploy):**

```bash
    npm install -g firebase-tools
    firebase login
    firebase init hosting
    # siga as instruções e escolha o diretório `build` como public
```

**Rodar o Projeto:**

```bash
    npm start
```

- O app abrirá em [http://localhost:3000](http://localhost:3000).

---

## ☁️ *Deploy*

O projeto está configurado para o **Firebase Hosting**.

**Gerar Build de Produção:**

```bash
npm run build
```

Isso cria uma pasta `build` otimizada.

**Fazer o Deploy (com Firebase CLI):**

```bash
firebase deploy --only hosting
```

Se você não inicializou o Firebase no projeto, use `firebase init hosting` antes.

---

## 🤝 *Como Contribuir*

Este projeto segue padrões rigorosos de desenvolvimento:

1. **Conventional Commits:** Utilizamos commits semânticos (`feat:`, `fix:`, `docs:`, `style:`) com emojis para facilitar a leitura do histórico.
2. **Feature Branches:** Não commite diretamente na `main`. Crie branches como `feat/nova-funcionalidade`.

Checklist rápido para PRs:

- Atualize a documentação quando necessário.
- Execute `npm install` e verifique que a aplicação inicia (`npm start`).
- Crie uma branch com nome claro e faça um PR direcionado à branch `main` ou à branch de feature correspondente.

Para detalhes completos, leia nosso **[Guia de Contribuição](CONTRIBUTING.md)**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Projeto licenciado sob MIT — ver o arquivo `LICENSE` para o texto completo.

---

*Desenvolvido por **Danilo Gianini Melin** como requisito parcial para obtenção de grau no curso de Análise e Desenvolvimento de Sistemas.*
