import { defineConfig } from '@playwright/test'
export default defineConfig({
  testMatch: '**/*.spec.js',
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4171', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4171',
    reuseExistingServer: !process.env.CI,
  },
})
