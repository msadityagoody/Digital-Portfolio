import { useRef, useState } from 'react';
import { profile } from '../data/profile';
import { finishIntro, shouldPlayIntro } from '../lib/intro';
import { gsap, useGSAP } from '../lib/gsap';

const LINE = `${profile.name.toLowerCase()} — ${profile.role.toLowerCase()}`;

/**
 * Short terminal-style intro (≈1.8s), once per session, skippable (button or Escape).
 * Not rendered at all for reduced-motion users or repeat visits in the same session.
 */
export function IntroLoader() {
  const [active, setActive] = useState(shouldPlayIntro);
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!active || !root.current || !text.current) return;
      const state = { n: 0 };
      const done = () => {
        finishIntro();
        setActive(false);
      };
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';

      tl.current = gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = prevOverflow;
            done();
          },
        })
        .to(state, {
          n: LINE.length,
          duration: 0.95,
          ease: `steps(${LINE.length})`,
          onUpdate: () => {
            if (text.current) text.current.textContent = LINE.slice(0, Math.round(state.n));
          },
        })
        .to(bar.current, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, '-=0.2')
        .to(root.current, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '+=0.15')
        // Hero entrance starts while the panel is still lifting.
        .add(() => finishIntro(), '-=0.55');

      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && skip();
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.documentElement.style.overflow = prevOverflow;
      };
    },
    { scope: root, dependencies: [active] },
  );

  const skip = () => {
    const t = tl.current;
    if (t && t.progress() < 0.75) t.timeScale(4);
  };

  if (!active) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex items-center justify-center bg-surface">
      <div className="w-[min(32rem,calc(100vw-3rem))]">
        <p className="font-mono text-[0.9375rem] font-medium text-ink" aria-label={`${profile.name}, ${profile.role}`}>
          <span className="text-accent" aria-hidden="true">
            &gt;{' '}
          </span>
          <span ref={text} aria-hidden="true" />
          <span aria-hidden="true" className="caret ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-accent" />
        </p>
        <div className="mt-4 h-px bg-line">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-8 right-8 h-11 rounded-[10px] border border-line px-4 font-mono text-xs font-medium text-ink transition-colors hover:border-muted"
      >
        Skip intro
      </button>
    </div>
  );
}
