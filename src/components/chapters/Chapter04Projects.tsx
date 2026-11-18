import { useState } from 'react';
import {
  projectsData,
  type ProjectCategory,
  type ProjectEpisodeItem,
} from '../../data/projects';
import { filterProjectsByCategory } from '../../utils/portfolioLogic';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { MangaPage } from '../manga/MangaPage';
import { ChapterHeading } from '../manga/ChapterHeading';
import { ProjectEpisode } from '../manga/ProjectEpisode';
import { Annotation } from '../manga/Annotation';
import { DraggablePanel } from '../manga/DraggablePanel';

const projectCategories: ProjectCategory[] = [
  'All',
  '3D & Interactive',
  'Full-Stack Web',
  'UI & Design Systems',
];

export function Chapter04Projects() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const setHoveredProjectId = usePortfolioStore((s) => s.setHoveredProjectId);

  const visibleProjects = filterProjectsByCategory(projectsData, selectedCategory);

  return (
    <MangaPage id="projects" tone="cream" ariaLabelledBy="projects-heading">
      <ChapterHeading
        id="projects-heading"
        chapterNumber="CHAPTER 04 · MANGA EPISODES"
        title="Software Projects"
        subtitle="Each project is presented as a manga episode and a clickable 3D diorama frame in the corridor. Select any episode or 3D frame to open its full architectural breakdown."
      />

      {/* Filter Controls */}
      <DraggablePanel className="pointer-events-auto mb-8 inline-block max-w-full" label="Project Category Filter">
        <div
          role="group"
          aria-label="Filter project episodes by category"
          className="flex flex-wrap items-center gap-2 pr-7"
        >
          {projectCategories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] border-2 border-[#211E25] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#632D40] text-[#FFF9F1] shadow-[3px_3px_0_#211E25]'
                    : 'bg-[#FFF9F1]/95 text-[#211E25] hover:bg-[#E8BFC9]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </DraggablePanel>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project, idx) => (
          <ProjectEpisode
            key={project.id}
            project={project}
            index={idx}
            onInspect={(p: ProjectEpisodeItem) => setSelectedProject(p)}
            onHoverChange={setHoveredProjectId}
          />
        ))}
      </div>

      <Annotation label="PORTFOLIO CUSTOMIZATION NOTE" className="mt-10">
        Project episodes are managed centrally in{' '}
        <code className="font-mono-tabular text-xs font-semibold text-[#632D40]">
          src/data/projects.ts
        </code>
        . Repository and live demo links appear automatically once real URLs are added; unlinked
        template slots remain clearly labeled rather than using dummy links.
      </Annotation>
    </MangaPage>
  );
}
