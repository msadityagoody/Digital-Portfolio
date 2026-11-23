import type { RefObject } from 'react';
import { DESKTOP_MOTION, EASE, MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../lib/gsap';

/**
 * Fades and lifts every `[data-reveal]` element inside `scope` as it scrolls into view.
 * Runs once per element. With reduced motion nothing is hidden, so content is always visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP_MOTION }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current);
        if (!items.length) return;

        // Leave mobile content visible until it enters the viewport. This avoids
        // measuring every offscreen reveal with ScrollTrigger during initial render.
        if (!ctx.conditions.desktop) {
          const observer = new IntersectionObserver((entries) => {
            const batch = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
            if (!batch.length) return;
            batch.forEach((el) => observer.unobserve(el));
            ctx.add(() => { gsap.from(batch, { opacity: 0, y: 16, duration: 0.45, ease: EASE }); });
          });
          items.forEach((el) => observer.observe(el));
          return () => observer.disconnect();
        }

        // Opacity only (not visibility): content stays in the accessibility tree before it is revealed.
        gsap.set(items, { opacity: 0, y: 28 });
        const show = (batch: Element[]) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, overwrite: true });

        ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          onEnter: show,
          // Elements jumped past (anchor links) reveal when scrolled back to.
          onEnterBack: show,
        });

        // Anything already scrolled past (deep link / restored scroll) is shown immediately.
        const raf = requestAnimationFrame(() => {
          const past = items.filter((el) => el.getBoundingClientRect().top < window.innerHeight * 0.9);
          if (past.length) show(past);
        });
        return () => cancelAnimationFrame(raf);
      });
      return () => mm.revert();
    },
    { scope },
  );
}
