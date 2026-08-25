import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NANOCHAT_URL || 'http://localhost:8080';

test.describe('nanochat demo recording', () => {
  test('records chat interaction with streaming response', async ({ page }) => {
    // 1. Open chat UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'scripts/out/nano-01-chat-ui.png', fullPage: false });

    // 2. Type a prompt
    const input = page.locator('textarea, input[type="text"], [contenteditable]').first();
    await input.waitFor({ timeout: 10000 });
    await input.click();
    await input.fill('Explain the difference between pre-training and fine-tuning in LLMs.');
    await page.screenshot({ path: 'scripts/out/nano-02-prompt.png', fullPage: false });

    // 3. Submit and wait for streaming response
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000); // let streaming begin
    await page.screenshot({ path: 'scripts/out/nano-03-streaming.png', fullPage: false });

    // 4. Wait for response to complete
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'scripts/out/nano-04-complete.png', fullPage: false });
  });

  test('records training metrics dashboard', async ({ page }) => {
    // If nanochat has a metrics/eval page, record it
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for any metrics or stats displayed
    const metricsVisible = await page.locator('text=loss|tokens|params|CORE').first().isVisible().catch(() => false);
    if (metricsVisible) {
      await page.screenshot({ path: 'scripts/out/nano-05-metrics.png', fullPage: false });
    }
  });
});
