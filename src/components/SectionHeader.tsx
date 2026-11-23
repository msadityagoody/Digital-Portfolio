import type { ReactNode } from 'react';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: 'default' | 'accent';
}

export function SectionHeader({ index, label, title, intro, id, tone = 'default' }: SectionHeaderProps) {
  const muted = tone === 'accent' ? 'text-accent-ink/70' : 'text-muted';
  return (
    <header className="grid gap-6 md:grid-cols-12 md:gap-8">
      <p data-reveal className={`marker md:col-span-3 ${tone === 'accent' ? 'text-accent-ink' : ''}`}>
        <span>
          {label}
          <span aria-hidden="true" className={tone === 'accent' ? 'text-accent-ink/50' : 'text-muted'}>
            {' '}
            · {index}
          </span>
        </span>
      </p>
      <div className="md:col-span-9">
        <h2 id={id} data-reveal className="h2">
          {title}
        </h2>
        {intro && (
          <p data-reveal className={`mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed ${muted}`}>
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
