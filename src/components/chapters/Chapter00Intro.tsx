import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { personalData } from '../../data/personal';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { MangaButton } from '../manga/MangaButton';
import { DraggablePanel } from '../manga/DraggablePanel';

interface Chapter00IntroProps {
  onEnter: () => void;
}

export function Chapter00Intro({ onEnter }: Chapter00IntroProps) {
  const discoveredTalismans = usePortfolioStore((s) => s.discoveredTalismans);
  const lastTalismanNote = usePortfolioStore((s) => s.lastTalismanNote);
  const discoverTalisman = usePortfolioStore((s) => s.discoverTalisman);
  const [charmIndex, setCharmIndex] = useState(0);

  const handleKeyboardInspectCharm = () => {
    const fallbackNotes = [
      { id: 'ofuda-01', note: 'Seal 01: Crafted by Basiturraza Taji — BCA Graduate, RTMNU 2026.' },
      { id: 'ofuda-02', note: 'Seal 02: Modular TypeScript, React, and real-time Three.js lighting.' },
      { id: 'ofuda-03', note: 'Seal 03: Every chapter unfolds in a continuous 3D manga corridor.' },
      { id: 'ofuda-04', note: 'Seal 04: Built with accessible semantics, clean fallbacks, and zero bloat.' },
    ];
    const current = fallbackNotes[charmIndex % fallbackNotes.length];
    discoverTalisman(current.id, current.note);
    setCharmIndex((i) => i + 1);
  };

  return (
    <section
      aria-label="Chapter 00: Supernatural School Hallway Introduction"
      data-state="intro"
      className="pointer-events-none relative flex min-h-screen w-full flex-col justify-between overflow-hidden text-[#FFF9F1]"
    >
      {/* Top minimal bar */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 pt-6 sm:px-8">
        <DraggablePanel className="pointer-events-auto" label="Chapter 00 Badge">
          <div className="border-2 border-[#E8BFC9] bg-[#301B29]/95 px-3.5 py-1.5 shadow-[3px_3px_0_#211E25]">
            <span className="font-mono-tabular text-xs font-semibold tracking-[0.16em] text-[#E8BFC9]">
              CHAPTER 00 · PROLOGUE
            </span>
          </div>
        </DraggablePanel>

        <button
          type="button"
          onClick={onEnter}
          className="pointer-events-auto inline-flex min-h-[40px] items-center border-2 border-[#F6EBDD]/70 bg-[#211E25]/95 px-4 py-1.5 text-xs font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#B84955] hover:bg-[#632D40] cursor-pointer whitespace-nowrap"
        >
          Skip Intro
        </button>
      </div>

      {/* Bottom-left atmospheric interaction prompt (leaves 3D corridor center clear) */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-end px-5 pb-32 pt-10 sm:px-8 sm:pb-36">
        <DraggablePanel className="pointer-events-auto max-w-2xl" label="Chapter 00 Prologue Card">
          <div className="border-2 border-[#211E25] bg-[#FFF9F1]/96 p-6 text-[#211E25] shadow-[8px_8px_0_#B84955] sm:p-8">
            <p className="font-mono-tabular text-xs font-semibold tracking-[0.16em] text-[#B84955]">
              {personalData.name} · {personalData.title}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#211E25] sm:text-5xl">
              {personalData.introHeading}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#301B29] sm:text-base">
              {personalData.introSubheading}
            </p>

            {/* Discovered 3D Talisman Feedback */}
            <div className="mt-4 border border-dashed border-[#632D40]/45 bg-[#F6EBDD] px-4 py-2.5 text-xs text-[#301B29]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-[#632D40]">
                  {lastTalismanNote ??
                    'Drag this card aside, drag background to look, use WASD to walk, or click 3D charms & Teru doll.'}
                </span>
                <span className="font-mono-tabular text-[#632D40]">
                  {discoveredTalismans.length}/4 seals read
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <MangaButton variant="primary" size="lg" onClick={onEnter}>
                Enter Portfolio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </MangaButton>

              <MangaButton
                variant="secondary"
                size="md"
                onClick={handleKeyboardInspectCharm}
              >
                <Sparkles className="h-4 w-4 text-[#B84955]" aria-hidden="true" />
                Inspect Paper Charm
              </MangaButton>
            </div>
          </div>
        </DraggablePanel>
      </div>
    </section>
  );
}
