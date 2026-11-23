import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import { profile } from '../data/profile';

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape or when resized to desktop.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !menu) return;
      const focusables = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 48rem)');
    const onMq = () => mq.matches && close(false);

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open, close]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? 'border-line bg-bg/75 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="container-x flex h-full items-center justify-between gap-6">
        <a
          href="#top"
          aria-label={`${profile.name}, back to top`}
          className="group flex items-center gap-1.5 font-display text-[1.1875rem] font-[620] tracking-[-0.04em]"
          onClick={() => open && close(false)}
        >
          {profile.name}
          <span aria-hidden="true" className="caret inline-block h-[0.95em] w-[0.42em] bg-accent" />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={`group flex items-baseline gap-1.5 font-mono text-[0.8125rem] font-medium transition-colors duration-300 hover:text-ink ${
                  active === item.id ? 'text-ink' : 'text-muted'
                }`}
              >
                <span aria-hidden="true" className="font-mono text-[0.6875rem] text-muted group-aria-[current=true]:text-accent">
                  0{i + 1}
                </span>
                <span className="link-wipe">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="group hidden h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-medium text-accent-ink transition-colors duration-300 hover:bg-ink md:inline-flex"
        >
          Get in touch
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-[10px] text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
        </button>
      </nav>
    </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block. */}
      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto bg-bg md:hidden"
        >
          <div className="container-x flex min-h-full flex-col justify-between gap-12 py-10">
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => close(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span aria-hidden="true" className="font-mono text-xs text-accent">
                      0{i + 1}
                    </span>
                    <span className="display text-[2.5rem]">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => close(false)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-accent px-5 font-medium text-accent-ink"
            >
              Get in touch <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
