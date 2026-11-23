import { useRef, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import type { Project } from '../data/types';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectVisual } from '../components/visuals/ProjectVisual';
import { useReveal } from '../hooks/useReveal';
import { DECK_MQ, EASE, MOTION_OK, gsap, useGSAP } from '../lib/gsap';

const pad = (n: number) => String(n).padStart(2, '0');

export function Projects() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, deck: DECK_MQ }, (ctx) => {
        const { motion, deck } = ctx.conditions ?? {};
        if (!motion) return;

        const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
        cards.forEach((card, i) => {
          const clip = card.querySelector('[data-visual-clip]');
          const layer = card.querySelector('[data-visual-parallax]');

          // Image reveal: the visual opens from an inset frame.
          gsap.fromTo(
            clip,
            { clipPath: 'inset(14% 12% 14% 12% round 12px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 12px)',
              duration: 1.5,
              ease: EASE,
              scrollTrigger: { trigger: card, start: 'top 80%', once: true },
            },
          );

          // Subtle parallax / settle of the artwork inside its frame.
          gsap.fromTo(
            layer,
            { yPercent: -4, scale: 1.08 },
            {
              yPercent: 4,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: deck ? 'top top' : 'bottom top', scrub: true },
            },
          );

          // Deck transition: as the next card slides over, this one recedes and dims.
          const next = cards[i + 1];
          if (deck && next) {
            const inner = card.querySelector('[data-card-inner]');
            const dim = card.querySelector('[data-dim]');
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: next,
                  start: 'top bottom',
                  end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .to(inner, { scale: 0.94, ease: 'none' }, 0)
              .to(dim, { opacity: 0.55, ease: 'none' }, 0);
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHeader
          id="work-title"
          index="03"
          label="Selected work"
          title={
            <>
              Selected <span className="text-accent">work.</span>
            </>
          }
          intro="Five projects across building platforms, electrical engineering automation, drawing data extraction, job-search tooling and secure messaging."
        />

        <ol className="mt-14 md:mt-20">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} total={projects.length} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const style = { '--i': index } as CSSProperties;
  const titleId = `project-${project.id}`;

  return (
    <li
      data-card
      style={style}
      className="relative mb-6 last:mb-0 deck:sticky deck:top-[calc(var(--nav-h)+1rem+var(--i)*0.625rem)] deck:mb-[16vh]"
    >
      <article
        data-card-inner
        aria-labelledby={titleId}
        className="group relative grid origin-top overflow-hidden rounded-[18px] border border-line bg-surface transition-colors duration-500 hover:border-muted/50 lg:grid-cols-[1.08fr_1fr] deck:h-[min(46rem,calc(100svh-var(--nav-h)-2.5rem-var(--i)*0.625rem))]"
      >
        <div className="flex flex-col p-6 sm:p-8 xl:p-10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs">
            <span className="text-muted">
              <span className="font-medium text-accent">{pad(index + 1)}</span> of {pad(total)}
            </span>
            <span className="font-medium text-ink">
              {project.context ? `${project.context} · ` : ''}
              {project.year}
            </span>
          </div>

          <div className="flex flex-col lg:mt-auto">
          <h3
            id={titleId}
            className="mt-6 lg:mt-0 font-display text-[clamp(1.85rem,1.2rem+1.6vw,2.75rem)] font-[620] leading-[1] tracking-[-0.045em] [text-wrap:balance]"
          >
            {project.title}
          </h3>
          <p className="mt-3 max-w-[36rem] text-[1.0125rem] leading-relaxed text-ink/85">{project.summary}</p>

          <dl className="mt-5 grid gap-4 border-t border-line pt-5 text-[0.9375rem] leading-relaxed">
            <div>
              <dt className="mono-label">The problem</dt>
              <dd className="mt-1.5 text-ink/80">{project.problem}</dd>
            </div>
            <div>
              <dt className="mono-label">What I worked on</dt>
              <dd className="mt-1.5">
                <ul className="space-y-1.5 text-ink/80">
                  {project.work.map((w) => (
                    <li key={w} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-accent" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="mono-label">{project.stackLabel ?? 'Stack'}</dt>
              <dd className="mt-2.5">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          </div>

          {project.links && project.links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-5">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-ink"
                  >
                    <span className="link-wipe">{link.label}</span>
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative order-first aspect-[5/4] p-2 sm:aspect-[4/3] lg:order-last lg:aspect-auto lg:p-2.5">
          <div
            data-visual-clip
            className="relative h-full w-full overflow-hidden rounded-[12px] border border-line bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_60%),var(--color-bg)]"
          >
            <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-60" />
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.035]">
              <div data-visual-parallax className="absolute inset-x-0 -inset-y-[4%] px-2 pb-3 pt-10 sm:px-6 sm:pb-5 lg:pt-14">
                <ProjectVisual kind={project.visual} />
              </div>
            </div>
            <span className="absolute left-3 top-3 rounded-[6px] bg-accent px-2 py-1 font-mono text-[0.6875rem] font-medium text-accent-ink">
              {project.category}
            </span>
          </div>
        </div>

        <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
      </article>
    </li>
  );
}
