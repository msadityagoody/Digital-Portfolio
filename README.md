# Aditya MS — Portfolio

Single-page developer portfolio built with React, Vite, TypeScript, Tailwind CSS v4 and GSAP (ScrollTrigger, SplitText, `@gsap/react`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173/Digital-Portfolio/ |
| `npm run build` | Type-check (`tsc`) and production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test:e2e` | Playwright tests against the production build (uses the locally installed Chrome) |

## Editing content

All text lives in typed data files — no copy is hard-coded in components:

- `src/data/profile.ts` — name, headline, about text, links, résumé path
- `src/data/experience.ts` — career milestones (oldest first, `kind: 'internship' | 'full-time'`), education, certifications (add a cert `url` only with a real verification link)
- `src/data/projects.ts` — project cards (add `links` only with real URLs)
- `src/data/skills.ts` — the 12 core-stack keys and supporting tool groups. The "Used in" panel is derived from project/experience stacks (`src/lib/skillUsage.ts`); no proficiency numbers are shown.

The résumé button appears only while `profile.resumeUrl` is set; the file is `public/resume.pdf`.
Project visuals are original abstract SVG diagrams (`src/components/visuals/`) and are labelled on screen as not being screenshots.

## Structure

```
src/
  components/   Nav, ButtonLink, SectionHeader, visuals/
  sections/     Hero, About, Journey, Projects, Skills, Contact, Footer
  hooks/        useReveal, useActiveSection, useInitialHashScroll
  lib/gsap.ts   plugin registration + shared motion constants
  data/         typed content
```

## Motion

- Every animation runs inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` via `useGSAP`, so it is cleaned up on unmount and fully disabled for reduced-motion users (content renders static and visible).
- The project deck uses CSS `position: sticky` (only at ≥ 1024 × 720); GSAP only scrubs the receding/dimming transition, image reveals and parallax.

## Deployment security headers

The production build injects a strict Content-Security-Policy `<meta>` tag (see `vite.config.ts`). Some protections only work as real HTTP headers — configure these on the host:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
