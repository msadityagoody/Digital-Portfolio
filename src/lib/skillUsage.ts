import { experience } from '../data/experience';
import { projects } from '../data/projects';
import type { CoreSkill } from '../data/types';

/**
 * Where a skill appears, derived only from the project and experience data
 * (no invented years, levels or percentages).
 */
export function skillUsage(skill: CoreSkill): string[] {
  const names = [skill.name, ...(skill.aliases ?? [])].map((n) => n.toLowerCase());
  const has = (stack?: string[]) => !!stack?.some((t) => names.includes(t.toLowerCase()));

  const fromProjects = projects.filter((p) => has(p.stack)).map((p) => p.title);
  const fromRoles = experience
    .filter((e) => has(e.stack))
    .map((e) => `${e.role}, ${e.company.replace(' Pvt. Ltd.', '')}`);
  return [...fromRoles, ...fromProjects];
}
