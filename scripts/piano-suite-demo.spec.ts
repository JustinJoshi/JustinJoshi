import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PIANO_SUITE_URL || 'http://localhost:3000';

test.describe('Piano Suite demo recording', () => {
  test('records landing → chord drill → tracking', async ({ page }) => {
    // 1. Landing page — hero + value prop
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // let animations settle
    await page.screenshot({ path: 'scripts/out/piano-01-landing.png', fullPage: false });

    // 2. Chord Drill — core practice tool
    await page.goto(`${BASE_URL}/tools/chord-drill`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/out/piano-02-chord-drill.png', fullPage: false });

    // 3. Arpeggios — secondary practice tool
    await page.goto(`${BASE_URL}/tools/arpeggios`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/out/piano-03-arpeggios.png', fullPage: false });

    // 4. Progress tracking — shows improvement over time
    await page.goto(`${BASE_URL}/tools/tracking`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/out/piano-04-tracking.png', fullPage: false });

    // 5. Articles — educational content
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/out/piano-05-articles.png', fullPage: false });
  });
});
