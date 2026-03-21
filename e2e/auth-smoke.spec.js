const { test, expect } = require('@playwright/test');
const { gotoAuthScreen } = require('./helpers/navigation');

test('exibe a tela inicial de autenticacao', async ({ page }) => {
  await gotoAuthScreen(page);

  await expect(
    page.getByRole('heading', { name: 'Sistema de Escala de Organistas' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Entrar com o Google' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Entrar em modo E2E' })
  ).toBeVisible();
});
