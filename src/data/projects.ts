export type ProjectCategory = 'All' | '3D & Interactive' | 'Full-Stack Web' | 'UI & Design Systems';

export interface ProjectEpisodeItem {
  id: string;
  episodeNumber: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  shortDescription: string;
  fullDetails: string[];
  technologies: string[];
  previewImage: string;
  previewAlt: string;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  isTemplatePlaceholder: boolean;
  placeholderNote: string;
}

/**
 * Editable Project Episodes.
 * Note: Replace the customizable template entries below in src/data/projects.ts
 * with your own verified repositories and live demo links. Null URLs are
 * intentionally rendered as honest non-clickable status notes rather than fake links.
 */
export const projectsData: ProjectEpisodeItem[] = [
  {
    id: 'kamome-corridor-portfolio',
    episodeNumber: 'EPISODE 01',
    title: 'Twilight School Hallway Portfolio',
    subtitle: '3D WebGL & Manga Interface Architecture',
    category: '3D & Interactive',
    shortDescription:
      'An interactive 3D supernatural school corridor built with Three.js, procedural textures, GSAP scroll choreography, and a reusable comic-panel design system.',
    fullDetails: [
      'Constructed a procedural Japanese wooden hallway using composite Three.js Groups, InstancedMesh dust motes, warm/cool lighting contrast, and RoomEnvironment reflections.',
      'Implemented raycasted interactive paper talismans, smooth exponential camera damping, and a full non-WebGL illustrated fallback for constrained devices.',
      'Structured all chapters through centralized TypeScript data files with accessible keyboard navigation and reduced-motion support.',
    ],
    technologies: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Lenis', 'Tailwind CSS'],
    previewImage: '/src/assets/images/project_episode_hallway_1794977553647.jpg',
    previewAlt: 'Painterly twilight Japanese school hallway illustration with warm lantern light',
    githubUrl: null,
    liveDemoUrl: null,
    isTemplatePlaceholder: true,
    placeholderNote: 'Personal showcase project — add your GitHub repository URL in src/data/projects.ts',
  },
  {
    id: 'study-blueprint-planner',
    episodeNumber: 'EPISODE 02',
    title: 'Arcane Study & Coursework Planner',
    subtitle: 'Customizable Academic Project Slot',
    category: 'Full-Stack Web',
    shortDescription:
      'A structured task, syllabus, and sprint tracker designed for university students organizing semester labs, notes, and revision milestones.',
    fullDetails: [
      '[Template Project Slot] Replace this episode with your BCA capstone or personal full-stack project in src/data/projects.ts.',
      'Built around clean relational state modeling, accessible form validation, and distraction-free editorial typography.',
      'Supports keyboard-first navigation, instant client-side filtering, and responsive mobile layouts.',
    ],
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'SQL'],
    previewImage: '/src/assets/images/project_episode_shrine_1794977554807.jpg',
    previewAlt: 'Painterly manga study desk with open technical notebooks and geometric wireframes',
    githubUrl: null,
    liveDemoUrl: null,
    isTemplatePlaceholder: true,
    placeholderNote: 'Template slot — replace with your own project details and GitHub URL in src/data/projects.ts',
  },
  {
    id: 'manga-panel-ui-kit',
    episodeNumber: 'EPISODE 03',
    title: 'Ink & Screentone Component Kit',
    subtitle: 'Customizable Design System Slot',
    category: 'UI & Design Systems',
    shortDescription:
      'A modular library of comic panels, speech bubbles, halftone textures, and accessible dialog drawers inspired by print manga layouts.',
    fullDetails: [
      '[Template Project Slot] Replace this episode with your UI library, CLI tool, or frontend project in src/data/projects.ts.',
      'Demonstrates strict separation of visual tokens (CSS custom properties), compositor-only transitions, and WCAG AA contrast discipline.',
      'Includes reusable panel grids, editorial chapter headings, and responsive card drawers.',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'SVG'],
    previewImage: '/src/assets/images/project_episode_archive_1794977555432.jpg',
    previewAlt: 'Mystical nocturnal library archive with hanging paper charms and red threads',
    githubUrl: null,
    liveDemoUrl: null,
    isTemplatePlaceholder: true,
    placeholderNote: 'Template slot — add your real GitHub repository and live link in src/data/projects.ts',
  },
];
