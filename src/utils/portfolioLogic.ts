import type { SkillCardItem, SkillCategory } from '../data/skills';
import type { ProjectCategory, ProjectEpisodeItem } from '../data/projects';

export type AtmosphereMood = 'twilight' | 'moonlight' | 'supernatural' | 'sakura';

export interface ChapterStation {
  id: 'intro' | 'home' | 'about' | 'skills' | 'projects' | 'timeline' | 'contact';
  label: string;
  targetZ: number;
  scrollStop: number;
}

export const CHAPTER_STATIONS: ChapterStation[] = [
  { id: 'intro', label: '00 · Corridor', targetZ: 5.2, scrollStop: 0 },
  { id: 'home', label: '01 · Classroom', targetZ: -14, scrollStop: 0 },
  { id: 'about', label: '02 · Astrolabe', targetZ: -32, scrollStop: 0.2 },
  { id: 'skills', label: '03 · Relics', targetZ: -50, scrollStop: 0.4 },
  { id: 'projects', label: '04 · Episodes', targetZ: -68, scrollStop: 0.6 },
  { id: 'timeline', label: '05 · Torii Path', targetZ: -86, scrollStop: 0.8 },
  { id: 'contact', label: '06 · Moon Shrine', targetZ: -104, scrollStop: 1 },
];

export interface AtmosphereTheme {
  id: AtmosphereMood;
  label: string;
  bgHex: string;
  fogHex: string;
  fogDensity: number;
  keyColor: string;
  keyIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  lanternColor: string;
}

export const ATMOSPHERE_THEMES: Record<AtmosphereMood, AtmosphereTheme> = {
  twilight: {
    id: 'twilight',
    label: 'Twilight Amber',
    bgHex: '#271522',
    fogHex: '#271522',
    fogDensity: 0.024,
    keyColor: '#FFC79E',
    keyIntensity: 1.55,
    hemiSky: '#A9BBCF',
    hemiGround: '#301B29',
    hemiIntensity: 0.92,
    lanternColor: '#FFB37B',
  },
  moonlight: {
    id: 'moonlight',
    label: 'Moonlit Dusk',
    bgHex: '#181E2C',
    fogHex: '#181E2C',
    fogDensity: 0.023,
    keyColor: '#C4D9F5',
    keyIntensity: 1.48,
    hemiSky: '#98B4D8',
    hemiGround: '#211E25',
    hemiIntensity: 0.96,
    lanternColor: '#E8BFC9',
  },
  supernatural: {
    id: 'supernatural',
    label: 'Crimson Spirit',
    bgHex: '#23101B',
    fogHex: '#23101B',
    fogDensity: 0.025,
    keyColor: '#F39CB2',
    keyIntensity: 1.45,
    hemiSky: '#E8BFC9',
    hemiGround: '#1E1118',
    hemiIntensity: 0.88,
    lanternColor: '#FF6B7E',
  },
  sakura: {
    id: 'sakura',
    label: 'Sakura Dawn',
    bgHex: '#3A1F2E',
    fogHex: '#432535',
    fogDensity: 0.02,
    keyColor: '#FFD6E0',
    keyIntensity: 1.72,
    hemiSky: '#F8D7E3',
    hemiGround: '#4A2B3B',
    hemiIntensity: 1.08,
    lanternColor: '#FFE1C6',
  },
};

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(values: ContactFormValues): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }
  if (subject.length < 3) {
    errors.subject = 'Please add a short subject (at least 3 characters).';
  }
  if (message.length < 10) {
    errors.message = 'Please write a message of at least 10 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterSkillsByCategory(
  skills: SkillCardItem[],
  category: SkillCategory | 'All',
): SkillCardItem[] {
  if (category === 'All') return skills;
  return skills.filter((item) => item.category === category);
}

export function filterProjectsByCategory(
  projects: ProjectEpisodeItem[],
  category: ProjectCategory,
): ProjectEpisodeItem[] {
  if (category === 'All') return projects;
  return projects.filter((item) => item.category === category);
}

export function shouldAutostartFromSearch(search: string): boolean {
  if (!search) return false;
  const params = new URLSearchParams(search);
  return params.get('autostart') === '1';
}

export function computeHallwayScrollProgress(
  scrollY: number,
  docHeight: number,
  viewportHeight: number,
): number {
  const scrollable = Math.max(1, docHeight - viewportHeight);
  return Math.min(1, Math.max(0, scrollY / scrollable));
}

export function computeWorldCameraTargetZ(
  introCompleted: boolean,
  scrollProgress: number,
): number {
  if (!introCompleted) return 5.2;
  const clamped = Math.min(1, Math.max(0, scrollProgress));
  // Travel smoothly from Chapter 01 (z = -14) through Chapter 06 (z = -104)
  return -14 - clamped * 90;
}

export function getAtmosphereTheme(mood: AtmosphereMood): AtmosphereTheme {
  return ATMOSPHERE_THEMES[mood] ?? ATMOSPHERE_THEMES.twilight;
}

export function getStationForChapter(chapterId: string): ChapterStation {
  return (
    CHAPTER_STATIONS.find((s) => s.id === chapterId) ?? CHAPTER_STATIONS[1]
  );
}

export function getNextStationChapterId(
  currentChapterId: string,
  direction: 1 | -1,
): ChapterStation['id'] {
  const navigable = CHAPTER_STATIONS.slice(1); // home..contact
  const idx = navigable.findIndex((s) => s.id === currentChapterId);
  const safeIdx = idx === -1 ? 0 : idx;
  const nextIdx = (safeIdx + direction + navigable.length) % navigable.length;
  return navigable[nextIdx].id;
}

export function shouldStartPanelDrag(
  dx: number,
  dy: number,
  thresholdPx = 6,
): boolean {
  return Math.hypot(dx, dy) >= thresholdPx;
}

export function clampPanelDragOffset(
  x: number,
  y: number,
  maxOffsetX = 1200,
  maxOffsetY = 900,
): { x: number; y: number } {
  return {
    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, x)),
    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, y)),
  };
}

export interface ChapterRevealState {
  phase: 'before' | 'active' | 'after';
  opacity: number;
  translateY: number;
  scale: number;
}

export function computeChapterRevealState(
  rectTop: number,
  rectBottom: number,
  viewportHeight: number,
): ChapterRevealState {
  const vh = Math.max(1, viewportHeight);
  const enterEdge = vh * 0.88;
  const exitEdge = vh * 0.14;

  // Section has not scrolled up into the active reading zone yet
  if (rectTop > enterEdge) {
    const dist = Math.min(1, (rectTop - enterEdge) / (vh * 0.35));
    return {
      phase: 'before',
      opacity: Number((1 - dist * 0.92).toFixed(3)),
      translateY: Math.round(dist * 46),
      scale: Number((1 - dist * 0.045).toFixed(3)),
    };
  }

  // Section has scrolled past the reading zone above the viewport
  if (rectBottom < exitEdge) {
    const dist = Math.min(1, (exitEdge - rectBottom) / (vh * 0.35));
    return {
      phase: 'after',
      opacity: Number((1 - dist * 0.92).toFixed(3)),
      translateY: Math.round(-dist * 38),
      scale: Number((1 - dist * 0.045).toFixed(3)),
    };
  }

  return {
    phase: 'active',
    opacity: 1,
    translateY: 0,
    scale: 1,
  };
}
