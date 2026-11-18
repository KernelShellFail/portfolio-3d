import { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  Server,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  skillCategories,
  skillsData,
  type SkillCategory,
  type SkillCardItem,
} from '../../data/skills';
import { filterSkillsByCategory } from '../../utils/portfolioLogic';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { MangaPage } from '../manga/MangaPage';
import { ChapterHeading } from '../manga/ChapterHeading';
import { Tilt3DCard } from '../manga/Tilt3DCard';
import { DraggablePanel } from '../manga/DraggablePanel';

const categoryIconMap: Record<SkillCategory, typeof Code2> = {
  'Programming Languages': Code2,
  'Frontend Technologies': Layers,
  'Backend Technologies': Server,
  Databases: Database,
  'Development Tools': Wrench,
  'Other Technical Skills': Sparkles,
};

export function Chapter03Skills() {
  const selectedCategory = usePortfolioStore((s) => s.activeSkillCategory);
  const setSelectedCategory = usePortfolioStore((s) => s.setActiveSkillCategory);
  const setActiveSkillId = usePortfolioStore((s) => s.setActiveSkillId);
  const [inspectedCardId, setInspectedCardId] = useState<string | null>(null);

  const visibleSkills = filterSkillsByCategory(skillsData, selectedCategory);

  const toggleInspect = (skill: SkillCardItem) => {
    setInspectedCardId((prev) => {
      const next = prev === skill.id ? null : skill.id;
      setActiveSkillId(next);
      return next;
    });
  };

  return (
    <MangaPage id="skills" tone="dark-wine" ariaLabelledBy="skills-heading">
      <ChapterHeading
        id="skills-heading"
        theme="dark"
        chapterNumber="CHAPTER 03 · ABILITY ARCHIVE"
        title="Technical Skills"
        subtitle="Collectible ability cards synced with the 3D spirit relics behind this page. Select any card or 3D relic to inspect its focus area."
      />

      {/* Category Filter Buttons */}
      <DraggablePanel className="pointer-events-auto mb-8 inline-block max-w-full" label="Skill Category Filter">
        <div
          role="group"
          aria-label="Filter skills by category"
          className="flex flex-wrap items-center gap-2 pr-7"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`min-h-[40px] border-2 px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1] shadow-[3px_3px_0_#211E25]'
                : 'border-[#E8BFC9]/60 bg-[#211E25]/92 text-[#E8BFC9] hover:border-[#FFF9F1]'
            }`}
          >
            All Abilities
          </button>

          {skillCategories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] border-2 px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-[#FFF9F1] bg-[#B84955] text-[#FFF9F1] shadow-[3px_3px_0_#211E25]'
                    : 'border-[#E8BFC9]/60 bg-[#211E25]/92 text-[#E8BFC9] hover:border-[#FFF9F1]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </DraggablePanel>

      {/* Collectible 3D-Tilt Ability Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleSkills.map((skill) => {
          const Icon = categoryIconMap[skill.category];
          const isInspected = inspectedCardId === skill.id;

          return (
            <DraggablePanel key={skill.id} className="pointer-events-auto h-full" label={skill.name}>
              <Tilt3DCard intensity={7} className="h-full">
              <button
                type="button"
                onClick={() => toggleInspect(skill)}
                aria-expanded={isInspected}
                className={`group flex h-full w-full flex-col justify-between border-2 p-5 text-left transition-colors cursor-pointer ${
                  isInspected
                    ? 'border-[#FFF9F1] bg-[#632D40]/96 text-[#FFF9F1] shadow-[5px_5px_0_#B84955]'
                    : 'border-[#211E25] bg-[#FFF9F1]/96 text-[#211E25] shadow-[5px_5px_0_#B84955]'
                }`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`font-mono-tabular text-[11px] font-semibold tracking-wider ${
                        isInspected ? 'text-[#E8BFC9]' : 'text-[#632D40]'
                      }`}
                    >
                      {skill.cardCode}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        isInspected ? 'text-[#E8BFC9]' : 'text-[#B84955]'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="font-display text-xl font-bold">{skill.name}</h3>
                  <p
                    className={`mt-1 text-xs font-medium ${
                      isInspected ? 'text-[#E8BFC9]' : 'text-[#632D40]'
                    }`}
                  >
                    {skill.category}
                  </p>

                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isInspected ? 'text-[#FFF9F1]' : 'text-[#301B29]'
                    }`}
                  >
                    {skill.summary}
                  </p>
                </div>

                <div
                  className={`mt-5 border-t pt-3 text-xs ${
                    isInspected
                      ? 'border-[#E8BFC9]/35 text-[#E8BFC9]'
                      : 'border-[#211E25]/15 text-[#632D40]'
                  }`}
                >
                  <span className="font-semibold">
                    {isInspected ? `Focus: ${skill.focusArea}` : 'Tap card for focus area'}
                  </span>
                </div>
              </button>
            </Tilt3DCard>
            </DraggablePanel>
          );
        })}
      </div>
    </MangaPage>
  );
}
