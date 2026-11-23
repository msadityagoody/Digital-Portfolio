import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** All motion is opt-in: it only runs when the user has not asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Same breakpoint as the `deck:` Tailwind variant in index.css. */
export const DECK_MQ = '(min-width: 64rem) and (min-height: 45rem)';

export const EASE = 'expo.out';

export { gsap, ScrollTrigger, SplitText, useGSAP };
