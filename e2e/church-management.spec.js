const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, buildChurchesDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('cadastro e edicao de igreja', () => {
  test('cadastra nova igreja e exibe feedback de sucesso na lista', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await gotoChurchManager(page);

    const textboxes = page.getByRole('textbox');
    await textboxes.nth(0).fill('Congregacao Nova');
    await textboxes.nth(1).fill('CNV');
    await page.getByLabel('Modelo de culto:').selectOption('culto_unico_com_reserva');
    await page.getByLabel('Domingo (Culto)').check();
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText('Igreja criada!')).toBeVisible();
    await expect(page.getByText('Congregacao Nova')).toBeVisible();
    await expect(page.getByText('Código: CNV')).toBeVisible();
  });

  test('edita igreja existente e atualiza os dados exibidos', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-edit-1',
        churchName: 'Igreja Antiga',
        churchCode: 'OLD',
      })
    );

    await gotoChurchManager(page);

    await page.getByRole('button', { name: 'Editar' }).click();

    const textboxes = page.getByRole('textbox');
    await textboxes.nth(0).fill('Igreja Atualizada');
    await textboxes.nth(1).fill('NEW');
    await page.getByLabel('Modelo de culto:').selectOption('meia_hora_parte1_parte2');
    await page.getByRole('button', { name: 'Atualizar' }).click();

    await expect(page.getByText('Igreja atualizada!')).toBeVisible();
    await expect(page.getByText('Igreja Atualizada', { exact: true })).toBeVisible();
    await expect(page.getByText('Código: NEW')).toBeVisible();
  });

  test('exibe resumo operacional com estados diferentes e mantém a navegação da lista', async ({
    page,
  }) => {
    await resetE2EState(
      page,
      buildChurchesDatabase([
        {
          id: 'church-ready',
          name: 'Igreja Pronta',
          code: 'READY',
          cultoModel: 'meia_hora_e_culto',
          organists: [
            { name: 'Ana', availability: { sunday_culto: true } },
            { name: 'Beatriz', availability: { sunday_culto: true } },
          ],
          schedules: [
            {
              id: 'schedule-ready',
              generatedMonth: 4,
              generatedYear: 2026,
              organistCount: 2,
            },
          ],
        },
        {
          id: 'church-warning',
          name: 'Igreja Atencao',
          code: 'WARN',
          cultoModel: 'culto_unico_com_reserva',
          organists: [
            { name: 'Carla', availability: { sunday_culto: true } },
            { name: 'Daniela', availability: { sunday_culto: true } },
          ],
          schedules: [],
        },
        {
          id: 'church-incomplete',
          name: 'Igreja Incompleta',
          code: 'MISS',
          cultoModel: 'meia_hora_parte1_parte2',
          config: {},
          organists: [],
          schedules: [],
        },
      ])
    );

    await gotoChurchManager(page);

    const readyItem = page.locator('.church-list__item', { hasText: 'Igreja Pronta' });
    const warningItem = page.locator('.church-list__item', { hasText: 'Igreja Atencao' });
    const incompleteItem = page.locator('.church-list__item', { hasText: 'Igreja Incompleta' });

    await expect(readyItem).toContainText('Pronta');
    await expect(readyItem).toContainText('Base mínima atendida e histórico disponível.');
    await expect(readyItem).toContainText('Modelo: Meia hora e culto');
    await expect(readyItem).toContainText('Organistas: 2');
    await expect(readyItem).toContainText('Escalas: 1');

    await expect(warningItem).toContainText('Atenção');
    await expect(warningItem).toContainText('Ainda não possui escala salva.');
    await expect(warningItem).toContainText('Modelo: Culto único com reserva');
    await expect(warningItem).toContainText('Organistas: 2');

    await expect(incompleteItem).toContainText('Incompleta');
    await expect(incompleteItem).toContainText('Sem configuração útil para operar.');
    await expect(incompleteItem).toContainText('Modelo: Meia hora, parte 1 e parte 2');
    await expect(incompleteItem).toContainText('Organistas: 0');

    await openChurchDashboard(page, 'Igreja Pronta');
  });
});
