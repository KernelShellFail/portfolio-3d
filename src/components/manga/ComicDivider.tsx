interface ComicDividerProps {
  label?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function ComicDivider({
  label,
  theme = 'light',
  className = '',
}: ComicDividerProps) {
  const isDark = theme === 'dark';

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`my-10 flex items-center gap-4 ${className}`}
    >
      <div
        className={`h-[2px] flex-1 ${
          isDark ? 'bg-[#E8BFC9]/35' : 'bg-[#211E25]/25'
        }`}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={isDark ? 'text-[#E8BFC9]' : 'text-[#B84955]'}
      >
        <path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="currentColor"
        />
      </svg>
      {label && (
        <span
          className={`font-mono-tabular text-xs tracking-widest whitespace-nowrap ${
            isDark ? 'text-[#E8BFC9]' : 'text-[#632D40]'
          }`}
        >
          {label}
        </span>
      )}
      <div
        className={`h-[2px] flex-1 ${
          isDark ? 'bg-[#E8BFC9]/35' : 'bg-[#211E25]/25'
        }`}
      />
    </div>
  );
}
