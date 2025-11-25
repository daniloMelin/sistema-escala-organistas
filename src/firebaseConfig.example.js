// Exemplo de configuração do Firebase.
// Copie este arquivo para `src/firebaseConfig.js` e preencha com suas credenciais.
// Mantenha o arquivo final em `.gitignore` para não vazar chaves.

// OPÇÃO 1: Valores hardcoded (apenas para desenvolvimento/testes)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // opcional
};

// OPÇÃO 2: Usar variáveis de ambiente (recomendado)
// Crie um arquivo `.env.local` na raiz do projeto com:
// REACT_APP_FIREBASE_API_KEY=seu_api_key
// REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
// etc.
// Depois descomente o código abaixo:
/*
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
*/

export default firebaseConfig;
