import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  name: 'runtime-playwright-ui',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  outputDir: './test-results',
  preserveOutput: 'always',
  snapshotDir: './screenshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'off',
    video: 'off'
  },

  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
    }
  ]
});