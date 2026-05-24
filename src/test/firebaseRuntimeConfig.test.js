import {
  getFirebaseConfigErrorMessage,
  getMissingFirebaseConfigKeys,
  hasCompleteFirebaseConfig,
} from '../utils/firebaseRuntimeConfig';

describe('firebaseRuntimeConfig', () => {
  test('identifica chaves obrigatorias ausentes', () => {
    expect(
      getMissingFirebaseConfigKeys({
        apiKey: 'key',
        authDomain: '',
        projectId: 'project',
      })
    ).toEqual(['authDomain', 'storageBucket', 'messagingSenderId', 'appId']);
  });

  test('reconhece configuracao completa', () => {
    expect(
      hasCompleteFirebaseConfig({
        apiKey: 'key',
        authDomain: 'domain',
        projectId: 'project',
        storageBucket: 'bucket',
        messagingSenderId: 'sender',
        appId: 'app',
      })
    ).toBe(true);
  });

  test('gera mensagem objetiva para configuracao incompleta', () => {
    expect(getFirebaseConfigErrorMessage(['apiKey', 'projectId'])).toBe(
      'Configuração do Firebase incompleta. Ajuste as variáveis de ambiente: apiKey, projectId.'
    );
  });
});
