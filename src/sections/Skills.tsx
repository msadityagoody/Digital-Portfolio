import { useMemo, useRef, useState } from 'react';
import { coreSkills, supportingSkills } from '../data/skills';
import { SectionHeader } from '../components/SectionHeader';
import { useReveal } from '../hooks/useReveal';
import { skillUsage } from '../lib/skillUsage';
import { MOTION_OK, gsap, useGSAP } from '../lib/gsap';

const pad = (n: number) => String(n).padStart(2, '0');

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const panelName = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  useReveal(root);

  const skill = coreSkills[active] ?? coreSkills[0]!;
  const usage = useMemo(() => skillUsage(skill), [skill]);

  // Subtle swap of the panel title when the selected key changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(panelName.current, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} id="skills" aria-labelledby="skills-title" className="on-accent section-y bg-accent text-accent-ink">
      <div className="container-x">
        <SectionHeader
          id="skills-title"
          index="04"
          label="Technical skills"
          tone="accent"
          title="The tools I build with."
          intro="Twelve technologies at the centre of my work, with the tools that support them. Select a key to see where it shows up in my projects and roles."
        />

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12 lg:gap-5">
          {/* Core keyboard */}
          <div className="lg:col-span-8">
            <p className="mb-4 flex items-baseline justify-between font-mono text-xs text-accent-ink/70">
              <span className="font-medium text-accent-ink">Core stack</span>
              <span>{coreSkills.length} keys</span>
            </p>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4" aria-label="Core stack">
              {coreSkills.map((s, i) => (
                <li key={s.name} data-reveal>
                  <button
                    type="button"
                    className="keycap"
                    aria-pressed={active === i}
                    aria-controls="skill-panel"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                  >
                    <span aria-hidden="true" className="font-mono text-[0.6875rem] text-muted">
                      {pad(i + 1)}
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display text-[clamp(1.125rem,0.95rem+0.7vw,1.5rem)] font-[620] leading-none tracking-[-0.035em]">
                        {s.name}
                      </span>
                      <span className="font-mono text-[0.6875rem] leading-tight text-muted">{s.category}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail panel */}
          <aside
            id="skill-panel"
            aria-live="polite"
            aria-label="Selected skill"
            className="order-first flex flex-col rounded-[18px] bg-accent-ink p-6 text-ink sm:p-8 lg:order-none lg:col-span-4 lg:mt-8"
          >
            <p className="flex items-center justify-between gap-4 font-mono text-xs text-muted">
              <span>
                key {pad(active + 1)} of {pad(coreSkills.length)}
              </span>
              <span className="rounded-[6px] border border-line px-2 py-1 text-ink">{skill.category}</span>
            </p>
            <div className="mt-6 overflow-hidden border-b border-line pb-6">
              <p
                ref={panelName}
                className="font-display text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] font-[620] leading-none tracking-[-0.05em] text-accent"
              >
                {skill.name}
              </p>
            </div>
            <p className="mono-label mt-6">Used in</p>
            {usage.length ? (
              <ul className="mt-3 space-y-2.5 text-[0.9375rem] leading-snug">
                {usage.map((u) => (
                  <li key={u} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[0.9375rem] text-muted">Listed in my résumé skills.</p>
            )}
          </aside>
        </div>

        {/* Supporting tools */}
        <div className="mt-14 border-t border-accent-ink/20 md:mt-20">
          <p data-reveal className="py-5 font-mono text-xs font-medium">
            Supporting tools
          </p>
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {supportingSkills.map((group) => (
              <div key={group.title} data-reveal className="border-t border-accent-ink/20 py-5">
                <dt className="font-mono text-xs text-accent-ink/70">{group.title}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-accent-ink/25 px-3 py-1.5 font-mono text-[0.8125rem] leading-none"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
