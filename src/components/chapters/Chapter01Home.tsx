import { useState } from 'react';
import { ArrowDownRight, FolderOpen, Mail, RotateCcw } from 'lucide-react';
import { personalData } from '../../data/personal';
import { MangaPage } from '../manga/MangaPage';
import { CharacterCard } from '../manga/CharacterCard';
import { SpeechBubble } from '../manga/SpeechBubble';
import { MangaButton } from '../manga/MangaButton';
import { MangaPanel } from '../manga/MangaPanel';
import { DraggablePanel } from '../manga/DraggablePanel';

interface Chapter01HomeProps {
  onNavigateChapter: (chapterId: string) => void;
  onReplayIntro: () => void;
}

export function Chapter01Home({
  onNavigateChapter,
  onReplayIntro,
}: Chapter01HomeProps) {
  const [activeBubbleIndex, setActiveBubbleIndex] = useState(0);
  const currentBubble = personalData.speechBubbles[activeBubbleIndex];

  return (
    <MangaPage id="home" tone="cream" ariaLabelledBy="hero-heading" className="pt-12 md:pt-16">
      {/* Split-Screen Manga Hero floating in 3D Classroom Station */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Developer Identity & Interactive Speech Bubbles */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-7">
          <MangaPanel variant="warm" interactive className="p-6 sm:p-8">
            <p className="font-mono-tabular text-xs font-semibold tracking-[0.18em] text-[#632D40]">
              CHAPTER 01 · OPENING SPREAD
            </p>

            <h1
              id="hero-heading"
              className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-[#211E25] sm:text-5xl lg:text-[3.4rem]"
            >
              {personalData.name}
            </h1>

            <p className="mt-2 text-lg font-semibold text-[#B84955] sm:text-xl">
              {personalData.title} · {personalData.status}
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#301B29]">
              {personalData.heroSummary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <MangaButton
                variant="primary"
                size="lg"
                onClick={() => onNavigateChapter('projects')}
              >
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                View Projects
              </MangaButton>

              <MangaButton
                variant="secondary"
                size="lg"
                onClick={() => onNavigateChapter('contact')}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact Me
              </MangaButton>

              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-xs font-semibold text-[#632D40] underline decoration-[#632D40]/40 underline-offset-4 hover:text-[#B84955] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Revisit 3D Corridor
              </button>
            </div>
          </MangaPanel>

          {/* Interactive Manga Speech Bubble Panel */}
          <div className="pointer-events-auto">
            <DraggablePanel className="mb-3 inline-block" label="Introduction Note Tabs">
              <div
                className="flex flex-wrap items-center gap-2 pr-7"
                role="tablist"
                aria-label="Developer introduction notes"
              >
                {personalData.speechBubbles.map((bubble, idx) => {
                  const selected = idx === activeBubbleIndex;
                  return (
                    <button
                      key={bubble.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveBubbleIndex(idx)}
                      className={`min-h-[40px] border-2 border-[#211E25] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#632D40] text-[#FFF9F1] shadow-[3px_3px_0_#211E25]'
                          : 'bg-[#FFF9F1]/95 text-[#211E25] hover:bg-[#E8BFC9]'
                      }`}
                    >
                      {bubble.speaker}
                    </button>
                  );
                })}
              </div>
            </DraggablePanel>

            <SpeechBubble
              key={currentBubble.id}
              speaker={currentBubble.speaker}
              annotation={currentBubble.annotation}
              variant="warm"
              tail="bottom-left"
            >
              <p>{currentBubble.text}</p>
            </SpeechBubble>
          </div>
        </div>

        {/* Right Column: Original 3D-Tilt Developer Illustration Card */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <CharacterCard
            imageUrl={personalData.portraitUrl}
            imageAlt={personalData.portraitAlt}
            name={personalData.name}
            role="Software Developer"
            caption="BCA · RTMNU 2026"
            className="h-full"
          />
        </div>
      </div>

      {/* Full-width 3-column summary panels below Hero Split */}
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        <MangaPanel variant="warm" tilt="subtle-left" interactive>
          <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B84955]">
            ACADEMIC CREDENTIAL
          </p>
          <p className="mt-2 font-display text-xl font-bold text-[#211E25]">
            Bachelor of Computer Applications
          </p>
          <p className="mt-1 text-sm text-[#4A3B45]">
            RTMNU · Class of 2026
          </p>
        </MangaPanel>

        <MangaPanel variant="dark" interactive>
          <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#E8BFC9]">
            PRIMARY DISCIPLINE
          </p>
          <p className="mt-2 font-display text-xl font-bold text-[#FFF9F1]">
            Frontend, Full-Stack & 3D Web
          </p>
          <p className="mt-1 text-sm text-[#E8BFC9]">
            TypeScript · React · Three.js · Node.js
          </p>
        </MangaPanel>

        <MangaPanel variant="warm" tilt="subtle-right" interactive>
          <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B84955]">
            NEXT CHAPTER
          </p>
          <p className="mt-2 font-display text-xl font-bold text-[#211E25]">
            Fresh Graduate Seeking Roles
          </p>
          <button
            type="button"
            onClick={() => onNavigateChapter('about')}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#632D40] underline decoration-[#B84955] underline-offset-4 hover:text-[#B84955] cursor-pointer"
          >
            Read Character Profile
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </MangaPanel>
      </div>
    </MangaPage>
  );
}
