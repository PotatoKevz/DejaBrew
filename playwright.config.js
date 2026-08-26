import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  webServer: {
    command: 'python -m http.server 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: { baseURL: 'http://localhost:3000', headless: true },
});
