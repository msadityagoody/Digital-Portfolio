import type { Profile } from './types';

const base = import.meta.env.BASE_URL;

export const profile: Profile = {
  name: 'Aditya MS',
  role: 'Software Development Engineer',
  location: 'Chennai, India',
  email: 'msaditya2004@gmail.com',
  headline: {
    lead: 'Building software that connects complex systems with',
    accent: 'intuitive experiences.',
  },
  description:
    'Software Development Engineer working across full-stack applications, engineering automation, data processing and backend services.',
  about: [
    'I build full-stack applications and engineering automation tools with Python, FastAPI, React and TypeScript — working with REST APIs, graph databases, CAD data processing and CI/CD.',
    'My work spans data processing, APIs and the frontend, so I am used to tracing an issue through every layer of an application and checking that the final output is correct.',
    'I hold a B.E. in Computer Science with a specialisation in Cyber Security, and I care about the reliable backend services and delivery workflows that other parts of a product depend on.',
  ],
  current: { role: 'Software Development Engineer', company: 'Jupiter Brothers Pvt. Ltd.' },
  focus: ['Full-stack applications', 'Engineering automation', 'Backend services'],
  coreStack: ['Python', 'FastAPI', 'React', 'TypeScript'],
  links: [
    { label: 'GitHub', href: 'https://github.com/msadityagoody', display: 'github.com/msadityagoody' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/msadityagoody', display: 'linkedin.com/in/msadityagoody' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/msadityagoody', display: 'leetcode.com/u/msadityagoody' },
  ],
  portrait: {
    src: `${base}portrait.webp`,
    srcSet: `${base}portrait-640.webp 640w, ${base}portrait.webp 1122w`,
    alt: 'Black-and-white portrait of Aditya MS',
  },
  resumeUrl: `${base}resume.pdf`,
};
