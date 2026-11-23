import { useLayoutEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { finishIntro, shouldPlayIntro } from '../lib/intro';
import { DESKTOP_MOTION, gsap } from '../lib/gsap';

const LINE = `${profile.name.toLowerCase()} — ${profile.role.toLowerCase()}`;

/**
 * Desktop terminal intro. The skip control stays on screen during the panel's exit.
 */
export function IntroLoader() {
  const [active, setActive] = useState(shouldPlayIntro);
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const skip = () => {
    finishIntro('show');
    setActive(false);
  };

  useLayoutEffect(() => {
    if (!active) return;
    const eligible = window.matchMedia(DESKTOP_MOTION);
    if (!eligible.matches || !root.current || !text.current || !bar.current) {
      skip();
      return;
    }
    const state = { n: 0 };
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    eligible.addEventListener('change', skip);
    // Independent of GSAP's ticker in case it stops before the handoff.
    const deadline = window.setTimeout(skip, 3200);
    let timeline: gsap.core.Timeline | undefined;
    let completed = false;
    try {
      timeline = gsap.timeline({
        onComplete: () => {
          completed = true;
          finishIntro('animate');
          setActive(false);
        },
      });
      timeline
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
        .add(() => finishIntro('animate'), '-=0.55');
    } catch {
      skip();
    }
    return () => {
      clearTimeout(deadline);
      window.removeEventListener('keydown', onKey);
      eligible.removeEventListener('change', skip);
      timeline?.revert();
      document.documentElement.style.overflow = previousOverflow;
      // StrictMode immediately reattaches refs during its development effect replay.
      if (!completed) queueMicrotask(() => { if (!root.current) finishIntro('show'); });
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={root} data-intro-panel className="fixed inset-0 z-[80] flex items-center justify-center bg-surface">
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
      </div>
      <button
        type="button"
        onClick={skip}
        className="fixed bottom-8 right-8 z-[80] h-11 rounded-[10px] border border-line px-4 font-mono text-xs font-medium text-ink transition-colors hover:border-muted"
      >
        Skip intro
      </button>
    </>
  );
}
