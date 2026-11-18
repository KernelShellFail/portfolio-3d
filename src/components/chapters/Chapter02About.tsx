import { GraduationCap, Compass, HeartHandshake, Orbit } from 'lucide-react';
import { personalData } from '../../data/personal';
import { educationData } from '../../data/education';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { MangaPage } from '../manga/MangaPage';
import { ChapterHeading } from '../manga/ChapterHeading';
import { ComicGrid } from '../manga/ComicGrid';
import { MangaPanel } from '../manga/MangaPanel';
import { Annotation } from '../manga/Annotation';
import { ComicDivider } from '../manga/ComicDivider';

export function Chapter02About() {
  const bca = educationData[0];
  const triggerAstrolabeBoost = usePortfolioStore((s) => s.triggerAstrolabeBoost);
  const setSceneInteractionNote = usePortfolioStore((s) => s.setSceneInteractionNote);

  const handleSpinAstrolabe = () => {
    triggerAstrolabeBoost();
    setSceneInteractionNote(
      'Spirit Astrolabe spun — harmonic rings aligned with RTMNU Class of 2026.',
    );
  };

  return (
    <MangaPage id="about" tone="warm-white" ariaLabelledBy="about-heading">
      <ChapterHeading
        id="about-heading"
        chapterNumber="CHAPTER 02 · CHARACTER DOSSIER"
        title="About Me"
        subtitle="An editorial character sheet introducing my software engineering background, academic training, and creative interests."
      />

      <ComicGrid columns="asymmetric">
        {/* Primary Biography Panel */}
        <div className="lg:col-span-7">
          <MangaPanel variant="cream" interactive className="h-full">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#211E25]/15 pb-3">
              <span className="font-mono-tabular text-xs font-semibold tracking-wider text-[#632D40]">
                PROFILE RECORD · {personalData.name}
              </span>
              <span className="text-xs font-medium text-[#B84955]">
                {personalData.status} · {personalData.location}
              </span>
            </div>

            <div className="space-y-4 text-base leading-relaxed text-[#211E25]">
              {personalData.biography.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <ComicDivider label="BACKGROUND" />

            <p className="text-sm leading-relaxed text-[#301B29]">
              {personalData.background}
            </p>

            <div className="mt-6 border-t border-[#211E25]/15 pt-4">
              <button
                type="button"
                onClick={handleSpinAstrolabe}
                className="inline-flex min-h-[40px] items-center gap-2 border-2 border-[#211E25] bg-[#FFF9F1] px-4 py-1.5 text-xs font-semibold text-[#211E25] shadow-[3px_3px_0_#632D40] hover:bg-[#E8BFC9] cursor-pointer whitespace-nowrap"
              >
                <Orbit className="h-3.5 w-3.5 text-[#B84955]" aria-hidden="true" />
                Spin 3D Spirit Astrolabe
              </button>
            </div>
          </MangaPanel>
        </div>

        {/* Right Side: Education, Interests & Career Goals */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <MangaPanel variant="warm" interactive>
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-[#B84955]" aria-hidden="true" />
              <div>
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#632D40]">
                  EDUCATION
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#211E25]">
                  {bca.degree}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#632D40]">
                  {bca.university}
                </p>
                <p className="mt-1 font-mono-tabular text-xs text-[#4A3B45]">
                  Graduation Year: {bca.graduationYear} · {bca.status}
                </p>
              </div>
            </div>
          </MangaPanel>

          <MangaPanel variant="warm" interactive>
            <div className="flex items-start gap-3">
              <Compass className="mt-1 h-5 w-5 shrink-0 text-[#B84955]" aria-hidden="true" />
              <div>
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#632D40]">
                  CREATIVE & TECHNICAL INTERESTS
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#211E25]">
                  {personalData.interests.map((interest) => (
                    <li key={interest} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#B84955]" aria-hidden="true" />
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MangaPanel>

          <Annotation label="CAREER GOALS">
            <div className="flex items-start gap-2.5 pt-1">
              <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-[#632D40]" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-[#301B29]">
                {personalData.careerGoals}
              </p>
            </div>
          </Annotation>
        </div>
      </ComicGrid>
    </MangaPage>
  );
}
