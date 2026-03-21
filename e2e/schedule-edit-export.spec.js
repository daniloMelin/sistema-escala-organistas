const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager } = require('./helpers/navigation');

test.describe('edicao manual e exportacao da escala', () => {
  test('edita a escala manualmente, salva alteracoes e exporta PDF', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-edit-schedule-1',
        churchName: 'Igreja Edicao Escala',
        churchCode: 'EES',
        organists: [
          {
            id: 'organist-e1',
            name: 'Ana',
            availability: { sunday_culto: true },
          },
          {
            id: 'organist-e2',
            name: 'Bia',
            availability: { sunday_culto: true },
          },
        ],
      })
    );

    await gotoChurchManager(page);
    await page.getByText('Igreja Edicao Escala').click();
    await page.getByRole('button', { name: /Gerar Escala/i }).click();

    await page.getByLabel('Data Início:').fill('2026-03-01');
    await page.getByLabel('Data Fim:').fill('2026-03-01');
    await page.getByRole('button', { name: 'Gerar Nova Escala' }).click();

    await expect(page.getByText('Escala gerada e salva com sucesso!')).toBeVisible();
    await expect(page.getByText('Visualização da Escala')).toBeVisible();

    const beforeNames = await page.locator('.schedule-card__name').allTextContents();
    const replacementName = beforeNames.includes('Ana') ? 'Bia' : 'Ana';

    await page.getByRole('button', { name: /Editar Manualmente/i }).click();
    await expect(page.getByText('✏️ Editando Escala')).toBeVisible();

    await page.locator('.schedule-card__select').first().selectOption(replacementName);
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    await expect(page.getByText('Alterações salvas com sucesso!')).toBeVisible();
    await expect(page.getByText('Visualização da Escala')).toBeVisible();
    await expect(page.locator('.schedule-card__name').filter({ hasText: replacementName }).first()).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Baixar PDF/i }).click();
    const download = await downloadPromise;

    await expect(download.suggestedFilename()).toMatch(/igreja_edicao_escala_2026-03-01\.pdf$/);
  });
});
