import { useLayoutEffect, useRef } from 'react';
import { certifications, education, experience, formatPeriod } from '../data/experience';
import { profile } from '../data/profile';
import type { Experience } from '../data/types';
import { ButtonLink } from '../components/ButtonLink';
import { useReveal } from '../hooks/useReveal';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../lib/gsap';

/** Scroll line: the progress fill and milestone activation are measured against this viewport position. */
const LINE = 'top 62%';

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  useReveal(root);

  // The rail ends at the last milestone's node, not at the bottom of its card.
  useLayoutEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const measure = () => {
      const last = ol.querySelector<HTMLElement>('[data-milestone]:last-of-type');
      if (last) ol.style.setProperty('--rail-h', `${last.offsetTop + 13 - 8}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ol);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current;
        const ol = list.current;
        if (!section || !ol) return;
        const q = gsap.utils.selector(section);
        const items = q('[data-milestone]');

        // Motion mode: milestones start dimmed and light up as the line reaches them.
        section.classList.add('journey-motion');
        section.dataset.phase = 'internship';

        // The fill reaches each node exactly when that milestone activates.
        gsap.fromTo(
          q('[data-journey-fill]'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: items[0], start: LINE, endTrigger: items[items.length - 1], end: LINE, scrub: 0.4 },
          },
        );

        items.forEach((item) => {
          const fullTime = item.dataset.kind === 'full-time';
          ScrollTrigger.create({
            trigger: item,
            start: LINE,
            onEnter: () => {
              item.classList.add('is-active');
              if (fullTime) {
                section.dataset.phase = 'full-time';
                gsap.fromTo(
                  item.querySelector('[data-pulse]'),
                  { scale: 0.6, autoAlpha: 0.9 },
                  { scale: 2.6, autoAlpha: 0, duration: 1.1, ease: 'power2.out' },
                );
              }
            },
            onLeaveBack: () => {
              item.classList.remove('is-active');
              if (fullTime) section.dataset.phase = 'internship';
            },
          });
        });

        return () => {
          section.classList.remove('journey-motion');
          section.dataset.phase = 'full-time';
          items.forEach((item) => item.classList.remove('is-active'));
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="journey"
      aria-labelledby="journey-title"
      data-phase="full-time"
      className="journey section-y border-t border-line"
    >
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Sticky heading + phase readout */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <p data-reveal className="marker">
                <span>
                  My Journey<span aria-hidden="true" className="text-muted"> · 02</span>
                </span>
              </p>
              <h2 id="journey-title" data-reveal className="h2 mt-6 lg:text-[clamp(2.25rem,0.8rem+2.4vw,3.5rem)]">
                From internships to <span className="text-accent">engineering.</span>
              </h2>
              <p data-reveal className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed text-muted">
                Three internships across generative AI, cybersecurity and software engineering, leading to a full-time
                Software Development Engineer role at Jupiter Brothers.
              </p>

              <div data-reveal className="mt-8" aria-hidden="true">
                <p className="mono-label">Phase</p>
                <div className="mt-3 inline-flex rounded-full border border-line p-1 font-mono text-xs">
                  <span className="phase-pill" data-for="internship">
                    Internships
                  </span>
                  <span className="phase-pill" data-for="full-time">
                    Full-time
                  </span>
                </div>
              </div>

              {profile.resumeUrl && (
                <div data-reveal className="mt-8 hidden lg:block">
                  <ButtonLink href={profile.resumeUrl} variant="ghost" icon="download" download="Aditya_MS_Resume.pdf">
                    Download résumé
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <ol ref={list} className="relative lg:col-span-8" aria-label="Career milestones, oldest first">
            <span aria-hidden="true" className="absolute left-[11px] top-2 h-[var(--rail-h,100%)] w-px bg-line" />
            <span
              aria-hidden="true"
              data-journey-fill
              className="absolute left-[11px] top-2 h-[var(--rail-h,100%)] w-px origin-top bg-accent"
            />
            {experience.map((job, i) => (
              <Milestone key={`${job.company}-${job.role}`} job={job} last={i === experience.length - 1} />
            ))}
          </ol>
        </div>

        <Credentials />
      </div>
    </section>
  );
}

function Milestone({ job, last }: { job: Experience; last: boolean }) {
  const fullTime = job.kind === 'full-time';
  return (
    <li data-milestone data-kind={job.kind} className={`milestone relative pl-12 sm:pl-16 ${last ? '' : 'pb-14 md:pb-20'}`}>
      {/* Node */}
      <span aria-hidden="true" className="absolute left-0 top-1 grid size-6 place-items-center">
        {fullTime && <span data-pulse className="absolute inset-0 rounded-full border-2 border-accent opacity-0" />}
        <span className={`milestone-node rounded-full border-2 ${fullTime ? 'size-6' : 'size-4'}`} />
      </span>

      <div className="milestone-body">
        {job.transition && (
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-accent">
            <span aria-hidden="true">↳</span>
            {job.transition}
          </p>
        )}

        <div className={fullTime ? 'milestone-card rounded-[18px] border p-6 sm:p-8' : ''}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
            <span
              className={
                fullTime
                  ? 'rounded-[6px] bg-accent px-2 py-1 font-medium text-accent-ink'
                  : 'rounded-[6px] border border-line px-2 py-1 text-muted'
              }
            >
              {fullTime ? 'Full-time' : 'Internship'}
            </span>
            <span className="text-ink">{formatPeriod(job)}</span>
            <span className="text-muted">{job.location}</span>
          </p>

          <h3
            className={`mt-4 font-display font-[620] leading-[1.02] tracking-[-0.045em] ${
              fullTime ? 'text-[clamp(2rem,1.3rem+2.4vw,3.25rem)]' : 'text-[clamp(1.5rem,1.2rem+1vw,2rem)]'
            }`}
          >
            {job.role}
          </h3>
          <p className="mt-1.5 text-muted">{job.company}</p>

          {job.note && <p className="mt-4 text-[0.9875rem] text-ink/85">{job.note}</p>}

          {job.points.length > 0 && (
            <ul className="mt-4 space-y-2 text-[0.9875rem] leading-relaxed text-ink/85">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className={`mt-[0.72em] h-px w-3 shrink-0 ${fullTime ? 'bg-accent' : 'bg-muted'}`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {job.stack && (
            <ul aria-label={`Technologies as ${job.role}`} className="mt-6 flex flex-wrap gap-2">
              {job.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function Credentials() {
  const [featured, ...rest] = [...certifications].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <div className="mt-24 grid gap-10 border-t border-line pt-16 md:mt-32 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <h3 data-reveal className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] font-[620] tracking-[-0.045em]">
          Credentials
        </h3>
        <p data-reveal className="mt-3 max-w-[24rem] text-muted">
          Certifications and education behind the work.
        </p>

        <article data-reveal className="mt-8 rounded-[14px] border border-line bg-surface p-6">
          <p className="mono-label">Education · {education.period}</p>
          <h4 className="mt-3 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.025em]">
            {education.degree}
          </h4>
          <p className="mt-2 text-sm text-muted">
            {education.institution}, {education.location}
          </p>
        </article>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8" aria-label="Certifications">
        {featured && (
          <li data-reveal className="sm:col-span-2">
            <CertCard cert={featured} />
          </li>
        )}
        {rest.map((cert) => (
          <li data-reveal key={cert.name}>
            <CertCard cert={cert} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CertCard({ cert }: { cert: (typeof certifications)[number] }) {
  const featured = !!cert.featured;
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`grid h-12 min-w-12 place-items-center rounded-[10px] border px-2.5 font-mono text-sm font-semibold ${
          featured ? 'border-accent-ink/25 text-accent-ink' : 'border-line text-accent'
        }`}
      >
        {cert.mark}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`font-mono text-xs ${featured ? 'text-accent-ink/70' : 'text-muted'}`}>
          {featured ? 'Featured certification' : 'Certification'}
          {cert.year ? ` · ${cert.year}` : ''}
        </span>
        <span
          className={`font-display font-[620] leading-tight tracking-[-0.035em] ${
            featured ? 'text-[clamp(1.375rem,1.1rem+1vw,2rem)]' : 'text-[1.1875rem]'
          }`}
        >
          {cert.name}
        </span>
      </span>
    </>
  );
  const cls = `group flex h-full items-start gap-4 rounded-[14px] border p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 sm:p-6 ${
    featured ? 'on-accent border-accent bg-accent text-accent-ink' : 'border-line bg-surface hover:border-muted/60'
  }`;

  return cert.url ? (
    <a href={cert.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
      <span className="sr-only"> (verification, opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
