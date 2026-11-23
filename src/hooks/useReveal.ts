import type { RefObject } from 'react';
import { EASE, MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../lib/gsap';

/**
 * Fades and lifts every `[data-reveal]` element inside `scope` as it scrolls into view.
 * Runs once per element. With reduced motion nothing is hidden, so content is always visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current);
        if (!items.length) return;

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
