import { BellRing } from 'lucide-react';
import { experienceData } from '../../data/experience';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { MangaPage } from '../manga/MangaPage';
import { ChapterHeading } from '../manga/ChapterHeading';
import { MangaPanel } from '../manga/MangaPanel';
import { DraggablePanel } from '../manga/DraggablePanel';

export function Chapter05Timeline() {
  const triggerToriiChime = usePortfolioStore((s) => s.triggerToriiChime);
  const setSceneInteractionNote = usePortfolioStore((s) => s.setSceneInteractionNote);

  const handleChime = () => {
    triggerToriiChime();
    setSceneInteractionNote(
      'Torii Shrine Bell rung — red thread of milestones illuminated.',
    );
  };

  return (
    <MangaPage id="timeline" tone="dusk" ariaLabelledBy="timeline-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ChapterHeading
          id="timeline-heading"
          chapterNumber="CHAPTER 05 · STORYLINE CHRONICLE"
          title="Experience & Education"
          subtitle="A chronological thread linking the 3D Crimson Torii milestone lanterns to my academic foundation at RTMNU."
        />

        <DraggablePanel className="pointer-events-auto mb-10 md:mb-12" label="Torii Bell Action">
          <button
            type="button"
            onClick={handleChime}
            className="inline-flex min-h-[42px] items-center gap-2 border-2 border-[#211E25] bg-[#FFF9F1]/95 px-4 py-2 text-xs font-semibold text-[#211E25] shadow-[4px_4px_0_#B84955] hover:bg-[#E8BFC9] cursor-pointer whitespace-nowrap"
          >
            <BellRing className="h-4 w-4 text-[#B84955]" aria-hidden="true" />
            Ring 3D Torii Bell
          </button>
        </DraggablePanel>
      </div>

      {/* Red-String Storyline Container */}
      <div className="relative pl-8 sm:pl-12">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-3 w-[3px] bg-[#B84955] sm:left-5"
        />

        <ol className="space-y-8">
          {experienceData.map((entry) => (
            <li key={entry.id} className="relative">
              {/* Diamond Seal Node on Red String */}
              <span
                aria-hidden="true"
                className={`absolute -left-[27px] top-7 h-4 w-4 rotate-45 border-2 border-[#211E25] sm:-left-[35px] ${
                  entry.isPlaceholder ? 'bg-[#E8BFC9]' : 'bg-[#B84955]'
                }`}
              />

              <MangaPanel variant={entry.isPlaceholder ? 'cream' : 'warm'} interactive>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#211E25]/15 pb-3">
                  <span className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B84955]">
                    {entry.period}
                  </span>
                  <span className="text-xs font-medium text-[#632D40]">
                    {entry.kind}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-bold text-[#211E25]">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#632D40]">
                  {entry.organization}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-[#301B29]">
                  {entry.description}
                </p>

                <ul className="mt-4 space-y-1.5 text-sm text-[#211E25]">
                  {entry.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#632D40]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </MangaPanel>
            </li>
          ))}
        </ol>
      </div>
    </MangaPage>
  );
}
