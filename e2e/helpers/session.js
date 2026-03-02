async function loginAsE2EUser(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Entrar em modo E2E' }).click();
}

module.exports = {
  loginAsE2EUser,
};
