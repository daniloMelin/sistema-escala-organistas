const { test, expect } = require('@playwright/test');
const { resetE2EState } = require('./helpers/session');

test.describe('validacoes negativas de igreja', () => {
  test('bloqueia cadastro com nome invalido e nao persiste igreja na lista', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })
    ).toBeVisible();

    const textboxes = page.getByRole('textbox');
    await textboxes.nth(0).fill('AB');
    await textboxes.nth(1).fill('COD-01');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('Nome deve ter pelo menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('AB', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Código: COD-01')).toHaveCount(0);
  });
});
