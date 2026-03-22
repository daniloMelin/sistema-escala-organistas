const { test, expect } = require('@playwright/test');
const { buildChurchesDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('exclusao de igreja', () => {
  test('confirma a exclusao, remove a igreja da lista e preserva a navegacao com as demais', async ({
    page,
  }) => {
    await resetE2EState(
      page,
      buildChurchesDatabase([
        {
          id: 'church-delete-1',
          name: 'Jardim da Granja',
          code: 'JDG',
          organists: [
            {
              id: 'organist-1',
              name: 'Marcia',
              availability: { sunday_culto: true },
            },
          ],
          schedules: [{ id: 'schedule-1', assignments: [] }],
        },
        {
          id: 'church-delete-2',
          name: 'Vila Operaria',
          code: 'VOP',
          config: {
            sunday: [{ id: 'Culto', label: 'Culto' }],
          },
        },
      ])
    );

    await gotoChurchManager(page);

    const churchToDelete = page.locator('li').filter({ hasText: 'Jardim da Granja' });
    await expect(churchToDelete).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Vila Operaria' })).toBeVisible();

    await churchToDelete.getByRole('button', { name: 'Excluir' }).click();

    await expect(page.getByRole('heading', { name: 'Excluir igreja' })).toBeVisible();
    await expect(
      page.getByText('Tem certeza que deseja excluir a igreja "Jardim da Granja"?')
    ).toBeVisible();
    await expect(
      page.getByText(
        'ATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.'
      )
    ).toBeVisible();

    await page.getByRole('button', { name: 'Excluir' }).last().click();

    await expect(page.getByText('Igreja e dados associados excluídos com sucesso.')).toBeVisible();
    await expect(page.getByText('Jardim da Granja')).toHaveCount(0);
    await expect(page.getByText('Vila Operaria')).toBeVisible();

    await openChurchDashboard(page, 'Vila Operaria');
    await expect(page.getByText('Vila Operaria')).toBeVisible();
  });
});
