export const REQUIRED_FIREBASE_ENV_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

export const getMissingFirebaseConfigKeys = (config = {}) =>
  REQUIRED_FIREBASE_ENV_KEYS.filter((key) => !String(config[key] || '').trim());

export const hasCompleteFirebaseConfig = (config = {}) =>
  getMissingFirebaseConfigKeys(config).length === 0;

export const getFirebaseConfigErrorMessage = (missingKeys = []) => {
  if (!missingKeys.length) return '';

  return `Configuração do Firebase incompleta. Ajuste as variáveis de ambiente: ${missingKeys.join(
    ', '
  )}.`;
};
