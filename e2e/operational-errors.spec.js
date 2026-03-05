const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('falhas operacionais controladas', () => {
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
    await expect(page.getByText('Falha ao carregar as igrejas.')).toBeVisible();
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
});
