export interface TimelineEntry {
  id: string;
  period: string;
  kind: 'Education' | 'Milestone' | 'Placeholder';
  title: string;
  organization: string;
  description: string;
  highlights: string[];
  isPlaceholder?: boolean;
}

/**
 * Chronological storyline data (oldest to newest or newest to oldest).
 * Only verified facts (RTMNU BCA 2026, Fresh Graduate) are presented as factual;
 * internship/certification slots are explicitly marked as optional placeholders.
 */
export const experienceData: TimelineEntry[] = [
  {
    id: 'bca-start',
    period: '2023 — 2026',
    kind: 'Education',
    title: 'Bachelor of Computer Applications (BCA)',
    organization: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    description:
      'Completed undergraduate degree in Computer Applications, studying programming fundamentals, database management systems, web technologies, and software engineering principles.',
    highlights: [
      'Core coursework in programming, data structures, DBMS, and web application development.',
      'Graduated in 2026 as a fresh software development graduate.',
    ],
  },
  {
    id: 'independent-practice',
    period: '2025 — 2026',
    kind: 'Milestone',
    title: 'Independent Web & 3D Portfolio Engineering',
    organization: 'Self-Directed Development',
    description:
      'Focused on building production-grade frontend architectures with TypeScript, React, Three.js, and modern CSS design systems.',
    highlights: [
      'Explored WebGL scene composition, procedural textures, and accessible UI overlays.',
      'Practiced pure-logic unit testing and cross-viewport responsive verification.',
    ],
  },
  {
    id: 'internship-placeholder',
    period: '2026 — Present',
    kind: 'Placeholder',
    title: 'Next Chapter: Software Developer Role / Internship',
    organization: 'Open for Opportunities (Editable Slot)',
    description:
      '[Placeholder Entry] Add your first internship, freelance engagement, or verified certification in src/data/experience.ts when ready.',
    highlights: [
      'Fresh BCA graduate available for full-time junior developer or trainee engineering positions.',
    ],
    isPlaceholder: true,
  },
];
