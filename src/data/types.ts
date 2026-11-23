export interface ExternalLink {
  label: string;
  href: string;
  /** Short display form, e.g. "github.com/user". */
  display: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  headline: { lead: string; accent: string };
  description: string;
  about: string[];
  current: { role: string; company: string };
  focus: string[];
  coreStack: string[];
  links: ExternalLink[];
  /**
   * Hero portrait. Place images in public/ and prefix their URLs with import.meta.env.BASE_URL.
   * While undefined, the hero shows a clearly labelled photo slot.
   */
  portrait?: { src: string; srcSet?: string; alt: string };
  /** Public path of the résumé PDF. Leave undefined to hide all résumé buttons. */
  resumeUrl?: string;
}

export type MilestoneKind = 'internship' | 'full-time';

/** One step in the career journey. Listed oldest first. */
export interface Experience {
  company: string;
  role: string;
  kind: MilestoneKind;
  /** Display dates, e.g. "Feb 2026". `end` omitted means Present. */
  start: string;
  end?: string;
  location: string;
  /** Shown on the rail before this milestone (e.g. a conversion to full-time). */
  transition?: string;
  note?: string;
  points: string[];
  stack?: string[];
}

export type ProjectVisual = 'bms' | 'sld' | 'waypoint' | 'chat' | 'hvac';

export interface Project {
  id: string;
  title: string;
  /** Short category tag shown on the visual. */
  category: string;
  year: string;
  /** Where the work happened, only where documented. */
  context?: string;
  summary: string;
  problem: string;
  work: string[];
  stack: string[];
  /** Label for the stack list (e.g. "Formats" when no tech stack is documented). */
  stackLabel?: string;
  visual: ProjectVisual;
  links?: ExternalLink[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface CoreSkill {
  name: string;
  category: string;
  /** Other spellings used in project/experience stacks (e.g. "DXF" for "CAD/DXF"). */
  aliases?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

export interface Certification {
  name: string;
  /** Short text monogram (no logos or badge images). */
  mark: string;
  year?: string;
  featured?: boolean;
  /** Add only a real verification URL. */
  url?: string;
}
