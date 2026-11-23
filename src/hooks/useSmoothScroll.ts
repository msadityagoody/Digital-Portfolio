import { useEffect } from 'react';
import Lenis from 'lenis';
import { MOTION_OK, ScrollTrigger, gsap } from '../lib/gsap';

let lenis: Lenis | null = null;
const NAV_OFFSET = -72;

/** Access to the active Lenis instance (null when reduced motion is on). */
export const getLenis = () => lenis;

/**
 * Inertial smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
 * Disabled for reduced-motion users, who keep native scrolling. Touch keeps native scrolling.
 * In-page links keep native semantics: the URL hash updates and focus moves to the target.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia(MOTION_OK);
    const raf = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: false,
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    };
    const stop = () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
    const onChange = () => (mq.matches ? start() : stop());

    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      // The skip link stays fully native (instant jump + focus).
      if (!link || !id || id === 'main') return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(id === 'top' ? 0 : target, { offset: NAV_OFFSET });
      history.pushState(null, '', `#${id}`);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    onChange();
    mq.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('click', onClick);
      stop();
    };
  }, []);
}
