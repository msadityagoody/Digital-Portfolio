import type { ComponentType } from 'react';
import type { ProjectVisual as VisualKind } from '../../data/types';
import { BmsVisual, ChatVisual, HvacVisual, SldVisual, WaypointVisual } from './diagrams';

const DIAGRAMS: Record<VisualKind, ComponentType> = {
  bms: BmsVisual,
  sld: SldVisual,
  waypoint: WaypointVisual,
  chat: ChatVisual,
  hvac: HvacVisual,
};

const DESCRIPTIONS: Record<VisualKind, string> = {
  bms: 'Abstract diagram: building floors with sensors streaming over MQTT into an API and a live dashboard.',
  sld: 'Abstract single-line diagram: a supply feeding a main bus with breakers, feeders and panels.',
  waypoint: 'Abstract pipeline: listings are collected, matched and moved into a review queue.',
  chat: 'Abstract diagram: two clients exchanging encrypted packets over a WebSocket server backed by SQLite.',
  hvac: 'Abstract diagram: a floor plan with rooms, equipment and ducts mapped into a table.',
};

/**
 * Illustrative, original SVG artwork. Not a product screenshot — labelled as such on screen.
 */
export function ProjectVisual({ kind }: { kind: VisualKind }) {
  const Diagram = DIAGRAMS[kind];
  return (
    <figure className="flex h-full w-full flex-col gap-3">
      <svg
        viewBox="0 0 640 480"
        role="img"
        aria-label={DESCRIPTIONS[kind]}
        className="min-h-0 w-full flex-1"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <Diagram />
      </svg>
      <figcaption className="w-fit shrink-0 rounded-full border border-line bg-bg/80 px-3 py-1 font-mono text-[0.6875rem] text-muted">
        Illustrative diagram — not a screenshot
      </figcaption>
    </figure>
  );
}
