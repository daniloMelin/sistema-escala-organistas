const { test, expect } = require('@playwright/test');
const { resetE2EState } = require('./helpers/session');

test.describe('exclusao de igreja', () => {
  test('confirma a exclusao, remove a igreja da lista e preserva a navegacao com as demais', async ({ page }) => {
    await resetE2EState(page, {
      users: {
        'e2e-user': {
          profile: { email: 'e2e@example.com' },
          churches: {
            'church-delete-1': {
              id: 'church-delete-1',
              name: 'Jardim da Granja',
              code: 'JDG',
              config: {
                sunday: [
                  { id: 'MeiaHoraCulto', label: 'Meia Hora' },
                  { id: 'Culto', label: 'Culto' },
                ],
              },
              createdAt: new Date('2026-03-03T00:00:00.000Z').toISOString(),
              organists: {
                'organist-1': {
                  id: 'organist-1',
                  name: 'Marcia',
                  availability: { sunday_culto: true },
                  createdAt: new Date('2026-03-03T00:00:00.000Z').toISOString(),
                },
              },
              schedules: {
                'schedule-1': {
                  id: 'schedule-1',
                  generatedAt: new Date('2026-03-03T00:00:00.000Z').toISOString(),
                  generatedMonth: 3,
                  generatedYear: 2026,
                  assignments: [],
                },
              },
            },
            'church-delete-2': {
              id: 'church-delete-2',
              name: 'Vila Operaria',
              code: 'VOP',
              config: {
                sunday: [{ id: 'Culto', label: 'Culto' }],
              },
              createdAt: new Date('2026-03-03T00:00:00.000Z').toISOString(),
              organists: {},
              schedules: {},
            },
          },
        },
      },
    });

    await page.goto('/');

    const churchToDelete = page.locator('li').filter({ hasText: 'Jardim da Granja' });
    await expect(churchToDelete).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Vila Operaria' })).toBeVisible();

    await churchToDelete.getByRole('button', { name: 'Excluir' }).click();

    await expect(page.getByRole('heading', { name: 'Excluir igreja' })).toBeVisible();
    await expect(
      page.getByText('Tem certeza que deseja excluir a igreja "Jardim da Granja"?')
    ).toBeVisible();
    await expect(
      page.getByText('ATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Excluir' }).last().click();

    await expect(page.getByText('Igreja e dados associados excluídos com sucesso.')).toBeVisible();
    await expect(page.getByText('Jardim da Granja')).toHaveCount(0);
    await expect(page.getByText('Vila Operaria')).toBeVisible();

    await page.getByText('Vila Operaria').click();
    await expect(
      page.getByRole('heading', { name: 'Painel de Gerenciamento' })
    ).toBeVisible();
    await expect(page.getByText('Vila Operaria')).toBeVisible();
  });
});
