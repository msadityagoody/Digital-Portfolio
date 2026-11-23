/**
 * Coordinates the intro loader with the hero entrance.
 * The intro plays once per browser session and never for reduced-motion users.
 */
const KEY = 'intro-seen';

function readSeen() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return true;
  }
}

export const shouldPlayIntro =
  typeof window !== 'undefined' &&
  !readSeen() &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

let resolveIntro: () => void = () => undefined;
export const introDone: Promise<void> = shouldPlayIntro
  ? new Promise((resolve) => {
      resolveIntro = resolve;
    })
  : Promise.resolve();

export function finishIntro() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable: intro simply plays again next visit */
  }
  resolveIntro();
}
