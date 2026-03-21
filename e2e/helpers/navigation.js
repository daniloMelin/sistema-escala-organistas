const { expect } = require('@playwright/test');

async function gotoChurchManager(page) {
  await page.goto('/');

  await page.waitForFunction(() => {
    const content = document.body?.innerText || '';
    return (
      content.includes('Gerenciamento de Igrejas') ||
      content.includes('Sistema de Escala de Organistas')
    );
  }, { timeout: 15_000 });

  const loginButton = page.getByRole('button', { name: 'Entrar em modo E2E' });
  if (await loginButton.isVisible().catch(() => false)) {
    await loginButton.click();
  }

  await expect(
    page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })
  ).toBeVisible({ timeout: 10_000 });
}

async function openChurchDashboard(page, churchName) {
  await page.getByText(churchName).click();
  await expect(
    page.getByRole('heading', { name: 'Painel de Gerenciamento' })
  ).toBeVisible();
}

module.exports = {
  gotoChurchManager,
  openChurchDashboard,
};
