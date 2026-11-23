import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Production-only Content Security Policy.
 * The dev server needs inline styles/HMR websockets, so the policy is only
 * injected into the built index.html. frame-ancestors and other header-only
 * directives must be set by the hosting provider (see README).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function cspMeta(): Plugin {
  return {
    name: 'portfolio:csp-meta',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cspMeta()],
  build: {
    sourcemap: false,
    // Emit every asset (incl. small font subsets) as a file so the CSP can stay at font-src 'self'.
    assetsInlineLimit: 0,
  },
});
