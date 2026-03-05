const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('cadastro e edicao de organista', () => {
  test('cadastra nova organista e exibe feedback no painel da igreja', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-organist-1',
        churchName: 'Igreja Organistas',
        churchCode: 'ORG',
      })
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Organistas');

    await page.getByRole('textbox', { name: 'Nome da Organista:' }).fill('Maria');
    await page.getByLabel('Domingo (Culto)').check();
    await page.getByRole('button', { name: 'Cadastrar Organista' }).click();

    await expect(page.getByText('Organista cadastrada com sucesso.')).toBeVisible();
    await expect(page.getByText('Maria', { exact: true })).toBeVisible();
    await expect(page.getByText(/Dom\(Culto\)/)).toBeVisible();
  });

  test('edita organista existente e atualiza os dados exibidos', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-organist-2',
        churchName: 'Igreja Edicao Organista',
        churchCode: 'EDO',
        organists: [
          {
            id: 'organist-edit-1',
            name: 'Ana',
            availability: { sunday_culto: true },
          },
        ],
      })
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Edicao Organista');

    await page.getByRole('button', { name: 'Editar' }).click();
    await page.getByRole('textbox', { name: 'Nome da Organista:' }).fill('Ana Paula');
    await page.getByLabel('Domingo (Culto)').uncheck();
    await page.getByRole('button', { name: 'Atualizar Organista' }).click();

    await expect(page.getByText('Organista atualizada com sucesso.')).toBeVisible();
    await expect(page.getByText('Ana Paula', { exact: true })).toBeVisible();
    await expect(page.getByText('Nenhum dia')).toBeVisible();
  });
});
