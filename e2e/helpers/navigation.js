const { expect } = require('@playwright/test');

async function gotoAuthScreen(page) {
  const managerHeading = page.getByRole('heading', { name: 'Gerenciamento de Igrejas' });
  const authHeading = page.getByRole('heading', { name: 'Sistema de Escala de Organistas' });
  const loginButton = page.getByRole('button', { name: 'Entrar em modo E2E' });
  const logoutButton = page.getByRole('button', { name: 'Sair' });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const isAuthVisible =
      (await authHeading.isVisible().catch(() => false)) &&
      (await loginButton.isVisible().catch(() => false));

    if (isAuthVisible) {
      return;
    }

    if (await managerHeading.isVisible().catch(() => false)) {
      if (await logoutButton.isVisible().catch(() => false)) {
        await logoutButton.click();
      }
      await expect(authHeading).toBeVisible({ timeout: 10_000 });
      await expect(loginButton).toBeVisible({ timeout: 10_000 });
      return;
    }

    await page.waitForTimeout(250);
  }

  await expect(authHeading).toBeVisible({ timeout: 10_000 });
  await expect(loginButton).toBeVisible({ timeout: 10_000 });
}

async function gotoChurchManager(page) {
  const managerHeading = page.getByRole('heading', { name: 'Gerenciamento de Igrejas' });
  const loginButton = page.getByRole('button', { name: 'Entrar em modo E2E' });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await managerHeading.isVisible().catch(() => false)) {
      return;
    }

    const authScreenVisible = await loginButton.isVisible().catch(() => false);

    if (authScreenVisible) {
      await loginButton.click();
      await expect(managerHeading).toBeVisible({ timeout: 10_000 });
      return;
    }

    await page.waitForTimeout(250);
  }

  await expect(managerHeading).toBeVisible({ timeout: 10_000 });
}

async function openChurchDashboard(page, churchName) {
  await page.getByText(churchName).click();
  await expect(
    page.getByRole('heading', { name: 'Painel de Gerenciamento' })
  ).toBeVisible();
}

module.exports = {
  gotoAuthScreen,
  gotoChurchManager,
  openChurchDashboard,
};
