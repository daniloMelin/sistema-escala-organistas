const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');
const { gotoChurchManager, openChurchDashboard } = require('./helpers/navigation');

test.describe('fluxo inicial de autenticacao e navegacao', () => {
  test.beforeEach(async ({ page }) => {
    await resetE2EState(
      page,
      buildChurchDatabase({
        churchId: 'church-nav-1',
        churchName: 'Navegacao Central',
        churchCode: 'NAV',
      })
    );
  });

  test('carrega a area principal com sessao E2E existente', async ({ page }) => {
    await gotoChurchManager(page);

    await expect(page.getByText('Olá, e2e@example.com')).toBeVisible();
    await expect(page.getByText('Navegacao Central')).toBeVisible();
  });

  test('navega da lista de igrejas para o painel e para o gerador de escala', async ({ page }) => {
    await gotoChurchManager(page);
    await openChurchDashboard(page, 'Navegacao Central');
    await expect(page.getByText('Navegacao Central')).toBeVisible();

    await page.getByRole('button', { name: /Gerar Escala/i }).click();
    await expect(page.getByRole('heading', { name: /Gerador de Escala:/i })).toBeVisible();
    await expect(page.getByText('Navegacao Central')).toBeVisible();

    await page.getByRole('button', { name: /Voltar para Painel/i }).click();
    await expect(page.getByRole('heading', { name: 'Painel de Gerenciamento' })).toBeVisible();

    await page.getByRole('button', { name: /Voltar para Igrejas/i }).click();
    await expect(page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })).toBeVisible();
  });

  test('encerra a sessao e retorna para a tela de autenticacao', async ({ page }) => {
    await gotoChurchManager(page);

    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await page.getByRole('button', { name: 'Sair' }).click();

    await expect(
      page.getByRole('heading', { name: 'Sistema de Escala de Organistas' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar em modo E2E' })).toBeVisible();
  });
});
