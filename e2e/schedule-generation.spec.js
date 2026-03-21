const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager } = require('./helpers/navigation');

test.describe('geracao de escala', () => {
  test('gera escala com sucesso e exibe grade e historico', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-schedule-1',
        churchName: 'Igreja Escala',
        churchCode: 'ESC',
        organists: [
          {
            id: 'organist-s1',
            name: 'Ana',
            availability: { sunday_culto: true },
          },
          {
            id: 'organist-s2',
            name: 'Bia',
            availability: { sunday_culto: true },
          },
        ],
      })
    );

    await gotoChurchManager(page);
    await page.getByText('Igreja Escala').click();
    await page.getByRole('button', { name: /Gerar Escala/i }).click();

    await expect(
      page.getByRole('heading', { name: /Gerador de Escala:/i })
    ).toBeVisible();

    await page.getByLabel('Data Início:').fill('2026-03-01');
    await page.getByLabel('Data Fim:').fill('2026-03-01');
    await page.getByRole('button', { name: 'Gerar Nova Escala' }).click();

    await expect(page.getByText('Escala gerada e salva com sucesso!')).toBeVisible();
    await expect(page.getByText('Visualização da Escala')).toBeVisible();
    await expect(page.getByText('Domingo, 01/03/2026')).toBeVisible();
    await expect(page.getByText('Histórico de Escalas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Visualizar' })).toBeVisible();
  });
});
