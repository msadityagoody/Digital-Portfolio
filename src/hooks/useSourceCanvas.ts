import { useEffect, type RefObject } from 'react';
import { sourceGlyphs, type TokenKind } from '../lib/sourceText';

const COLORS: Record<TokenKind, string> = {
  str: '#c8f542',
  kw: '#a6c93a',
  punc: '#8f96a0',
  id: '#eeefe9',
};

/** Same crop as the <img>: object-fit cover, object-position 50% 22%. */
const POS_X = 0.5;
const POS_Y = 0.22;

/**
 * Renders the portrait as source code: each character cell takes its brightness from the photo.
 * Drawn once per size change (not per frame). Same-origin image, so pixel reads are allowed.
 */
export function useSourceCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const glyphs = sourceGlyphs();
    let raf = 0;
    let cancelled = false;
    // Sample from a plain copy of the image: with srcset, the <img>'s natural size is density-corrected
    // and no longer matches its pixel grid, which would misalign the drawing.
    let src: HTMLImageElement | null = null;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || !src?.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const fs = w < 520 ? 9.5 : 11.5;
      const cw = fs * 0.62;
      const ch = fs * 1.28;
      const cols = Math.ceil(w / cw);
      const rows = Math.ceil(h / ch);

      // Sample the visible crop of the photo at one pixel per character cell.
      const iw = src.naturalWidth;
      const ih = src.naturalHeight;
      const scale = Math.max(w / iw, h / ih);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (iw - sw) * POS_X;
      const sy = (ih - sh) * POS_Y;
      const sample = document.createElement('canvas');
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext('2d', { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(src, sx, sy, sw, sh, 0, 0, cols, rows);
      const px = sctx.getImageData(0, 0, cols, rows).data;

      // Normalise to the photo's own range (low-key portraits are mostly dark): 98th percentile = full white.
      const lums = new Float32Array(cols * rows);
      for (let k = 0; k < lums.length; k++) {
        const o = k * 4;
        lums[k] = (0.2126 * px[o]! + 0.7152 * px[o + 1]! + 0.0722 * px[o + 2]!) / 255;
      }
      const sorted = Float32Array.from(lums).sort();
      const white = Math.max(0.15, sorted[Math.floor(sorted.length * 0.98)] ?? 1);

      ctx.font = `500 ${fs}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      for (let r = 0, i = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const v = Math.min(1, lums[i]! / white);
          if (v < 0.07) continue;
          const g = glyphs[i % glyphs.length]!;
          ctx.globalAlpha = Math.min(1, Math.pow(v, 0.7) * 1.1);
          ctx.fillStyle = COLORS[g.kind];
          ctx.fillText(g.ch, c * cw, r * ch);
        }
      }
      ctx.globalAlpha = 1;
      canvas.dataset.rendered = 'true';
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => !cancelled && render());
    };

    const loaded = img.complete
      ? Promise.resolve()
      : new Promise<void>((res) => img.addEventListener('load', () => res(), { once: true }));
    loaded
      .then(() => {
        const copy = new Image();
        copy.decoding = 'async';
        copy.src = img.currentSrc || img.src; // already cached by the browser
        return copy.decode().then(() => {
          src = copy;
        });
      })
      .then(() => document.fonts.load('500 12px "JetBrains Mono Variable"'))
      .then(() => !cancelled && schedule())
      .catch(() => undefined);

    const ro = new ResizeObserver(schedule);
    ro.observe(canvas);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef, imgRef]);
}
