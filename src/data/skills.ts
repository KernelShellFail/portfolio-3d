export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend Technologies'
  | 'Backend Technologies'
  | 'Databases'
  | 'Development Tools'
  | 'Other Technical Skills';

export interface SkillCardItem {
  id: string;
  name: string;
  category: SkillCategory;
  cardCode: string;
  summary: string;
  focusArea: string;
  isTemplateEntry?: boolean;
}

export const skillCategories: SkillCategory[] = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend Technologies',
  'Databases',
  'Development Tools',
  'Other Technical Skills',
];

/**
 * Editable collectible ability cards.
 * Note: Per portfolio guidelines, no fabricated proficiency percentages or experience years are shown.
 * Update or customize entries in src/data/skills.ts to match your exact stack.
 */
export const skillsData: SkillCardItem[] = [
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'Programming Languages',
    cardCode: 'ARCANA · 01',
    summary: 'Static type modeling, discriminated unions, and type-safe application state.',
    focusArea: 'Application Architecture',
  },
  {
    id: 'js',
    name: 'JavaScript (ES2022+)',
    category: 'Programming Languages',
    cardCode: 'ARCANA · 02',
    summary: 'Asynchronous control flow, DOM APIs, and modular browser execution.',
    focusArea: 'Core Web Runtime',
  },
  {
    id: 'java-cpp',
    name: 'Java & C++',
    category: 'Programming Languages',
    cardCode: 'ARCANA · 03',
    summary: 'Object-oriented principles, data structures, and algorithmic foundations from BCA coursework.',
    focusArea: 'Computer Science Core',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages',
    cardCode: 'ARCANA · 04',
    summary: 'Clean scripting, backend prototyping, and structured problem solving.',
    focusArea: 'Scripting & Logic',
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend Technologies',
    cardCode: 'SEAL · 01',
    summary: 'Modular hooks, component composition, accessible forms, and SPA routing.',
    focusArea: 'Interactive Interfaces',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS & Custom CSS',
    category: 'Frontend Technologies',
    cardCode: 'SEAL · 02',
    summary: 'Design-token theming, responsive grids, print-inspired frames, and reduced-motion styling.',
    focusArea: 'Visual Systems',
  },
  {
    id: 'threejs',
    name: 'Three.js & WebGL',
    category: 'Frontend Technologies',
    cardCode: 'SEAL · 03',
    summary: 'Procedural geometry, lighting rigs, camera damping, raycasting, and fallback handling.',
    focusArea: '3D Browser Environments',
  },
  {
    id: 'animation',
    name: 'GSAP, Motion & Lenis',
    category: 'Frontend Technologies',
    cardCode: 'SEAL · 04',
    summary: 'Scroll-triggered choreography, smooth scrolling, and compositor-safe transitions.',
    focusArea: 'Motion Craft',
  },
  {
    id: 'node',
    name: 'Node.js & Express',
    category: 'Backend Technologies',
    cardCode: 'BOUND · 01',
    summary: 'REST endpoint structure, request validation, middleware composition, and Vite integration.',
    focusArea: 'Server Runtime',
  },
  {
    id: 'rest',
    name: 'REST API Design',
    category: 'Backend Technologies',
    cardCode: 'BOUND · 02',
    summary: 'Predictable JSON contracts, HTTP status handling, and form submission pipelines.',
    focusArea: 'Service Contracts',
  },
  {
    id: 'sql',
    name: 'SQL & Relational Modeling',
    category: 'Databases',
    cardCode: 'ARCHIVE · 01',
    summary: 'Normalized schemas, joins, constraints, and query fundamentals learned during BCA.',
    focusArea: 'Structured Storage',
  },
  {
    id: 'nosql',
    name: 'Document & Local Persistence',
    category: 'Databases',
    cardCode: 'ARCHIVE · 02',
    summary: 'JSON document structures, client state persistence, and schema validation.',
    focusArea: 'Flexible Data',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Development Tools',
    cardCode: 'TOOL · 01',
    summary: 'Branching workflows, clean commit history, and collaborative code review.',
    focusArea: 'Version Control',
  },
  {
    id: 'vite',
    name: 'Vite & Modern Tooling',
    category: 'Development Tools',
    cardCode: 'TOOL · 02',
    summary: 'Fast module bundling, TypeScript checking, code splitting, and asset optimization.',
    focusArea: 'Build Pipeline',
  },
  {
    id: 'testing',
    name: 'Unit & Browser Testing',
    category: 'Development Tools',
    cardCode: 'TOOL · 03',
    summary: 'Pure logic unit assertions and end-to-end browser verification workflows.',
    focusArea: 'Quality Control',
  },
  {
    id: 'a11y-seo',
    name: 'Accessibility & Technical SEO',
    category: 'Other Technical Skills',
    cardCode: 'CRAFT · 01',
    summary: 'Semantic landmarks, keyboard focus states, OpenGraph cards, and structured JSON-LD.',
    focusArea: 'Web Standards',
  },
];
