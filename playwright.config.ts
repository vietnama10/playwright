import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  workers: 1, // chỉ 1 worker cho luồng nghiệp vụ liên tiếp
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://staging-accounting.example.com',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
