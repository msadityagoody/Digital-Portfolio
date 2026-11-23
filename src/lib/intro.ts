import { DESKTOP_MOTION } from './gsap';

const KEY = 'intro-seen';

function readSeen() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return true;
  }
}

const desktopMotion =
  typeof window !== 'undefined' &&
  window.matchMedia(DESKTOP_MOTION).matches;
export const shouldPlayIntro = desktopMotion && !readSeen();

type HeroEntrance = 'animate' | 'show';
const cancellation = new AbortController();
export const introCancelled = cancellation.signal;
let resolveIntro: (entrance: HeroEntrance) => void = () => undefined;
export const introDone: Promise<HeroEntrance> = shouldPlayIntro
  ? new Promise((resolve) => {
      resolveIntro = resolve;
    })
  : Promise.resolve(desktopMotion ? 'animate' : 'show');

export function finishIntro(entrance: HeroEntrance) {
  if (entrance === 'show') cancellation.abort();
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable: intro simply plays again next visit */
  }
  resolveIntro(entrance);
}
