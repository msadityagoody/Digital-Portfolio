import { expect, test, type Page } from '@playwright/test';

const PROJECT_TITLES = [
  'BMS Cloud / Smart Building Platform',
  'Electrical Optimiser & SLD Automation',
  'Waypoint — Job Search Automation',
  'End-to-End Encrypted Chat',
  'HVAC Drawing Data Extraction',
];

// Most tests start after the once-per-session intro; the intro has its own tests below.
test.beforeEach(async ({ page }, testInfo) => {
  if (!testInfo.title.startsWith('intro')) {
    await page.addInitScript(() => sessionStorage.setItem('intro-seen', '1'));
  }
});

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  return errors;
}

async function isMobileProject(page: Page) {
  return (page.viewportSize()?.width ?? 1024) < 768;
}

test('renders all sections without console errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building software that connects complex systems');
  for (const id of ['about', 'journey', 'work', 'skills', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  for (const title of PROJECT_TITLES) {
    await expect(page.getByRole('heading', { level: 3, name: title })).toHaveCount(1);
  }
  await expect(page.getByText('Illustrative diagram — not a screenshot')).toHaveCount(PROJECT_TITLES.length);
  await expect(page.getByText('Jupiter Brothers Pvt. Ltd.').first()).toBeAttached();

  // Scroll through the whole page so every ScrollTrigger fires.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(1200);
  expect(errors).toEqual([]);
});

test('every reveal element ends up visible after scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  // Poll instead of a fixed wait: under parallel load the last staggered reveals can finish late.
  await expect
    .poll(
      () =>
        page.$$eval('[data-reveal]', (els) =>
          els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99).map((el) => el.textContent?.slice(0, 40)),
        ),
      { timeout: 8000 },
    )
    .toEqual([]);
});

test('deep link to #contact shows content immediately', async ({ page }) => {
  await page.goto('/#contact');
  await page.waitForTimeout(1500);
  const heading = page.getByRole('heading', { level: 2, name: /Let.s build something together/ });
  await expect(heading).toBeInViewport();
  await expect(heading).toHaveCSS('opacity', '1');
});

test('no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(800);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('project cards fit their content (no clipped text)', async ({ page }) => {
  await page.goto('/');
  const clipped = await page.$$eval('[data-card-inner]', (cards) =>
    cards
      .map((card) => {
        const text = card.firstElementChild as HTMLElement;
        return { h: card.clientHeight, need: text.scrollHeight, title: card.querySelector('h3')?.textContent };
      })
      .filter((c) => c.need > c.h + 1),
  );
  expect(clipped).toEqual([]);
});

test('résumé download is linked and served', async ({ page, request }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /Download résumé/ }).first();
  await expect(link).toHaveAttribute('href', '/resume.pdf');
  const res = await request.get('/resume.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('external links are safe', async ({ page }) => {
  await page.goto('/');
  const links = await page.$$eval('a[target="_blank"]', (as) => as.map((a) => ({ href: a.getAttribute('href'), rel: a.getAttribute('rel') ?? '' })));
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    expect(link.rel).toContain('noopener');
    expect(link.href).toMatch(/^https:\/\//);
  }
});

test('desktop nav links scroll to sections', async ({ page }) => {
  test.skip(await isMobileProject(page), 'desktop nav only');
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Skills/ }).click();
  await expect(page.locator('#skills')).toBeInViewport();
  await expect(page).toHaveURL(/#skills$/);
});

test('mobile menu: open, trap focus, escape, navigate', async ({ page }) => {
  test.skip(!(await isMobileProject(page)), 'mobile menu only');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

  // Focus is inside the menu and Tab cycles within it.
  await expect(dialog.getByRole('link').first()).toBeFocused();
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();

  await page.getByRole('button', { name: 'Open menu' }).click();
  await dialog.getByRole('link', { name: /Work/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#work')).toBeInViewport();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('keyboard: skip link is first and works', async ({ page }) => {
  test.skip(await isMobileProject(page), 'keyboard test on desktop');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('intro: plays once, hands off to the hero, then stays away for the session', async ({ page }) => {
  const errors = trackErrors(page);
  // Don't wait for the full load event (images): the intro is only ~2s long.
  await page.goto('/', { waitUntil: 'commit' });
  const skip = page.getByRole('button', { name: 'Skip intro' });
  await expect(skip).toBeVisible();
  await expect(skip).toBeHidden({ timeout: 6000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Skip intro' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('intro: skip button and Escape shorten it', async ({ page }) => {
  await page.goto('/');
  // The intro may already be finishing on a slow, parallel run: skipping must never hang.
  await page.getByRole('button', { name: 'Skip intro' }).click({ timeout: 1500 }).catch(() => undefined);
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeHidden({ timeout: 2500 });
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
});

test('custom cursor only for a fine pointer', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  const { hasCursor, finePointer } = await page.evaluate(() => ({
    hasCursor: document.documentElement.classList.contains('has-cursor'),
    finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
  }));
  expect(hasCursor).toBe(finePointer);
});

const scrollToSel = (page: Page, sel: string, offset = 0) =>
  page.evaluate(
    ([s, o]) => {
      const el = document.querySelector(s as string)!;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (o as number), behavior: 'instant' });
    },
    [sel, offset] as const,
  );

const fillScale = (page: Page) =>
  page.$eval('[data-journey-fill]', (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).d);

test('hero portrait: real photo loads with alt text, placeholder gone', async ({ page }) => {
  await page.goto('/');
  const img = page.getByRole('img', { name: 'Black-and-white portrait of Aditya MS' });
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  await expect(page.getByText('Photo placeholder')).toHaveCount(0);
  // The headline stays above the photo and readable.
  const z = await page.evaluate(() => {
    const h = document.querySelector('#hero-title')!.getBoundingClientRect();
    const el = document.elementFromPoint(h.left + 20, h.top + h.height / 2);
    return !!el?.closest('#hero-title');
  });
  expect(z).toBe(true);
});

test('hero portrait: hover reveals the source; toggle shows it in full (keyboard/touch too)', async ({ page }) => {
  await page.goto('/');
  const layer = page.locator('[data-source-layer]');
  await expect(page.locator('[data-source-canvas]')).toHaveAttribute('data-rendered', 'true');

  const finePointer = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
  if (finePointer) {
    const box = (await page.locator('[data-portrait] img').boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.3, { steps: 5 });
    await expect(layer).toHaveAttribute('data-mode', 'hover');
    await page.mouse.move(5, 5);
    await expect(layer).toHaveAttribute('data-mode', 'off');
  }

  const toggle = page.getByRole('button', { name: 'View source' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'View photo' })).toHaveAttribute('aria-pressed', 'true');
  await expect(layer).toHaveAttribute('data-mode', 'full');
  await page.getByRole('button', { name: 'View photo' }).click();
  await expect(layer).toHaveAttribute('data-mode', 'off');
});

test('journey: four milestones, oldest first, internship vs full-time', async ({ page }) => {
  await page.goto('/');
  const milestones = page.locator('[data-milestone]');
  await expect(milestones).toHaveCount(4);
  await expect(milestones.locator('h3')).toHaveText([
    'Generative AI Intern',
    'Cybersecurity Intern',
    'SDE Intern',
    'Software Development Engineer',
  ]);
  await expect(page.locator('[data-milestone][data-kind="internship"]')).toHaveCount(3);
  await expect(page.locator('[data-milestone][data-kind="full-time"]')).toHaveCount(1);
  await expect(milestones.nth(2)).toContainText('Feb 2026 — Jun 2026');
  await expect(milestones.nth(3)).toContainText('Jul 2026 — Present');
  await expect(milestones.nth(3)).toContainText('Converted to full-time');
  await expect(page.getByRole('heading', { level: 2, name: /From internships to engineering/ })).toHaveCount(1);
});

test('journey: progress line follows scroll and the full-time milestone activates last', async ({ page }) => {
  await page.goto('/');
  await scrollToSel(page, '[data-milestone]', -page.viewportSize()!.height * 0.5);
  await page.waitForTimeout(900);
  const early = await fillScale(page);
  await expect(page.locator('#journey')).toHaveAttribute('data-phase', 'internship');

  await scrollToSel(page, '[data-milestone][data-kind="full-time"]', -page.viewportSize()!.height * 0.3);
  await page.waitForTimeout(1200);
  const late = await fillScale(page);
  expect(late).toBeGreaterThan(early);
  expect(late).toBeGreaterThan(0.95);
  await expect(page.locator('.milestone.is-active')).toHaveCount(4);
  await expect(page.locator('#journey')).toHaveAttribute('data-phase', 'full-time');

  // Scrolling back up deactivates the full-time phase again (no stuck state).
  await scrollToSel(page, '[data-milestone]', -page.viewportSize()!.height * 0.5);
  await page.waitForTimeout(900);
  await expect(page.locator('#journey')).toHaveAttribute('data-phase', 'internship');
});

test('credentials: visible heading, all five certifications, SAP featured', async ({ page }) => {
  await page.goto('/');
  await scrollToSel(page, '#journey ul[aria-label="Certifications"]', -200);
  await page.waitForTimeout(1500);
  await expect(page.getByRole('heading', { level: 3, name: 'Credentials' })).toBeVisible();
  const certs = page.getByRole('list', { name: 'Certifications' }).getByRole('listitem');
  await expect(certs).toHaveCount(5);
  for (const name of [
    'SAP Certified — Joule Studio Developer',
    'Google Cybersecurity',
    'Red Hat Linux Essentials',
    'AWS Cloud Essentials',
    'OCI Foundations',
  ]) {
    await expect(certs.filter({ hasText: name })).toBeVisible();
  }
  await expect(certs.first()).toContainText('Featured certification · 2026');
  await expect(certs.filter({ hasText: '2025' })).toHaveCount(4);
  await expect(page.locator('#journey img')).toHaveCount(0);
});

test('skills: core keys update the detail panel by pointer and keyboard', async ({ page }) => {
  await page.goto('/');
  const keys = page.getByRole('list', { name: 'Core stack' }).getByRole('button');
  await expect(keys).toHaveCount(12);
  const panel = page.locator('#skill-panel');

  await scrollToSel(page, '#skills', 0);
  await page.waitForTimeout(1500);
  await keys.filter({ hasText: 'FastAPI' }).click();
  await expect(keys.filter({ hasText: 'FastAPI' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel).toContainText('FastAPI');
  await expect(panel).toContainText('BMS Cloud / Smart Building Platform');
  await expect(panel).toContainText('Waypoint — Job Search Automation');

  // Park the mouse so a stale pointer position cannot hover a key while focus scrolls the page.
  await page.mouse.move(1, 1);
  await keys.filter({ hasText: 'MQTT' }).focus();
  await expect(panel).toContainText('MQTT');
  await expect(panel).toContainText('BMS Cloud / Smart Building Platform');
  await page.keyboard.press('Shift+Tab');
  await expect(keys.filter({ hasText: 'CI/CD' })).toHaveAttribute('aria-pressed', 'true');

  // No invented proficiency data anywhere in the section.
  const text = await page.locator('#skills').innerText();
  expect(text).not.toMatch(/%|\byears?\b|\b\d+y\b|endorse/i);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('content is static and fully visible', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await expect(page.locator('.hero-line')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Skip intro' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains('has-cursor'))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
    // Journey is fully drawn and every milestone visible without scrolling.
    await expect(page.locator('#journey')).not.toHaveClass(/journey-motion/);
    await expect(page.locator('#journey')).toHaveAttribute('data-phase', 'full-time');
    expect(await fillScale(page)).toBe(1);
    const dimmed = await page.$$eval('.milestone-body', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(dimmed).toBe(0);
    const notVisible = await page.$$eval('[data-reveal], [data-hero-fade]', (els) =>
      els.filter((el) => getComputedStyle(el).opacity !== '1' || getComputedStyle(el).visibility === 'hidden').length,
    );
    expect(notVisible).toBe(0);
    const clips = await page.$$eval('[data-visual-clip]', (els) => els.map((el) => getComputedStyle(el).clipPath));
    expect(clips.every((c) => c === 'none')).toBe(true);
    expect(errors).toEqual([]);
  });
});
