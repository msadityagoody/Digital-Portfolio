import { useRef } from 'react';
import { profile } from '../data/profile';
import { SectionHeader } from '../components/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import { DESKTOP_MOTION, SplitText, gsap, useGSAP } from '../lib/gsap';

export function About() {
  const root = useRef<HTMLElement>(null);
  const lead = useRef<HTMLParagraphElement>(null);
  useReveal(root);

  // Lead statement brightens word by word as it scrolls through the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const split = SplitText.create(lead.current, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.18 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: { trigger: lead.current, start: 'top 82%', end: 'bottom 45%', scrub: 0.6 },
              },
            ),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const [first, ...rest] = profile.about;

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHeader
          id="about-title"
          index="01"
          label="About"
          title={
            <>
              Interfaces, services and the data <span className="text-accent">moving between them.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-9 md:col-start-4">
            <p
              ref={lead}
              className="font-display text-[clamp(1.5rem,1rem+1.6vw,2.5rem)] font-medium leading-[1.18] tracking-[-0.035em] text-ink [text-wrap:pretty]"
            >
              {first}
            </p>
            <div className="mt-10 grid gap-5 text-[1.0625rem] leading-relaxed text-ink/80 md:grid-cols-2 md:gap-8">
              {rest.map((p) => (
                <p data-reveal key={p}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
