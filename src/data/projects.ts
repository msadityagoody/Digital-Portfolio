import type { Project } from './types';

/**
 * Descriptions are limited to what is documented in the résumé and brief.
 * No metrics, outcomes or links are claimed. Add `links` only with real URLs.
 */
export const projects: Project[] = [
  {
    id: 'bms-cloud',
    category: 'Platform',
    title: 'BMS Cloud / Smart Building Platform',
    year: '2026',
    context: 'Jupiter Brothers',
    summary:
      'A building-management platform with live dashboards, tariff billing, reporting, alerts and scheduled workflows.',
    problem:
      'Building and device data arrives continuously. Operators need it turned into live views, bills, reports and alerts they can act on.',
    work: [
      'Developed live dashboards, tariff billing, reports, alerts and scheduled workflows.',
      'Integrated a React/TypeScript frontend with FastAPI, PostgreSQL, Neo4j, Redis and MQTT for live data and backend services.',
    ],
    stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Neo4j', 'Redis', 'MQTT'],
    visual: 'bms',
  },
  {
    id: 'electrical-optimiser',
    category: 'Engineering automation',
    title: 'Electrical Optimiser & SLD Automation',
    year: '2026 — Present',
    context: 'Jupiter Brothers',
    summary:
      'Engineering automation for electrical networks: graph-based connections, CAD/DXF data, cable routing, interactive single-line diagrams and exportable drawings.',
    problem:
      'Panels, feeders and equipment are described in CAD drawings. Engineers need them as connected, validated data and as clear diagrams and drawings.',
    work: [
      'Worked on graph-based electrical networks, cable routing and CAD/DXF data for panels, feeders and equipment, including validation logic.',
      'Built interactive Single Line Diagram (SLD) views, panel schedules and exportable engineering drawings.',
    ],
    stack: ['Python', 'React', 'TypeScript', 'CAD/DXF', 'Graph data'],
    visual: 'sld',
  },
  {
    id: 'waypoint',
    category: 'Automation tool',
    title: 'Waypoint — Job Search Automation',
    year: '2026 — Present',
    summary: 'A job-search automation tool for collecting listings, matching roles and reviewing applications.',
    problem:
      'Searching for roles means repeating the same collection, filtering and tracking work across many listings and sites.',
    work: [
      'Built a React and FastAPI tool that collects listings, matches roles and supports reviewing applications.',
      'Used Playwright for browser automation, with the tool running in Docker.',
    ],
    stack: ['React', 'FastAPI', 'Playwright', 'Docker'],
    visual: 'waypoint',
  },
  {
    id: 'encrypted-chat',
    category: 'Security',
    title: 'End-to-End Encrypted Chat',
    year: '2024',
    summary: 'A real-time encrypted messaging application.',
    problem: 'Messages should travel in real time while staying unreadable to anyone outside the conversation.',
    work: [
      'Built real-time messaging over WebSockets in Python.',
      'Encrypted messages with AES and used SQLite for storage.',
    ],
    stack: ['Python', 'WebSockets', 'AES', 'SQLite'],
    visual: 'chat',
  },
  {
    id: 'hvac-extraction',
    category: 'Data extraction',
    title: 'HVAC Drawing Data Extraction',
    year: '2026',
    summary:
      'Processing DXF and PDF floor drawings into structured Excel datasets of rooms, equipment and duct connections.',
    problem:
      'Floor drawings show rooms, equipment and ducts visually, but downstream work needs that information as structured, tabular data.',
    work: [
      'Processed DXF/PDF floor drawings to map rooms, equipment and duct connections.',
      'Produced structured Excel datasets from the extracted drawing data.',
    ],
    stack: ['DXF', 'PDF', 'Excel'],
    stackLabel: 'Formats',
    visual: 'hvac',
  },
];
