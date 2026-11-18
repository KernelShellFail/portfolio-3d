import type { ReactNode } from 'react';
import { Tilt3DCard } from './Tilt3DCard';
import { DraggablePanel } from './DraggablePanel';

interface MangaPanelProps {
  children: ReactNode;
  variant?: 'cream' | 'warm' | 'dark' | 'burgundy';
  tilt?: 'none' | 'subtle-left' | 'subtle-right';
  interactive?: boolean;
  className?: string;
}

const variantStyles: Record<NonNullable<MangaPanelProps['variant']>, string> = {
  cream: 'bg-[#F6EBDD] text-[#211E25] manga-frame',
  warm: 'bg-[#FFF9F1] text-[#211E25] manga-frame',
  dark: 'bg-[#301B29] text-[#F6EBDD] manga-frame-cream',
  burgundy: 'bg-[#632D40] text-[#FFF9F1] manga-frame',
};

const tiltStyles: Record<NonNullable<MangaPanelProps['tilt']>, string> = {
  none: '',
  'subtle-left': 'md:-rotate-[0.6deg]',
  'subtle-right': 'md:rotate-[0.6deg]',
};

export function MangaPanel({
  children,
  variant = 'warm',
  tilt = 'none',
  interactive = false,
  className = '',
}: MangaPanelProps) {
  const panel = (
    <div
      className={`pointer-events-auto relative overflow-hidden p-6 md:p-8 ${variantStyles[variant]} ${tiltStyles[tilt]} ${className}`}
    >
      {children}
    </div>
  );

  return (
    <DraggablePanel className="pointer-events-auto">
      <Tilt3DCard intensity={interactive ? 7 : 3.5}>{panel}</Tilt3DCard>
    </DraggablePanel>
  );
}
