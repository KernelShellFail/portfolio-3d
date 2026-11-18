import { useState } from 'react';
import { ArrowUpRight, BookOpen, FolderGit2 } from 'lucide-react';
import type { ProjectEpisodeItem } from '../../data/projects';
import { Tilt3DCard } from './Tilt3DCard';
import { DraggablePanel } from './DraggablePanel';

interface ProjectEpisodeProps {
  project: ProjectEpisodeItem;
  index?: number;
  onInspect: (project: ProjectEpisodeItem) => void;
  onHoverChange?: (projectId: string | null) => void;
}

export function ProjectEpisode({
  project,
  onInspect,
  onHoverChange,
}: ProjectEpisodeProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <DraggablePanel className="pointer-events-auto h-full" label={project.title}>
      <Tilt3DCard intensity={7} className="h-full">
        <article
          onMouseEnter={() => onHoverChange?.(project.id)}
          onMouseLeave={() => onHoverChange?.(null)}
          className="group flex h-full flex-col justify-between manga-frame bg-[#FFF9F1] transition-transform duration-150 hover:-translate-y-1"
        >
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-[#211E25] bg-[#301B29]">
              {!imgError ? (
                <img
                  src={project.previewImage}
                  alt={project.previewAlt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  draggable={false}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-[#F6EBDD]">
                  <FolderGit2 className="h-8 w-8 text-[#E8BFC9]" aria-hidden="true" />
                  <p className="font-display text-lg font-bold">{project.title}</p>
                </div>
              )}
            </div>

          <div className="p-6">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#632D40]">
              <span className="font-mono-tabular font-semibold tracking-wider">
                {project.episodeNumber}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#211E25]">
              {project.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-[#632D40]">{project.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#301B29]">
              {project.shortDescription}
            </p>

            <p className="mt-4 border-t border-[#211E25]/15 pt-3 font-mono-tabular text-xs text-[#632D40]">
              {project.technologies.join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#211E25] bg-[#F6EBDD] px-6 py-4">
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="inline-flex min-h-[40px] items-center gap-2 border-2 border-[#211E25] bg-[#632D40] px-4 py-2 text-xs font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#211E25] transition-colors hover:bg-[#B84955] cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Read Episode
          </button>

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1 text-xs font-semibold text-[#211E25] underline decoration-[#B84955] underline-offset-4 hover:text-[#B84955] whitespace-nowrap"
            >
              Repository
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-xs text-[#632D40]">Editable slot</span>
          )}
        </div>
      </article>
    </Tilt3DCard>
  </DraggablePanel>
  );
}
