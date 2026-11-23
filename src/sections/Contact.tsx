import { useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { profile } from '../data/profile';
import { ButtonLink } from '../components/ButtonLink';
import { useReveal } from '../hooks/useReveal';

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(root);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-30%] left-[-10%] -z-10 size-[40rem] rounded-full bg-accent/[0.06] blur-[120px]" />
      <div className="container-x">
        <p data-reveal className="marker">
          <span>
            Contact<span aria-hidden="true" className="text-muted"> · 05</span>
          </span>
        </p>
        <h2
          id="contact-title"
          data-reveal
          className="display mt-6 max-w-[14ch] text-[clamp(2.75rem,1rem+6.5vw,7rem)] [text-wrap:balance]"
        >
          Let&rsquo;s build something <span className="text-accent">together.</span>
        </h2>
        <p data-reveal className="mt-8 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
          The quickest way to reach me is email. I&rsquo;m also on GitHub, LinkedIn and LeetCode.
        </p>

        <div data-reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-3 font-display text-[clamp(1.25rem,0.9rem+1.6vw,2.25rem)] font-medium tracking-[-0.03em] [overflow-wrap:anywhere]"
          >
            <span className="link-wipe">{profile.email}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-6 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-[10px] border border-line px-3.5 font-mono text-xs text-muted transition-colors duration-300 hover:border-muted hover:text-ink"
          >
            {copied ? <Check aria-hidden="true" className="size-3.5 text-accent" /> : <Copy aria-hidden="true" className="size-3.5" />}
            {copied ? 'Copied' : 'Copy email'}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>

        <div data-reveal className="mt-16 grid gap-8 border-t border-line pt-10 md:grid-cols-12">
          <ul className="grid gap-4 sm:grid-cols-3 md:col-span-8">
            {profile.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1.5 rounded-[12px] border border-line p-5 transition-colors duration-300 hover:border-muted hover:bg-surface"
                >
                  <span className="flex items-center justify-between text-ink">
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-muted transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </span>
                  <span className="truncate font-mono text-xs text-muted">{link.display}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {profile.resumeUrl && (
            <div className="md:col-span-4 md:flex md:items-start md:justify-end">
              <ButtonLink href={profile.resumeUrl} variant="ghost" icon="download" download="Aditya_MS_Resume.pdf">
                Download résumé (PDF)
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
