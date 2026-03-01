const { test, expect } = require('@playwright/test');

test('exibe a tela inicial de autenticacao', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Sistema de Escala de Organistas' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Entrar com o Google' })
  ).toBeVisible();
});
