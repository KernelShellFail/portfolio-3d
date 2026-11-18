import type { ReactNode } from 'react';
import { DraggablePanel } from './DraggablePanel';

interface AnnotationProps {
  label: string;
  children: ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
}

export function Annotation({
  label,
  children,
  theme = 'light',
  className = '',
}: AnnotationProps) {
  const isDark = theme === 'dark';

  return (
    <DraggablePanel className={`pointer-events-auto ${className}`}>
      <aside
        className={`border border-dashed px-4 py-3 ${
          isDark
            ? 'border-[#E8BFC9]/60 bg-[#301B29] text-[#F6EBDD]'
            : 'border-[#632D40]/60 bg-[#FFF9F1] text-[#211E25]'
        }`}
      >
        <p
          className={`font-mono-tabular text-[11px] font-semibold tracking-[0.14em] ${
            isDark ? 'text-[#E8BFC9]' : 'text-[#B84955]'
          }`}
        >
          {label}
        </p>
        <div className="mt-1 text-sm leading-relaxed">{children}</div>
      </aside>
    </DraggablePanel>
  );
}
