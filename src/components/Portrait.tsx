import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { profile } from '../data/profile';
import { useSourceCanvas } from '../hooks/useSourceCanvas';

type Mode = 'off' | 'hover' | 'full';

/**
 * Hero portrait. With a photo: hovering reveals the "source" (this site's own data rendered
 * in the photo's light) through a window that follows the pointer; the toggle shows it in full.
 * Without a photo: a clearly labelled slot (no stock or generated imagery).
 */
export function Portrait() {
  const photo = profile.portrait;
  return photo ? <PhotoPortrait photo={photo} /> : <PlaceholderPortrait />;
}

function PhotoPortrait({ photo }: { photo: NonNullable<typeof profile.portrait> }) {
  const img = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const [mode, setMode] = useState<Mode>('off');
  const [prepareSource, setPrepareSource] = useState(false);
  useSourceCanvas(canvas, img, prepareSource);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    // Read currentTarget now: React clears it after the handler returns.
    const fig = e.currentTarget;
    if (mode === 'off') {
      setPrepareSource(true);
      setMode('hover');
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const l = layer.current;
      if (!l) return;
      const r = l.getBoundingClientRect();
      l.style.setProperty('--mx', `${clientX - r.left}px`);
      l.style.setProperty('--my', `${clientY - r.top}px`);
      const f = fig.getBoundingClientRect();
      if (label.current) label.current.style.transform = `translate(${clientX - f.left + 18}px, ${clientY - f.top - 12}px)`;
    });
  };
  const onLeave = () => mode === 'hover' && setMode('off');

  return (
    <figure
      data-portrait
      data-photo="true"
      className="group/portrait relative grid w-full overflow-hidden hero-wide:block hero-wide:h-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="relative col-start-1 row-start-1 aspect-[1122/1402] overflow-hidden hero-wide:absolute hero-wide:inset-0 hero-wide:aspect-auto">
        <div data-portrait-inner className="portrait-fade absolute inset-0 hero-wide:-inset-y-[6%]">
          <img
            ref={img}
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 80rem) and (hover: hover) and (pointer: fine) min(52vw, 46.8rem), min(calc(100vw - clamp(2.5rem, 8vw, 6rem)), 28rem, 48svh)"
            alt={photo.alt}
            width={1122}
            height={1402}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_22%]"
          />
          <div ref={layer} data-source-layer data-mode={mode} aria-hidden="true" className="source-layer absolute inset-0">
            <div className="absolute inset-0 bg-bg/80" />
            <canvas ref={canvas} data-source-canvas className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>

      {/* Pointer label (mouse only) */}
      <span
        ref={label}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 flex items-center gap-2 rounded-full bg-ink px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-accent-ink transition-opacity duration-200 ${
          mode === 'hover' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="size-1.5 rounded-full bg-accent-ink" />
        read source
      </span>

      {/* Toggle: works for keyboard and touch too */}
      <div data-portrait-card className="relative col-start-1 row-start-1 m-2 place-self-end hero-wide:absolute hero-wide:right-[var(--gutter)] hero-wide:top-6 hero-wide:m-0">
        <button
          type="button"
          aria-pressed={mode === 'full'}
          onClick={() => {
            setPrepareSource(true);
            setMode((m) => (m === 'full' ? 'off' : 'full'));
          }}
          className="group flex h-11 items-center gap-2.5 rounded-[12px] border border-line bg-bg/75 py-1 pl-1 pr-3.5 font-mono text-xs font-medium text-ink backdrop-blur-md transition-colors duration-300 hover:border-muted/60"
        >
          <span aria-hidden="true" className="grid h-full place-items-center rounded-[9px] bg-accent px-2 text-accent-ink">
            {'{ }'}
          </span>
          {mode === 'full' ? 'View photo' : 'View source'}
        </button>
      </div>

      <p
        data-portrait-card
        aria-hidden="true"
        className="absolute bottom-6 left-[34%] hidden font-mono text-[0.6875rem] text-muted hero-wide:block"
      >
        Move over the picture to read the source
      </p>

      <StatusCard className="relative mx-auto w-full max-w-[19rem] hero-wide:absolute hero-wide:bottom-[22%] hero-wide:right-[var(--gutter)]" />
    </figure>
  );
}

function PlaceholderPortrait() {
  return (
    <figure data-portrait className="relative h-full w-full overflow-hidden rounded-[20px] border border-line bg-surface">
      <div data-portrait-inner className="absolute -inset-y-[6%] inset-x-0">
        <div className="relative grid h-full w-full place-items-center pb-28 sm:pb-24">
          <div aria-hidden="true" className="hero-grid absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent_62%)]"
          />
          <div className="relative flex flex-col items-center gap-4 px-4 text-center">
            <span
              aria-hidden="true"
              className="display text-[clamp(4.5rem,3.5rem+5vw,9rem)] text-transparent [-webkit-text-stroke:1.5px_color-mix(in_oklab,var(--color-muted)_55%,transparent)]"
            >
              AM
            </span>
            <span className="rounded-full border border-dashed border-accent/50 bg-bg/80 px-4 py-1.5 font-mono text-xs text-ink">
              Photo placeholder — add public/portrait.webp
            </span>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent" />
      <StatusCard className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[min(20rem,calc(100%-2rem))]" />
    </figure>
  );
}

/** Factual details only. */
function StatusCard({ className }: { className: string }) {
  return (
    <figcaption
      data-portrait-card
      className={`rounded-[14px] border border-line bg-bg/80 p-4 font-mono text-xs backdrop-blur-md ${className}`}
    >
      <span className="flex items-center justify-between gap-4 text-muted">
        <span className="flex items-center gap-2 text-accent">
          <span className="pulse inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
          now
        </span>
        <span>{profile.location}</span>
      </span>
      <span className="mt-2.5 block text-[0.8125rem] text-ink">{profile.current.role}</span>
      <span className="mt-1 block text-muted">{profile.current.company}</span>
    </figcaption>
  );
}
