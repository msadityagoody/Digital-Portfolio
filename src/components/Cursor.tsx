import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

const FINE_POINTER = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const INTERACTIVE = 'a, button, [role="button"], summary, label';

/**
 * Lime dot + trailing ring. Only for mouse users with motion enabled;
 * touch, keyboard and reduced-motion users keep the native cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(FINE_POINTER, () => {
      const root = document.documentElement;
      const d = dot.current;
      const r = ring.current;
      if (!d || !r) return;

      root.classList.add('has-cursor');
      gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' });
      const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' });
      const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3.out' });
      const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3.out' });

      let visible = false;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (!visible) {
          gsap.set([d, r], { x: e.clientX, y: e.clientY });
          gsap.to([d, r], { autoAlpha: 1, duration: 0.25 });
          visible = true;
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };

      const onOver = (e: Event) => {
        const target = e.target as Element | null;
        const hot = !!target?.closest(INTERACTIVE);
        const onAccent = !!target?.closest('.on-accent, .bg-accent');
        r.dataset.hot = String(hot);
        d.dataset.accent = r.dataset.accent = String(onAccent);
        gsap.to(r, { scale: hot ? 1.7 : 1, duration: 0.35, ease: 'power3.out' });
        gsap.to(d, { scale: hot ? 0.5 : 1, duration: 0.25, ease: 'power3.out' });
      };

      const onLeave = () => {
        gsap.to([d, r], { autoAlpha: 0, duration: 0.2 });
        visible = false;
      };
      const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.15 });
      const onUp = () => gsap.to(r, { scale: r.dataset.hot === 'true' ? 1.7 : 1, duration: 0.3 });

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);

      return () => {
        root.classList.remove('has-cursor');
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
      };
    });
    return () => mm.revert();
  });

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
