const { test, expect } = require('@playwright/test');
const { buildChurchDatabase, resetE2EState } = require('./helpers/session');

test.describe('cadastro e edicao de igreja', () => {
  test('cadastra nova igreja e exibe feedback de sucesso na lista', async ({ page }) => {
    await resetE2EState(page, { users: {} });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Gerenciamento de Igrejas' })
    ).toBeVisible();

    const textboxes = page.getByRole('textbox');
    await textboxes.nth(0).fill('Congregacao Nova');
    await textboxes.nth(1).fill('CNV');
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

    await page.goto('/');

    await page.getByRole('button', { name: 'Editar' }).click();

    const textboxes = page.getByRole('textbox');
    await textboxes.nth(0).fill('Igreja Atualizada');
    await textboxes.nth(1).fill('NEW');
    await page.getByRole('button', { name: 'Atualizar' }).click();

    await expect(page.getByText('Igreja atualizada!')).toBeVisible();
    await expect(page.getByText('Igreja Atualizada', { exact: true })).toBeVisible();
    await expect(page.getByText('Código: NEW')).toBeVisible();
  });
});
