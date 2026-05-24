import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import logger from './utils/logger';
import { isE2EMode } from './utils/e2eMode';
import {
  getFirebaseConfigErrorMessage,
  getMissingFirebaseConfigKeys,
  hasCompleteFirebaseConfig,
} from './utils/firebaseRuntimeConfig';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const fallbackE2EConfig = {
  apiKey: 'e2e-api-key',
  authDomain: 'e2e.localhost',
  projectId: 'e2e-project',
  storageBucket: 'e2e-project.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:e2eapp',
};

const missingFirebaseConfigKeys = getMissingFirebaseConfigKeys(firebaseConfig);
const hasRequiredFirebaseConfig = hasCompleteFirebaseConfig(firebaseConfig);
const shouldUseE2EFallback = isE2EMode && !hasRequiredFirebaseConfig;
const effectiveFirebaseConfig = shouldUseE2EFallback ? fallbackE2EConfig : firebaseConfig;
export const isFirebaseReady = hasRequiredFirebaseConfig || shouldUseE2EFallback;
export const firebaseConfigError = hasRequiredFirebaseConfig
  ? ''
  : getFirebaseConfigErrorMessage(missingFirebaseConfigKeys);

// Validação básica
if (!hasRequiredFirebaseConfig) {
  if (shouldUseE2EFallback) {
    logger.warn(
      'Configuração do Firebase ausente no modo E2E. Usando configuração dummy para bootstrap local.'
    );
  } else {
    logger.error(firebaseConfigError);
  }
}

let app = null;
let db = null;
let auth = null;

if (isFirebaseReady) {
  app = initializeApp(effectiveFirebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
