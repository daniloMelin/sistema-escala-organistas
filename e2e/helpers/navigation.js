const { expect } = require('@playwright/test');

async function gotoChurchManager(page) {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })
  ).toBeVisible();
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
