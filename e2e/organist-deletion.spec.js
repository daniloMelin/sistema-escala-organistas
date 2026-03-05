const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('exclusao de organista', () => {
  test('confirma a exclusao, remove a organista da lista e mantem o painel consistente', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-delete-organist-1',
        churchName: 'Igreja Exclusao Organista',
        churchCode: 'EXO',
        organists: [
          {
            id: 'organist-delete-1',
            name: 'Ana',
            availability: { sunday_culto: true },
          },
          {
            id: 'organist-keep-1',
            name: 'Beatriz',
            availability: { tuesday: true },
          },
        ],
      })
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Exclusao Organista');

    const organistToDelete = page.locator('li').filter({ hasText: 'Ana' });
    await expect(organistToDelete).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Beatriz' })).toBeVisible();

    await organistToDelete.getByRole('button', { name: 'Excluir' }).click();

    await expect(page.getByRole('heading', { name: 'Excluir organista' })).toBeVisible();
    await expect(
      page.getByText('Tem certeza que deseja excluir a organista Ana?')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Excluir' }).last().click();

    await expect(page.getByText('Organista excluída com sucesso.')).toBeVisible();
    await expect(page.getByText('Ana')).toHaveCount(0);
    await expect(page.getByText('Beatriz', { exact: true })).toBeVisible();
  });
});
