const { defineConfig, devices } = require('@playwright/test');
const { smokeSpecs } = require('./e2e/helpers/smokeSuite');

const PORT = process.env.E2E_PORT || 3001;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: './e2e',
  testMatch: smokeSpecs.map((specPath) => specPath.replace(/^e2e\//, '')),
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: `HOST=127.0.0.1 PORT=${PORT} BROWSER=none REACT_APP_E2E_MODE=true npm start`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
