import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';

type Icon = 'arrow' | 'down' | 'download' | 'none';

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  icon?: Icon;
  external?: boolean;
  download?: boolean | string;
  className?: string;
}

const icons = {
  arrow: ArrowUpRight,
  down: ArrowDown,
  download: Download,
} as const;

/** On hover the icon slides out and a copy slides in from the opposite side. */
const exitByIcon: Record<Exclude<Icon, 'none'>, { out: string; from: string }> = {
  arrow: {
    out: 'group-hover:translate-x-[230%] group-hover:-translate-y-[230%]',
    from: '-translate-x-[230%] translate-y-[230%] group-hover:translate-x-0 group-hover:translate-y-0',
  },
  down: { out: 'group-hover:translate-y-[230%]', from: '-translate-y-[230%] group-hover:translate-y-0' },
  download: { out: 'group-hover:translate-y-[230%]', from: '-translate-y-[230%] group-hover:translate-y-0' },
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  icon = 'arrow',
  external,
  download,
  className = '',
}: ButtonLinkProps) {
  const Icon = icon === 'none' ? null : icons[icon];
  const base =
    'group inline-flex h-[3.25rem] items-center gap-4 rounded-[12px] pl-5 text-[0.9375rem] font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98]';
  const styles =
    variant === 'primary'
      ? 'bg-accent text-accent-ink hover:bg-[#d6ff5c]'
      : 'border border-line bg-surface/60 text-ink hover:border-muted/60 hover:bg-raised';
  const box = variant === 'primary' ? 'bg-accent-ink text-accent' : 'bg-raised text-ink border border-line';

  return (
    <a
      href={href}
      className={`${base} ${styles} ${Icon ? 'pr-1.5' : 'pr-5'} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: download === true ? '' : download } : {})}
    >
      <span>{children}</span>
      {Icon && icon !== 'none' && (
        <span aria-hidden="true" className={`relative grid size-10 place-items-center overflow-hidden rounded-[9px] ${box}`}>
          <Icon
            className={`size-4 transition-transform duration-500 ease-[var(--ease-expo)] ${exitByIcon[icon].out}`}
            strokeWidth={2.2}
          />
          <Icon
            className={`absolute size-4 transition-transform duration-500 ease-[var(--ease-expo)] ${exitByIcon[icon].from}`}
            strokeWidth={2.2}
          />
        </span>
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
