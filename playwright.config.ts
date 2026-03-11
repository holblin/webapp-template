import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CI,
);

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html'], ['github']] : [['list'], ['html']],
  use: {
    baseURL: 'http://127.0.0.1:4080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev:e2e --workspace postgres-backup-backend',
      url: 'http://127.0.0.1:4000/graphql',
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'npm run e2e:frontend-server',
      url: 'http://127.0.0.1:4080',
      reuseExistingServer: !isCI,
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
