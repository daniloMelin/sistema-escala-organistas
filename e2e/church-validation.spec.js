const { test, expect } = require('@playwright/test');
const { resetE2EState } = require('./helpers/session');
const { gotoChurchManager } = require('./helpers/navigation');

test.describe('validacoes negativas de igreja', () => {
  test('bloqueia cadastro com nome invalido e nao persiste igreja na lista', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await gotoChurchManager(page);

    await page.getByRole('textbox', { name: 'Nome da Congregação:' }).fill('AB');
    await page.getByRole('button', { name: 'Cadastrar Igreja' }).click();

    await expect(page.getByText('Nome deve ter pelo menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('AB', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Código: COD-01')).toHaveCount(0);
  });
});
