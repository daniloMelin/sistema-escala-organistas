const { test, expect } = require('@playwright/test');
const { loginAsE2EUser } = require('./helpers/session');

test('entra no sistema em modo E2E e exibe a tela de igrejas', async ({ page }) => {
  await loginAsE2EUser(page);

  await expect(page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
});
