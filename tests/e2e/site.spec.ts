import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** External destinations the site is allowed to link to. Delivery hosts are added only when verified. */
const allowedExternal = [/^https:\/\/www\.instagram\.com\/collegeboycheesesteaks\/$/, /^https:\/\/www\.google\.com\/maps\/search\//];

test.beforeEach(async ({ page }) => {
  // Skip the first-visit film and mailing-list card so they do not cover the page under test.
  await page.addInitScript(() => {
    try { sessionStorage.setItem('collegeboy-cinematic-opening-v3', 'seen'); localStorage.setItem('collegeboy-mailing-list-invite-v1', 'seen'); } catch { /* optional */ }
  });
});

async function links(page: Page) {
  return page.$$eval('a[href]', anchors => anchors.map(a => ({ href: a.getAttribute('href')!, abs: (a as HTMLAnchorElement).href })));
}

test('public routes respond and legacy routes redirect', async ({ request }) => {
  for (const path of ['/', '/film', '/opening', '/subscribe']) expect((await request.get(path)).status(), path).toBe(200);
  expect((await request.get('/projects-2', { maxRedirects: 0 })).headers().location).toBe('/#menu');
  expect((await request.get('/contact-8', { maxRedirects: 0 })).headers().location).toBe('/#catering');
});

test('dashboard and account stay unavailable without authentication configured', async ({ request }) => {
  for (const path of ['/dashboard', '/dashboard/college-boy', '/account']) expect((await request.get(path)).status(), path).toBe(404);
});

for (const path of ['/', '/film']) {
  test(`no broken or unapproved links on ${path}`, async ({ page, request }) => {
    await page.goto(path);
    for (const { href, abs } of await links(page)) {
      if (href.startsWith('mailto:')) { expect(href).toMatch(/^mailto:catering@collegeboysteaks\.com(\?|$)/); continue; }
      expect(href, 'no phone links').not.toMatch(/^tel:/);
      const url = new URL(abs);
      if (url.origin === 'http://localhost:3100') {
        expect((await request.get(url.pathname)).status(), href).toBeLessThan(400);
        if (url.hash) {
          if (url.pathname === new URL(page.url()).pathname) await expect(page.locator(url.hash), href).toHaveCount(1);
          else { const other = await page.context().newPage(); await other.goto(url.pathname); await expect(other.locator(url.hash), href).toHaveCount(1); await other.close(); }
        }
      } else {
        expect(allowedExternal.some(rule => rule.test(abs)), `unapproved external link ${abs}`).toBe(true);
      }
    }
  });
}

test('every image loads and has alt text', async ({ page, request }) => {
  await page.goto('/');
  const images = await page.$$eval('img', nodes => nodes.map(img => ({ src: (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src, alt: img.getAttribute('alt') })));
  expect(images.length).toBeGreaterThan(5);
  for (const { src, alt } of images) {
    expect(alt, `${src} needs an alt attribute`).not.toBeNull();
    const response = await request.get(src);
    expect(response.status(), src).toBe(200);
    expect(response.headers()['content-type'], src).toMatch(/^image\//);
  }
});

test('schedule shows "not confirmed" with no stale stop', async ({ page }) => {
  await page.goto('/');
  const find = page.locator('#find [data-schedule-state]');
  await expect(find).toHaveAttribute('data-schedule-state', 'not-confirmed');
  await expect(find).toContainText('No confirmed stop posted');
});

test('ordering: no Square, unverified delivery links are not clickable', async ({ page }) => {
  await page.goto('/#order');
  await expect(page.locator('a[href*="square"]')).toHaveCount(0);
  for (const provider of ['uber', 'doordash']) {
    await page.locator(`#order-tab-${provider}`).click();
    await expect(page.locator(`[data-order-pending="${provider}"]`)).toBeVisible();
    await expect(page.locator(`[data-order-provider="${provider}"]`)).toHaveCount(0);
  }
});

test('truck scene and story gate are reviewable', async ({ page }) => {
  await page.goto('/#catering');
  const scene = page.locator('.truck-scene');
  await expect(scene.locator('img')).toHaveAttribute('alt', /woman .* leads .* Black man works the grill/);
  await expect(scene.locator('figcaption')).toContainText('Illustration for review');
  await expect(page.locator('[data-story-state="draft"]')).toContainText('pending family copy and approval');
});

for (const width of [320, 390, 768, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('mobile menu exposes the five customer paths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  const sheet = page.getByRole('dialog', { name: 'Site menu' });
  for (const label of ['Find the truck', 'Menu', 'Order', 'Catering', 'Story']) await expect(sheet.getByRole('navigation').getByRole('link', { name: label, exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
});

test('reduced-motion visitors get no autoplaying intro', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForTimeout(500);
  await expect(page.locator('.showtime-intro')).toHaveCount(0);
  await context.close();
});

test('home page has no serious or critical accessibility violations', async ({ page }) => {
  // Reduced motion stops the review card fade-in, so contrast is measured at full opacity.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
});
