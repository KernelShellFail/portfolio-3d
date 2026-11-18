import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export function ProjectEpisodeModal() {
  const selectedProject = usePortfolioStore((s) => s.selectedProject);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject, setSelectedProject]);

  return (
    <AnimatePresence>
      {selectedProject && (
        <div
          className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-[#211E25]/82 p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="episode-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto border-[3px] border-[#211E25] bg-[#FFF9F1] text-[#211E25] shadow-[10px_10px_0_#B84955]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-2 border-[#211E25] bg-[#F6EBDD] px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#632D40]">
                <span className="font-mono-tabular font-bold tracking-wider">
                  {selectedProject.episodeNumber}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedProject.category}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close episode details"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border-2 border-[#211E25] bg-[#FFF9F1] text-[#211E25] hover:bg-[#B84955] hover:text-[#FFF9F1] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="aspect-[16/9] w-full overflow-hidden border-2 border-[#211E25] bg-[#301B29]">
                <img
                  src={selectedProject.previewImage}
                  alt={selectedProject.previewAlt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <h3
                id="episode-modal-title"
                className="mt-6 font-display text-2xl font-bold text-[#211E25] sm:text-3xl"
              >
                {selectedProject.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[#B84955]">
                {selectedProject.subtitle}
              </p>

              <p className="mt-4 text-base leading-relaxed text-[#301B29]">
                {selectedProject.shortDescription}
              </p>

              <div className="mt-6 border-t-2 border-[#211E25]/15 pt-5">
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#632D40]">
                  EPISODE BREAKDOWN
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#211E25]">
                  {selectedProject.fullDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#B84955]" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t-2 border-[#211E25]/15 pt-5">
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#632D40]">
                  TECHNOLOGIES
                </p>
                <p className="mt-2 font-mono-tabular text-sm text-[#211E25]">
                  {selectedProject.technologies.join(' · ')}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t-2 border-[#211E25] pt-5">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 border-2 border-[#211E25] bg-[#632D40] px-5 py-2 text-sm font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#211E25] hover:bg-[#B84955]"
                  >
                    View GitHub Repository
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}

                {selectedProject.liveDemoUrl && (
                  <a
                    href={selectedProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 border-2 border-[#211E25] bg-[#FFF9F1] px-5 py-2 text-sm font-semibold text-[#211E25] shadow-[3px_3px_0_#211E25] hover:bg-[#E8BFC9]"
                  >
                    Open Live Demo
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}

                {!selectedProject.githubUrl && !selectedProject.liveDemoUrl && (
                  <p className="text-xs font-medium text-[#632D40]">
                    {selectedProject.placeholderNote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
