const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, buildChurchesDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('cadastro e edicao de igreja', () => {
  test('cadastra nova igreja e exibe feedback de sucesso na lista', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await gotoChurchManager(page);

    await page.getByRole('textbox', { name: 'Nome da Congregação:' }).fill('Congregacao Nova');
    await page.getByLabel('Modelo de culto:').selectOption('culto_unico_com_reserva');
    await page.getByLabel('Domingo (Culto)').check();
    await page.getByLabel('Semana do mês:').selectOption('1');
    await page.getByLabel('Dia da semana:').selectOption('thursday');
    await page.getByLabel('Horário:').selectOption('19:30');
    await page.getByLabel('Observação (opcional):').fill('Chegar 15 minutos antes.');
    await page.getByRole('button', { name: 'Cadastrar Igreja' }).click();

    await expect(page.getByText('Igreja criada!')).toBeVisible();
    await expect(page.getByText('Congregacao Nova')).toBeVisible();
    await expect(page.getByText(/Código:/)).toHaveCount(0);
    await expect(page.getByText('Ensaio local: 1 quinta-feira do mês às 19:30')).toBeVisible();
  });

  test('edita igreja existente e atualiza os dados exibidos', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-edit-1',
        churchName: 'Igreja Antiga',
        churchCode: 'OLD',
        rehearsal: {
          weekOfMonth: 1,
          weekday: 'thursday',
          time: '19:30',
          notes: '',
        },
      })
    );

    await gotoChurchManager(page);

    await page.getByRole('button', { name: 'Editar' }).click();

    await page.getByRole('textbox', { name: 'Nome da Congregação:' }).fill('Igreja Atualizada');
    await page.getByLabel('Modelo de culto:').selectOption('meia_hora_parte1_parte2');
    await page.getByLabel('Semana do mês:').selectOption('2');
    await page.getByLabel('Dia da semana:').selectOption('friday');
    await page.getByLabel('Horário:').selectOption('20:00');
    await page.getByLabel('Observação (opcional):').fill('Ensaio mensal revisado.');
    await page.getByRole('button', { name: 'Atualizar' }).click();

    await expect(page.getByText('Igreja atualizada!')).toBeVisible();
    await expect(page.getByText('Igreja Atualizada', { exact: true })).toBeVisible();
    await expect(page.getByText(/Código:/)).toHaveCount(0);
    await expect(page.getByText('Ensaio local: 2 sexta-feira do mês às 20:00')).toBeVisible();
  });

  test('exibe ensaio local na lista e no painel da igreja', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-rehearsal-1',
        churchName: 'Jardim Satélite',
        churchCode: 'SAT',
        rehearsal: {
          weekOfMonth: 1,
          weekday: 'friday',
          time: '19:30',
          notes: 'Chegar 15 minutos antes.',
        },
      })
    );

    await gotoChurchManager(page);

    await expect(page.getByText('Ensaio local: 1 sexta-feira do mês às 19:30')).toBeVisible();

    await openChurchDashboard(page, 'Jardim Satélite');

    await expect(page.getByText('Ensaio Local')).toBeVisible();
    await expect(page.getByText('1 sexta-feira do mês às 19:30')).toBeVisible();
    await expect(page.getByText('Chegar 15 minutos antes.')).toBeVisible();
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
    const orderedNames = page.locator('.church-list__name');

    await expect(
      page.getByText('A lista prioriza as igrejas que precisam de atenção.')
    ).toBeVisible();
    await expect(orderedNames.nth(0)).toHaveText('Igreja Incompleta');
    await expect(orderedNames.nth(1)).toHaveText('Igreja Atencao');
    await expect(orderedNames.nth(2)).toHaveText('Igreja Pronta');

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
