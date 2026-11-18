import type { ReactNode } from 'react';

interface PaperTextureProps {
  tone?: 'cream' | 'warm-white' | 'dark-wine' | 'dusk';
  className?: string;
  children: ReactNode;
}

const toneClasses: Record<NonNullable<PaperTextureProps['tone']>, string> = {
  cream: 'bg-[#F6EBDD] text-[#211E25]',
  'warm-white': 'bg-[#FFF9F1] text-[#211E25]',
  'dark-wine': 'bg-[#301B29] text-[#F6EBDD]',
  dusk: 'bg-[#EDF1F5] text-[#211E25]',
};

export function PaperTexture({
  tone = 'cream',
  className = '',
  children,
}: PaperTextureProps) {
  return (
    <div className={`relative paper-grain ${toneClasses[tone]} ${className}`}>
      {children}
    </div>
  );
}
