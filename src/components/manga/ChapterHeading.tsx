import { DraggablePanel } from './DraggablePanel';

interface ChapterHeadingProps {
  id?: string;
  chapterNumber: string;
  title: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function ChapterHeading({
  id,
  chapterNumber,
  title,
  subtitle,
  theme = 'light',
  className = '',
}: ChapterHeadingProps) {
  const isDark = theme === 'dark';

  return (
    <header className={`pointer-events-none mb-10 md:mb-12 ${className}`}>
      <DraggablePanel className="pointer-events-auto inline-block max-w-2xl">
        <div
          className={`border-2 px-6 py-5 ${
            isDark
              ? 'border-[#E8BFC9] bg-[#211E25] text-[#FFF9F1] shadow-[6px_6px_0_#B84955]'
              : 'border-[#211E25] bg-[#FFF9F1] text-[#211E25] shadow-[6px_6px_0_#B84955]'
          }`}
        >
          <div className="mb-2.5 flex items-center gap-3">
            <span
              className={`inline-block h-[2px] w-7 ${
                isDark ? 'bg-[#E8BFC9]' : 'bg-[#B84955]'
              }`}
              aria-hidden="true"
            />
            <p
              className={`font-mono-tabular text-xs font-semibold tracking-[0.18em] ${
                isDark ? 'text-[#E8BFC9]' : 'text-[#632D40]'
              }`}
            >
              {chapterNumber}
            </p>
          </div>

          <h2
            id={id}
            className={`font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem] ${
              isDark ? 'text-[#FFF9F1]' : 'text-[#211E25]'
            }`}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-[#E8BFC9]' : 'text-[#301B29]'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </DraggablePanel>
    </header>
  );
}
