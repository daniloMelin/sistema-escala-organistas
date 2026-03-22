const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('falhas operacionais controladas', () => {
  const loadErrorAlert = (page) =>
    page.locator('.alert--danger').getByText('Falha ao carregar as igrejas.');

  test('exibe fallback de erro quando falha o carregamento de igrejas', async ({ page }) => {
    await resetE2EState(
      page,
      { users: {} },
      {
        failures: {
          getChurchesLocal: true,
        },
      }
    );

    await gotoChurchManager(page);
    await expect(loadErrorAlert(page)).toBeVisible();
  });

  test('permite recuperar carregamento de igrejas apos falha transitória', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-retry-1',
        churchName: 'Igreja Recuperada',
        churchCode: 'REC',
      }),
      {
        failures: {
          getChurchesLocal: 2,
        },
      }
    );

    await gotoChurchManager(page);
    await expect(loadErrorAlert(page)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();

    await page.getByRole('button', { name: 'Tentar novamente' }).click();

    await expect(loadErrorAlert(page)).toHaveCount(0);
    await expect(page.getByText('Igreja Recuperada')).toBeVisible();
    await expect(page.getByText('Código: REC')).toBeVisible();
  });

  test('exibe erro operacional ao tentar salvar organista com falha simulada', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-failure-1',
        churchName: 'Igreja Falha Operacional',
        churchCode: 'FAIL',
      }),
      {
        failures: {
          addOrganistLocal: true,
        },
      }
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Falha Operacional');

    await page.getByRole('textbox', { name: 'Nome da Organista:' }).fill('Marina');
    await page.getByLabel('Domingo (Culto)').check();
    await page.getByRole('button', { name: 'Cadastrar Organista' }).click();

    await expect(page.getByText('Erro ao salvar organista.')).toBeVisible();
    await expect(page.getByText('Marina', { exact: true })).toHaveCount(0);
  });

  test('permite salvar organista apos nova tentativa quando a falha eh transitória', async ({
    page,
  }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-failure-2',
        churchName: 'Igreja Retry Organista',
        churchCode: 'RTO',
      }),
      {
        failures: {
          addOrganistLocal: 'once',
        },
      }
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Retry Organista');

    await page.getByRole('textbox', { name: 'Nome da Organista:' }).fill('Marina');
    await page.getByLabel('Domingo (Culto)').check();
    await page.getByRole('button', { name: 'Cadastrar Organista' }).click();

    await expect(page.getByText('Erro ao salvar organista.')).toBeVisible();
    await expect(page.getByText('Marina', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Cadastrar Organista' }).click();

    await expect(page.getByText('Erro ao salvar organista.')).toHaveCount(0);
    await expect(page.getByText('Organista cadastrada com sucesso.')).toBeVisible();
    await expect(page.getByText('Marina', { exact: true })).toBeVisible();
    await expect(page.getByText(/Dom\(Culto\)/)).toBeVisible();
  });
});
