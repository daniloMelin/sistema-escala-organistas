const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('estados vazios', () => {
  test('exibe estado vazio quando nao ha igrejas cadastradas', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await gotoChurchManager(page);
    await expect(page.getByText('Nenhuma igreja cadastrada.')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Cadastrar Nova Igreja' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('exibe estado vazio de organistas e mantem navegacao disponivel no painel', async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-empty-organists-1',
        churchName: 'Igreja Sem Organistas',
        churchCode: 'ISO',
        organists: [],
      })
    );

    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Igreja Sem Organistas');
    await expect(page.getByText('Nenhuma organista cadastrada.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Voltar para Igrejas/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Gerar Escala/i })).toBeVisible();

    await page.getByRole('button', { name: /Voltar para Igrejas/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })
    ).toBeVisible();
  });
});
