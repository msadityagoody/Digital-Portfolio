import { profile } from '../data/profile';
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { coreSkills } from '../data/skills';

export type TokenKind = 'str' | 'kw' | 'punc' | 'id';
export interface Glyph {
  ch: string;
  kind: TokenKind;
}

const q = (s: string) => JSON.stringify(s);

/**
 * The "source" behind the portrait: this site's own content data written out as code.
 * Nothing here is invented — it is generated from the typed data files.
 */
function sourceCode() {
  const journey = experience
    .map((e) => `{kind:${q(e.kind)},role:${q(e.role)},at:${q(e.company)},from:${q(e.start)},to:${q(e.end ?? 'present')}}`)
    .join(',');
  return [
    `export const engineer={name:${q(profile.name)},role:${q(profile.role)},based:${q(profile.location)},`,
    `core:[${coreSkills.map((s) => q(s.name)).join(',')}],`,
    `journey:[${journey}],`,
    `focus:[${profile.focus.map(q).join(',')}]} as const;`,
    `export const work=[${projects.map((p) => q(p.title)).join(',')}] as const;`,
  ].join('');
}

const KEYWORDS = /^(export|const|as|from|to)$/;

/** Tokenises the source into coloured glyphs (strings, keywords, punctuation, identifiers). */
export function sourceGlyphs(): Glyph[] {
  const src = sourceCode();
  const out: Glyph[] = [];
  const re = /("(?:[^"\\]|\\.)*")|([A-Za-z_]+)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const [tok, str, word, space] = m;
    if (space) continue; // dense stream, like minified source
    const kind: TokenKind = str ? 'str' : word ? (KEYWORDS.test(word) ? 'kw' : 'id') : 'punc';
    for (const ch of tok) out.push({ ch, kind });
  }
  return out;
}
