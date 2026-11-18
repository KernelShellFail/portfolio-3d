import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DraggablePanel } from './DraggablePanel';

interface SpeechBubbleProps {
  speaker?: string;
  annotation?: string;
  tail?: 'bottom-left' | 'bottom-right' | 'top-left';
  variant?: 'warm' | 'pink' | 'dark';
  children: ReactNode;
  className?: string;
}

const bubbleThemes: Record<NonNullable<SpeechBubbleProps['variant']>, string> = {
  warm: 'bg-[#FFF9F1] text-[#211E25] border-[#211E25]',
  pink: 'bg-[#F8E4EA] text-[#211E25] border-[#211E25]',
  dark: 'bg-[#301B29] text-[#F6EBDD] border-[#E8BFC9]',
};

export function SpeechBubble({
  speaker,
  annotation,
  tail = 'bottom-left',
  variant = 'warm',
  children,
  className = '',
}: SpeechBubbleProps) {
  const tailPosition =
    tail === 'bottom-left'
      ? 'left-8 -bottom-3 rotate-45 border-r-2 border-b-2'
      : tail === 'bottom-right'
        ? 'right-8 -bottom-3 rotate-45 border-r-2 border-b-2'
        : 'left-8 -top-3 rotate-45 border-l-2 border-t-2';

  const tailColor =
    variant === 'warm'
      ? 'bg-[#FFF9F1] border-[#211E25]'
      : variant === 'pink'
        ? 'bg-[#F8E4EA] border-[#211E25]'
        : 'bg-[#301B29] border-[#E8BFC9]';

  return (
    <DraggablePanel className="pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`relative border-2 p-5 shadow-[4px_4px_0_#211E25] ${bubbleThemes[variant]} ${className}`}
      >
        {(speaker || annotation) && (
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide opacity-80">
            {speaker && <span className="font-semibold text-[#B84955]">{speaker}</span>}
            {speaker && annotation && <span aria-hidden="true">·</span>}
            {annotation && <span>{annotation}</span>}
          </div>
        )}
        <div className="text-sm sm:text-base leading-relaxed">{children}</div>
        <span
          aria-hidden="true"
          className={`absolute h-5 w-5 ${tailPosition} ${tailColor}`}
        />
      </motion.div>
    </DraggablePanel>
  );
}
