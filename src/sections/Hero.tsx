import { useRef } from 'react';
import { profile } from '../data/profile';
import { education } from '../data/experience';
import { ButtonLink } from '../components/ButtonLink';
import { Portrait } from '../components/Portrait';
import { introDone } from '../lib/intro';
import { MOTION_OK, SplitText, gsap, useGSAP } from '../lib/gsap';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, (ctx) => {
        const q = gsap.utils.selector(root);
        const fades = q('[data-hero-fade]');
        const portrait = q('[data-portrait]');
        const portraitInner = q('[data-portrait-inner]');
        const card = q('[data-portrait-card]');

        // Hidden state is set before first paint; the entrance waits for the intro loader.
        gsap.set([title.current, ...fades, ...card], { autoAlpha: 0 });
        const r = profile.portrait ? '0px' : '20px';
        gsap.set(portrait, { clipPath: `inset(100% 0% 0% 0% round ${r})` });

        let cancelled = false;
        let split: SplitText | undefined;

        introDone.then(() => {
          if (cancelled) return;
          ctx.add(() => {
            gsap.set(title.current, { autoAlpha: 1 });
            split = SplitText.create(title.current, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'hero-line',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, { yPercent: 115, duration: 1.15, ease: 'expo.out', stagger: 0.085, delay: 0.05 }),
            });

            gsap
              .timeline({ defaults: { ease: 'expo.out' } })
              .to(portrait, { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.5, ease: 'expo.inOut' }, 0)
              .from(portraitInner, { scale: 1.25, duration: 2, ease: 'expo.out' }, 0.1)
              .to(fades, { autoAlpha: 1, duration: 0.9, stagger: 0.07 }, 0.35)
              .from(fades, { y: 22, duration: 1, stagger: 0.07 }, 0.35)
              .to(card, { autoAlpha: 1, duration: 0.8 }, 1.05)
              .from(card, { y: 18, duration: 1 }, 1.05);
          });
        });

        // Subtle parallax while scrolling away from the hero.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(grid.current, { yPercent: 14, ease: 'none', scrollTrigger: { ...st } });
        gsap.to(portraitInner, { yPercent: 7, ease: 'none', scrollTrigger: { ...st } });
        gsap.to(content.current, { yPercent: -5, ease: 'none', scrollTrigger: { ...st } });

        return () => {
          cancelled = true;
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div ref={grid} className="hero-grid absolute inset-x-0 -bottom-24 top-0" />
        <div className="absolute left-[-10%] top-[20%] size-[40rem] max-w-[90vw] rounded-full bg-accent/[0.05] blur-[120px]" />
      </div>

      <div className="container-x grid flex-1 items-center gap-10 pb-10 pt-6 hero-wide:relative hero-wide:grid-cols-12 hero-wide:gap-12 hero-wide:pb-14 hero-wide:pt-10">
        <div ref={content} className="relative z-10 flex flex-col gap-8 hero-wide:col-span-7 hero-wide:gap-10">
          <p data-hero-fade className="marker">
            <span>
              {profile.role}
              <span className="text-muted"> · {profile.location}</span>
            </span>
          </p>

          <h1
            ref={title}
            id="hero-title"
            className="display max-w-[14ch] text-[clamp(2.6rem,1.1rem+5.2vw,5.6rem)] [text-wrap:balance] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]"
          >
            {profile.headline.lead} <span className="text-accent">{profile.headline.accent}</span>
          </h1>

          <p data-hero-fade className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">
            {profile.description}
          </p>

          <div data-hero-fade className="flex flex-wrap gap-3">
            <ButtonLink href="#work" icon="down">
              See the work
            </ButtonLink>
            {profile.resumeUrl && (
              <ButtonLink href={profile.resumeUrl} variant="ghost" icon="download" download="Aditya_MS_Resume.pdf">
                Download résumé
              </ButtonLink>
            )}
          </div>
        </div>

        <div
          className={
            profile.portrait
              ? 'order-first mx-auto w-full max-w-[min(28rem,48svh)] hero-wide:absolute hero-wide:inset-y-0 hero-wide:right-0 hero-wide:z-0 hero-wide:m-0 hero-wide:w-[52%] hero-wide:max-w-none'
              : 'order-first h-[min(40svh,21rem)] sm:h-[30rem] hero-wide:order-none hero-wide:col-span-5 hero-wide:h-[min(74svh,40rem)]'
          }
        >
          <Portrait />
        </div>
      </div>

      <div className="container-x pb-8">
        <dl data-hero-fade className="grid gap-5 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="mono-label">Focus</dt>
            <dd className="mt-1.5 text-sm">{profile.focus.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono-label">Core stack</dt>
            <dd className="mt-1.5 text-sm">{profile.coreStack.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono-label">Education</dt>
            <dd className="mt-1.5 text-sm">{education.degree}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
