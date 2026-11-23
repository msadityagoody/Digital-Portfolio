import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-4 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p>Built with React, TypeScript, Tailwind CSS &amp; GSAP</p>
        <a href="#top" className="group inline-flex items-center gap-2 text-ink">
          <span className="link-wipe">Back to top</span>
          <ArrowUp aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
