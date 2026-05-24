jest.mock('../firebaseConfig', () => ({
  db: null,
  firebaseConfigError:
    'Configuração do Firebase incompleta. Ajuste as variáveis de ambiente: apiKey, projectId.',
  isFirebaseReady: false,
}));

jest.mock('../utils/e2eMode', () => ({
  isE2EMode: false,
}));

describe('firebaseService readiness', () => {
  test('falha com mensagem explicita quando a configuracao do Firebase esta incompleta', async () => {
    const { getChurches } = await import('../services/firebaseService');

    await expect(getChurches('user-1')).rejects.toThrow(
      'Configuração do Firebase incompleta. Ajuste as variáveis de ambiente: apiKey, projectId.'
    );
  });
});
