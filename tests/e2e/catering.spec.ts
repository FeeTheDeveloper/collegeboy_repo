import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('direct catering path, inquiry jump, and disconnected state', async ({ page, request }) => {
  await page.goto('/catering');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bring College Boy to Your Event.');
  await page.getByRole('link', { name: 'Request catering' }).click();
  await expect(page).toHaveURL(/\/catering#inquiry$/);
  await expect(page.getByRole('heading', { name: 'Request catering.' })).toBeVisible();
  for (const name of ['Name', 'Phone', 'Email', 'Event location', 'Event date', 'Estimated guest count', 'Event start time', 'Event end time', 'Additional event details']) {
    await expect(page.getByRole('form').getByLabel(new RegExp(`^${name}`))).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Send catering request' })).toBeDisabled();
  await expect(page.getByText('Online form not yet connected.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'catering@collegeboysteaks.com' })).toHaveAttribute('href', /^mailto:catering@collegeboysteaks\.com/);
  const response = await request.post('/api/catering', { data: {} });
  expect(response.status()).toBe(503);
});

for (const width of [390, 1440]) {
  test(`catering layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catering');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await expect(page.locator('.catering-hero')).toHaveCSS('background-image', /college-boy-opening-poster\.jpg/);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? '')).map(v => v.id)).toEqual([]);
  });
}
