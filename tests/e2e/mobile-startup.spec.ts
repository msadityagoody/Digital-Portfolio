import { expect, test } from '@playwright/test';

// Each case gets a fresh browser context. Observe the first hero frame before interacting.
for (const [width, touch] of [[320, true], [390, true], [430, true], [767, false], [1024, true], [1280, false]] as const) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    if (width === 1280 && reducedMotion === 'no-preference') continue; // Covered by the desktop intro suite.
    test.describe(`${width}px ${touch ? 'touch' : 'mouse'} / ${reducedMotion}`, () => {
      test.use({ viewport: { width, height: 844 }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 3, reducedMotion });

      test('first visit paints the hero with native scrolling', async ({ page, context }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
        const cdp = await context.newCDPSession(page);
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await cdp.send('Network.enable');
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8,
        });
        await page.addInitScript(() => {
          const observer = new MutationObserver(() => {
            const hero = document.querySelector<HTMLElement>('#hero-title');
            if (!hero) return;
            observer.disconnect();
            requestAnimationFrame(() => {
              const portrait = document.querySelector<HTMLElement>('[data-portrait]')!;
              const title = getComputedStyle(hero);
              hero.dataset.firstFrame = JSON.stringify({
                visible: title.visibility === 'visible' && title.opacity === '1',
                clip: getComputedStyle(portrait).clipPath,
                blocked: !!document.querySelector('[data-intro-panel]') || document.documentElement.style.overflow === 'hidden',
              });
            });
          });
          observer.observe(document, { childList: true, subtree: true });
        });
        await page.goto('./', { waitUntil: 'commit' });
        // A throttled transfer may outlast the default assertion timeout. The observation
        // itself is captured on the first animation frame after React mounts the hero.
        await expect(page.locator('#hero-title')).toHaveAttribute('data-first-frame',
          JSON.stringify({ visible: true, clip: 'none', blocked: false }), { timeout: 15_000 });
        await expect(page.locator('[data-intro-panel], .hero-line, html.lenis')).toHaveCount(0);
        expect(await page.evaluate(() => sessionStorage.getItem('intro-seen'))).toBeNull();
        const img = page.locator('[data-portrait] img');
        await img.evaluate((el: HTMLImageElement) => el.decode());
        const unobstructed = await img.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return !!document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 3)?.closest('[data-portrait]');
        });
        expect(unobstructed).toBe(true);
        await page.evaluate(() => window.scrollTo({ top: 250, behavior: 'instant' }));
        await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
        await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
        expect(errors).toEqual([]);
      });
    });
  }
}
