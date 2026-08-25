import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 60_000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'off',
    video: 'on', // records WebM alongside screenshots
  },
  outputDir: './out',
  reporter: [['list']],
});
