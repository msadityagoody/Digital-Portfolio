import type { CoreSkill, SkillGroup } from './types';

/** The technologies that represent the engineering work, shown as the main keyboard. */
export const coreSkills: CoreSkill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Neo4j', category: 'Graph database' },
  { name: 'Redis', category: 'Data store' },
  { name: 'Docker', category: 'Delivery' },
  { name: 'Playwright', category: 'Browser automation' },
  { name: 'CI/CD', category: 'Delivery' },
  { name: 'MQTT', category: 'Messaging' },
  { name: 'CAD/DXF', category: 'Engineering data', aliases: ['DXF'] },
];

/** Everything else from the résumé, grouped. No item repeats a core skill. */
export const supportingSkills: SkillGroup[] = [
  { title: 'Languages', items: ['JavaScript', 'Java', 'SQL'] },
  { title: 'Backend', items: ['Spring Boot', 'REST APIs', 'WebSockets'] },
  { title: 'Data', items: ['SQLite'] },
  { title: 'Delivery', items: ['Git', 'Bitbucket', 'DigitalOcean', 'SonarQube'] },
  { title: 'Other', items: ['Engineering automation'] },
];
