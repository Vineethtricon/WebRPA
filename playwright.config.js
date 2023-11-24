// @ts-check
const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './spec',
  timeout: 240 * 1000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1, //process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.triconinfotech.com/',
    trace: 'on-first-retry',
    headless : false
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});