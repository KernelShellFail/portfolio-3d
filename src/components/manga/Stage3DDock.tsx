import { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Eye,
  Flame,
  Flower2,
  Layers,
  Music,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import {
  ATMOSPHERE_THEMES,
  getNextStationChapterId,
  getStationForChapter,
  type AtmosphereMood,
} from '../../utils/portfolioLogic';
import { playSpiritChime } from '../../utils/soundEffects';

interface Stage3DDockProps {
  onNavigateChapter?: (chapterId: string) => void;
}

const moods: AtmosphereMood[] = ['twilight', 'moonlight', 'supernatural', 'sakura'];

export function Stage3DDock({ onNavigateChapter }: Stage3DDockProps) {
  const [collapsed, setCollapsed] = useState(true);

  const introCompleted = usePortfolioStore((s) => s.introCompleted);
  const activeChapter = usePortfolioStore((s) => s.activeChapter);
  const atmosphereMood = usePortfolioStore((s) => s.atmosphereMood);
  const setAtmosphereMood = usePortfolioStore((s) => s.setAtmosphereMood);
  const explore3DMode = usePortfolioStore((s) => s.explore3DMode);
  const toggleExplore3DMode = usePortfolioStore((s) => s.toggleExplore3DMode);
  const petalsEnabled = usePortfolioStore((s) => s.petalsEnabled);
  const togglePetals = usePortfolioStore((s) => s.togglePetals);
  const firefliesEnabled = usePortfolioStore((s) => s.firefliesEnabled);
  const toggleFireflies = usePortfolioStore((s) => s.toggleFireflies);
  const autoCameraDrift = usePortfolioStore((s) => s.autoCameraDrift);
  const toggleAutoCameraDrift = usePortfolioStore((s) => s.toggleAutoCameraDrift);
  const audioChimesEnabled = usePortfolioStore((s) => s.audioChimesEnabled);
  const toggleAudioChimes = usePortfolioStore((s) => s.toggleAudioChimes);
  const bgmEnabled = usePortfolioStore((s) => s.bgmEnabled);
  const toggleBgm = usePortfolioStore((s) => s.toggleBgm);
  const toggledLanternIds = usePortfolioStore((s) => s.toggledLanternIds);
  const setAllLanternsCrimson = usePortfolioStore((s) => s.setAllLanternsCrimson);
  const draggedPanelsCount = usePortfolioStore((s) => s.draggedPanelsCount);
  const resetAllDraggedPanels = usePortfolioStore((s) => s.resetAllDraggedPanels);
  const webglFallbackForced = usePortfolioStore((s) => s.webglFallbackForced);
  const toggleWebglFallback = usePortfolioStore((s) => s.toggleWebglFallback);
  const sceneInteractionNote = usePortfolioStore((s) => s.sceneInteractionNote);

  const currentStation = getStationForChapter(
    introCompleted ? activeChapter : 'intro',
  );
  const allCrimson = toggledLanternIds.length >= 4;

  const handleStepStation = (direction: 1 | -1) => {
    if (!onNavigateChapter) return;
    const nextId = getNextStationChapterId(activeChapter, direction);
    onNavigateChapter(nextId);
    playSpiritChime('seal', audioChimesEnabled);
  };

  const handleToggleAudio = () => {
    const next = !audioChimesEnabled;
    toggleAudioChimes();
    if (next) {
      playSpiritChime('bell', true);
    }
  };

  const handleResetPanels = () => {
    resetAllDraggedPanels();
    playSpiritChime('snap', audioChimesEnabled);
  };

  return (
    <aside
      aria-label="Interactive 3D scene controls"
      className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end sm:bottom-5 sm:right-6"
    >
      <div className="pointer-events-auto flex flex-col items-end">
        {/* Collapse / Expand Handle */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          className="inline-flex min-h-[34px] items-center gap-1.5 border-2 border-[#E8BFC9] bg-[#211E25]/96 px-3.5 py-1 text-[11px] font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#B84955] hover:bg-[#301B29] cursor-pointer whitespace-nowrap"
        >
          {collapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
              <span>
                3D Stage · {currentStation.label}
                {draggedPanelsCount > 0 ? ` · ${draggedPanelsCount} moved` : ''}
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
              <span>Hide 3D Controls</span>
            </>
          )}
        </button>

        {!collapsed && (
          <div className="mt-1.5 flex max-h-[46vh] max-w-[92vw] flex-col items-end gap-2 overflow-y-auto border-2 border-[#E8BFC9] bg-[#211E25]/96 px-3 py-2.5 text-xs text-[#FFF9F1] shadow-[5px_5px_0_#B84955] sm:max-h-none sm:px-4">
            {/* Row 1: Station Stepper & Atmosphere Moods */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {introCompleted && onNavigateChapter && (
                <div
                  role="group"
                  aria-label="3D corridor station stepper"
                  className="flex items-center gap-1"
                >
                  <button
                    type="button"
                    onClick={() => handleStepStation(-1)}
                    aria-label="Previous 3D station"
                    className="inline-flex min-h-[32px] items-center justify-center border border-[#E8BFC9]/45 bg-[#301B29] px-2 text-[#E8BFC9] hover:border-[#FFF9F1] cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="inline-flex min-h-[32px] items-center gap-1.5 border border-[#E8BFC9]/25 bg-[#301B29]/75 px-2.5 font-mono-tabular text-[11px] text-[#E8BFC9] whitespace-nowrap">
                    <Compass className="h-3.5 w-3.5 text-[#B84955]" aria-hidden="true" />
                    {currentStation.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepStation(1)}
                    aria-label="Next 3D station"
                    className="inline-flex min-h-[32px] items-center justify-center border border-[#E8BFC9]/45 bg-[#301B29] px-2 text-[#E8BFC9] hover:border-[#FFF9F1] cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div role="group" aria-label="3D lighting mood" className="flex flex-wrap items-center gap-1">
                {moods.map((m) => {
                  const active = atmosphereMood === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setAtmosphereMood(m);
                        playSpiritChime('lantern', audioChimesEnabled);
                      }}
                      className={`min-h-[32px] border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1]'
                          : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                      }`}
                    >
                      {ATMOSPHERE_THEMES[m].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Playful Interactive Toybox & 2D Panel Reset */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-[#E8BFC9]/20 pt-2">
              <button
                type="button"
                onClick={togglePetals}
                aria-pressed={petalsEnabled}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  petalsEnabled
                    ? 'border-[#FFF9F1] bg-[#632D40] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <Flower2 className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                Sakura Petals
              </button>

              <button
                type="button"
                onClick={toggleFireflies}
                aria-pressed={firefliesEnabled}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  firefliesEnabled
                    ? 'border-[#FFF9F1] bg-[#632D40] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                Spirit Wisps
              </button>

              <button
                type="button"
                onClick={() => {
                  setAllLanternsCrimson(!allCrimson);
                  playSpiritChime('lantern', audioChimesEnabled);
                }}
                aria-pressed={allCrimson}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  allCrimson
                    ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                {allCrimson ? 'Amber Flames' : 'Crimson Flames'}
              </button>

              <button
                type="button"
                onClick={toggleAutoCameraDrift}
                aria-pressed={autoCameraDrift}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  autoCameraDrift
                    ? 'border-[#FFF9F1] bg-[#632D40] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <Wind className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                Auto Float
              </button>

              <button
                type="button"
                onClick={handleToggleAudio}
                aria-pressed={audioChimesEnabled}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  audioChimesEnabled
                    ? 'border-[#FFF9F1] bg-[#632D40] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                {audioChimesEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                )}
                Chimes
              </button>

              <button
                type="button"
                onClick={toggleBgm}
                aria-pressed={bgmEnabled}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  bgmEnabled
                    ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <Music className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                {bgmEnabled ? 'Music On' : 'Music Off'}
              </button>

              <button
                type="button"
                onClick={handleResetPanels}
                className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  draggedPanelsCount > 0
                    ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1]'
                    : 'border-[#E8BFC9]/35 bg-[#301B29] text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset 2D Panels
                {draggedPanelsCount > 0 ? ` (${draggedPanelsCount})` : ''}
              </button>

              {introCompleted && (
                <button
                  type="button"
                  onClick={toggleExplore3DMode}
                  aria-pressed={explore3DMode}
                  className={`inline-flex min-h-[32px] items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    explore3DMode
                      ? 'border-[#FFF9F1] bg-[#632D40] text-[#FFF9F1]'
                      : 'border-[#E8BFC9]/45 bg-[#301B29] text-[#F6EBDD] hover:border-[#FFF9F1]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                  {explore3DMode ? 'Return to Panels' : 'Inspect Full 3D'}
                </button>
              )}

              <button
                type="button"
                onClick={toggleWebglFallback}
                className="inline-flex min-h-[32px] items-center gap-1.5 border border-[#E8BFC9]/45 bg-[#301B29] px-2.5 py-1 text-[11px] font-semibold text-[#F6EBDD] hover:border-[#FFF9F1] whitespace-nowrap cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-[#E8BFC9]" aria-hidden="true" />
                {webglFallbackForced ? 'Enable 3D' : '2D View'}
              </button>
            </div>
          </div>
        )}

        {/* Transient 3D Object Interaction Note */}
        {!collapsed && sceneInteractionNote && (
          <div
            role="status"
            aria-live="polite"
            className="mt-1.5 flex max-w-[92vw] items-center gap-2 border border-[#E8BFC9]/55 bg-[#211E25]/96 px-3 py-1 text-[11px] text-[#F6EBDD]"
          >
            <Sparkles className="h-3 w-3 shrink-0 text-[#E8BFC9]" aria-hidden="true" />
            <span className="truncate">{sceneInteractionNote}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
