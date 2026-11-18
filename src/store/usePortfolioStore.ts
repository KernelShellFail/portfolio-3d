import { create } from 'zustand';
import type { ProjectEpisodeItem } from '../data/projects';
import type { SkillCategory } from '../data/skills';
import type { AtmosphereMood } from '../utils/portfolioLogic';

export type ChapterId =
  | 'intro'
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'timeline'
  | 'contact';

interface PortfolioState {
  introCompleted: boolean;
  transitionActive: boolean;
  activeChapter: ChapterId;
  webglFallbackForced: boolean;
  webglSupported: boolean;
  atmosphereMood: AtmosphereMood;
  explore3DMode: boolean;
  petalsEnabled: boolean;
  firefliesEnabled: boolean;
  autoCameraDrift: boolean;
  audioChimesEnabled: boolean;
  bgmEnabled: boolean;
  deskLampToggled: boolean;
  foxShrineGlow: boolean;
  panelsResetSignal: number;
  draggedPanelsCount: number;
  discoveredTalismans: string[];
  lastTalismanNote: string | null;
  sceneInteractionNote: string | null;
  toggledLanternIds: string[];
  activeSkillCategory: SkillCategory | 'All';
  activeSkillId: string | null;
  hoveredProjectId: string | null;
  selectedProject: ProjectEpisodeItem | null;
  contactSentSignal: number;
  astrolabeBoostSignal: number;
  toriiChimeSignal: number;
  teruBounceSignal: number;
  craneBoostSignal: number;
  furinSignal: number;

  completeIntro: () => void;
  reopenIntro: () => void;
  setActiveChapter: (chapter: ChapterId) => void;
  setTransitionActive: (active: boolean) => void;
  setWebglSupported: (supported: boolean) => void;
  toggleWebglFallback: () => void;
  setAtmosphereMood: (mood: AtmosphereMood) => void;
  setExplore3DMode: (active: boolean) => void;
  toggleExplore3DMode: () => void;
  togglePetals: () => void;
  toggleFireflies: () => void;
  toggleAutoCameraDrift: () => void;
  toggleAudioChimes: () => void;
  setBgmEnabled: (enabled: boolean) => void;
  toggleBgm: () => void;
  toggleDeskLamp: () => void;
  toggleFoxShrineGlow: () => void;
  setDraggedPanelsDelta: (delta: number) => void;
  resetAllDraggedPanels: () => void;
  discoverTalisman: (id: string, note: string) => void;
  setSceneInteractionNote: (note: string | null) => void;
  toggleLantern: (id: string) => void;
  setAllLanternsCrimson: (crimson: boolean) => void;
  setActiveSkillCategory: (category: SkillCategory | 'All') => void;
  setActiveSkillId: (id: string | null) => void;
  setHoveredProjectId: (id: string | null) => void;
  setSelectedProject: (project: ProjectEpisodeItem | null) => void;
  triggerContactSentSignal: () => void;
  triggerAstrolabeBoost: () => void;
  triggerToriiChime: () => void;
  triggerTeruBounce: () => void;
  triggerCraneBoost: () => void;
  triggerFurinRing: () => void;
}

const ALL_LANTERN_IDS = ['lantern-01', 'lantern-02', 'lantern-03', 'lantern-04', 'lantern-05'];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  introCompleted: false,
  transitionActive: false,
  activeChapter: 'home',
  webglFallbackForced: false,
  webglSupported: true,
  atmosphereMood: 'twilight',
  explore3DMode: false,
  petalsEnabled: true,
  firefliesEnabled: true,
  autoCameraDrift: false,
  audioChimesEnabled: false,
  bgmEnabled: false,
  deskLampToggled: false,
  foxShrineGlow: false,
  panelsResetSignal: 0,
  draggedPanelsCount: 0,
  discoveredTalismans: [],
  lastTalismanNote: null,
  sceneInteractionNote: null,
  toggledLanternIds: [],
  activeSkillCategory: 'All',
  activeSkillId: null,
  hoveredProjectId: null,
  selectedProject: null,
  contactSentSignal: 0,
  astrolabeBoostSignal: 0,
  toriiChimeSignal: 0,
  teruBounceSignal: 0,
  craneBoostSignal: 0,
  furinSignal: 0,

  completeIntro: () => set({ introCompleted: true }),
  reopenIntro: () => set({ introCompleted: false, explore3DMode: false }),
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  setTransitionActive: (transitionActive) => set({ transitionActive }),
  setWebglSupported: (webglSupported) => set({ webglSupported }),
  toggleWebglFallback: () =>
    set((state) => ({ webglFallbackForced: !state.webglFallbackForced })),
  setAtmosphereMood: (atmosphereMood) => set({ atmosphereMood }),
  setExplore3DMode: (explore3DMode) => set({ explore3DMode }),
  toggleExplore3DMode: () =>
    set((state) => ({ explore3DMode: !state.explore3DMode })),
  togglePetals: () =>
    set((state) => ({ petalsEnabled: !state.petalsEnabled })),
  toggleFireflies: () =>
    set((state) => ({ firefliesEnabled: !state.firefliesEnabled })),
  toggleAutoCameraDrift: () =>
    set((state) => ({ autoCameraDrift: !state.autoCameraDrift })),
  toggleAudioChimes: () =>
    set((state) => ({ audioChimesEnabled: !state.audioChimesEnabled })),
  setBgmEnabled: (bgmEnabled) => set({ bgmEnabled }),
  toggleBgm: () =>
    set((state) => ({ bgmEnabled: !state.bgmEnabled })),
  toggleDeskLamp: () =>
    set((state) => ({ deskLampToggled: !state.deskLampToggled })),
  toggleFoxShrineGlow: () =>
    set((state) => ({ foxShrineGlow: !state.foxShrineGlow })),
  setDraggedPanelsDelta: (delta) =>
    set((state) => ({
      draggedPanelsCount: Math.max(0, state.draggedPanelsCount + delta),
    })),
  resetAllDraggedPanels: () =>
    set((state) => ({
      panelsResetSignal: state.panelsResetSignal + 1,
      draggedPanelsCount: 0,
      sceneInteractionNote: 'All 2D manga panels snapped back into formation.',
    })),
  discoverTalisman: (id, note) =>
    set((state) => ({
      discoveredTalismans: state.discoveredTalismans.includes(id)
        ? state.discoveredTalismans
        : [...state.discoveredTalismans, id],
      lastTalismanNote: note,
      sceneInteractionNote: note,
    })),
  setSceneInteractionNote: (sceneInteractionNote) => set({ sceneInteractionNote }),
  toggleLantern: (id) =>
    set((state) => {
      const exists = state.toggledLanternIds.includes(id);
      return {
        toggledLanternIds: exists
          ? state.toggledLanternIds.filter((item) => item !== id)
          : [...state.toggledLanternIds, id],
      };
    }),
  setAllLanternsCrimson: (crimson) =>
    set({
      toggledLanternIds: crimson ? ALL_LANTERN_IDS : [],
      sceneInteractionNote: crimson
        ? 'Ignited all corridor lanterns with Crimson Spirit flame.'
        : 'Restored all corridor lanterns to warm twilight amber.',
    }),
  setActiveSkillCategory: (activeSkillCategory) => set({ activeSkillCategory }),
  setActiveSkillId: (activeSkillId) => set({ activeSkillId }),
  setHoveredProjectId: (hoveredProjectId) => set({ hoveredProjectId }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  triggerContactSentSignal: () =>
    set((state) => ({ contactSentSignal: state.contactSentSignal + 1 })),
  triggerAstrolabeBoost: () =>
    set((state) => ({ astrolabeBoostSignal: state.astrolabeBoostSignal + 1 })),
  triggerToriiChime: () =>
    set((state) => ({ toriiChimeSignal: state.toriiChimeSignal + 1 })),
  triggerTeruBounce: () =>
    set((state) => ({ teruBounceSignal: state.teruBounceSignal + 1 })),
  triggerCraneBoost: () =>
    set((state) => ({ craneBoostSignal: state.craneBoostSignal + 1 })),
  triggerFurinRing: () =>
    set((state) => ({ furinSignal: state.furinSignal + 1 })),
}));
