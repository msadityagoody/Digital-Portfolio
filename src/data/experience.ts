import type { Certification, Education, Experience } from './types';

/** Oldest first: the journey builds towards the current role. */
export const experience: Experience[] = [
  {
    company: 'Edufic Digital',
    role: 'Generative AI Intern',
    kind: 'internship',
    start: 'Aug 2024',
    end: 'Nov 2024',
    location: 'Remote / Chennai',
    points: ['Developed AI-based workflow automation proofs of concept.'],
  },
  {
    company: 'Sharaa Info Developers',
    role: 'Cybersecurity Intern',
    kind: 'internship',
    start: 'Feb 2025',
    end: 'Apr 2025',
    location: 'Chennai, India',
    points: ['Automated log analysis and supported web application vulnerability testing.'],
  },
  {
    company: 'Jupiter Brothers Pvt. Ltd.',
    role: 'SDE Intern',
    kind: 'internship',
    start: 'Feb 2026',
    end: 'Jun 2026',
    location: 'Chennai, India',
    note: 'Joined Jupiter Brothers as a Software Development Engineer Intern.',
    points: [],
  },
  {
    company: 'Jupiter Brothers Pvt. Ltd.',
    role: 'Software Development Engineer',
    kind: 'full-time',
    start: 'Jul 2026',
    location: 'Chennai, India',
    transition: 'Converted to full-time · Jul 2026',
    points: [
      'Develop React/TypeScript interfaces and FastAPI services for building-management and engineering-automation products.',
      'Work on API integration, CAD/DXF data workflows, automated testing and Bitbucket CI/CD deployments using Docker and DigitalOcean.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Python',
      'FastAPI',
      'REST APIs',
      'PostgreSQL',
      'Neo4j',
      'Redis',
      'Docker',
      'CI/CD',
      'CAD/DXF',
    ],
  },
];

export const formatPeriod = (e: Pick<Experience, 'start' | 'end'>) => `${e.start} — ${e.end ?? 'Present'}`;

export const education: Education = {
  institution: 'Sathyabama Institute of Science and Technology',
  degree: 'B.E. Computer Science — Specialisation in Cyber Security',
  period: 'Sep 2022 — Feb 2026',
  location: 'Chennai, India',
};

export const certifications: Certification[] = [
  { name: 'SAP Certified — Joule Studio Developer', mark: 'SAP', year: '2026', featured: true },
  { name: 'Google Cybersecurity', mark: 'G', year: '2025' },
  { name: 'Red Hat Linux Essentials', mark: 'RH', year: '2025' },
  { name: 'AWS Cloud Essentials', mark: 'AWS', year: '2025' },
  { name: 'OCI Foundations', mark: 'OCI', year: '2025' },
];
