const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager } = require('./helpers/navigation');

test.describe('validacoes negativas de organista', () => {
  test('bloqueia cadastro com nome invalido e nao persiste organista no painel', async ({
    page,
  }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-validation-organist-1',
        churchName: 'Igreja Validacao Organista',
        churchCode: 'IVO',
      })
    );

    await gotoChurchManager(page);
    await page.getByText('Igreja Validacao Organista').click();

    await expect(page.getByRole('heading', { name: 'Painel de Gerenciamento' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Nome da Organista:' }).fill('A');
    await page.getByRole('button', { name: 'Cadastrar Organista' }).click();

    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeVisible();
    await expect(page.getByText('A', { exact: true })).toHaveCount(0);
  });
});
