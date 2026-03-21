import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import logger from "./utils/logger";

const isE2EMode = process.env.REACT_APP_E2E_MODE === 'true';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const fallbackE2EConfig = {
  apiKey: 'e2e-api-key',
  authDomain: 'e2e.localhost',
  projectId: 'e2e-project',
  storageBucket: 'e2e-project.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:e2eapp',
};

const effectiveFirebaseConfig =
  isE2EMode && (!firebaseConfig.apiKey || !firebaseConfig.projectId)
    ? fallbackE2EConfig
    : firebaseConfig;

// Validação básica
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  if (isE2EMode) {
    logger.warn("Configuração do Firebase ausente no modo E2E. Usando configuração dummy para bootstrap local.");
  } else {
    logger.error("Configuração do Firebase incompleta. Verifique as variáveis de ambiente.");
  }
}

// Inicializa e exporta os serviços do Firebase
export const app = initializeApp(effectiveFirebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
