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

    await expect(page.getByRole('heading', { name: /Gerador de Escala:/i })).toBeVisible();

    await page.getByLabel('Data Início:').fill('2026-03-01');
    await page.getByLabel('Data Fim:').fill('2026-03-01');
    await page.getByRole('button', { name: 'Gerar Nova Escala' }).click();

    await expect(
      page.getByText('Escala de 01/03/2026 até 01/03/2026 gerada e salva com sucesso.')
    ).toBeVisible();
    await expect(page.getByText('Visualização da Escala')).toBeVisible();
    await expect(page.getByText('Domingo, 01/03/2026')).toBeVisible();
    await expect(page.getByText('Histórico de Escalas')).toBeVisible();
    await expect(page.getByText('Mais recente')).toBeVisible();
    await expect(page.getByText('1 dia na escala • 2 organistas consideradas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Visualizar' })).toBeVisible();
  });

  test('visualiza uma escala salva do historico com feedback contextual', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-schedule-history-1',
        churchName: 'Igreja Historico',
        churchCode: 'HIS',
        organists: [
          {
            id: 'organist-h1',
            name: 'Ana',
            availability: { sunday_culto: true },
          },
          {
            id: 'organist-h2',
            name: 'Bia',
            availability: { sunday_culto: true },
          },
        ],
        schedules: [
          {
            id: 'schedule-latest',
            generatedAt: '2026-03-03T10:00:00.000Z',
            period: { start: '2026-03-02', end: '2026-03-02' },
            organistCount: 2,
            data: [
              {
                date: '02/03/2026',
                dayName: 'Segunda-feira',
                assignments: { Culto: 'Ana' },
              },
            ],
          },
          {
            id: 'schedule-older',
            generatedAt: '2026-02-02T10:00:00.000Z',
            period: { start: '2026-02-01', end: '2026-02-02' },
            organistCount: 2,
            data: [
              {
                date: '01/02/2026',
                dayName: 'Domingo',
                assignments: { Culto: 'Bia' },
              },
              {
                date: '02/02/2026',
                dayName: 'Segunda-feira',
                assignments: { Culto: 'Ana' },
              },
            ],
          },
        ],
      })
    );

    await gotoChurchManager(page);
    await page.getByText('Igreja Historico').click();
    await page.getByRole('button', { name: /Gerar Escala/i }).click();

    await expect(page.getByText('Histórico de Escalas')).toBeVisible();
    await expect(page.getByText('Mais recente')).toBeVisible();
    await expect(page.getByText('2 dias na escala • 2 organistas consideradas')).toBeVisible();
    await expect(page.getByText('03/03/2026, 07:00:00')).toBeVisible();

    const searchBox = page.getByRole('searchbox', { name: 'Buscar no histórico:' });
    await searchBox.fill('2 dias na escala');

    await expect(page.getByText('Exibindo 1 de 2 escalas')).toBeVisible();
    await expect(page.getByText('01/02/2026 até 02/02/2026')).toBeVisible();
    await expect(page.getByText('Mais recente')).toBeVisible();

    const olderScheduleItem = page
      .locator('.history-item')
      .filter({ hasText: '01/02/2026 até 02/02/2026' });

    await olderScheduleItem.getByRole('button', { name: 'Visualizar' }).click();

    await expect(
      page.getByText('Visualizando escala salva de 01/02/2026 até 02/02/2026.')
    ).toBeVisible();
    await expect(page.getByText('Visualização da Escala')).toBeVisible();
    await expect(page.getByText('Domingo, 01/02/2026')).toBeVisible();

    await searchBox.fill('sem resultado');
    await expect(page.getByText('Exibindo 0 de 2 escalas')).toBeVisible();
    await expect(
      page.getByText('Nenhuma escala encontrada para a busca "sem resultado".')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Limpar busca' }).click();
    await expect(
      page.locator('.history-item').filter({ hasText: '02/03/2026 até 02/03/2026' })
    ).toBeVisible();
    await expect(
      page.locator('.history-item').filter({ hasText: '01/02/2026 até 02/02/2026' })
    ).toBeVisible();
  });
});
