import { useEffect } from 'react';
import { ScrollTrigger } from '../lib/gsap';

/**
 * The browser tries to scroll to `#hash` before React has rendered the target,
 * so deep links (e.g. /#contact) would land at the top. Scroll once the app and fonts are ready.
 */
export function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let cancelled = false;

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);
}
