import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}/Digital-Portfolio/`;

/**
 * Runs against the production build (vite preview) using the locally installed Chrome,
 * so no Playwright browser download is required.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/mobile-startup.spec.ts',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'fresh-startup', testMatch: '**/mobile-startup.spec.ts', testIgnore: [] },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'laptop', use: { viewport: { width: 1280, height: 720 } } },
    { name: 'tablet-land', use: { viewport: { width: 1024, height: 768 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    { name: 'small', use: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true } },
  ],
});
