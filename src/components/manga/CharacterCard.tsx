import { useState } from 'react';
import { Code2 } from 'lucide-react';
import { Tilt3DCard } from './Tilt3DCard';
import { DraggablePanel } from './DraggablePanel';

interface CharacterCardProps {
  imageUrl: string;
  imageAlt: string;
  name: string;
  role: string;
  caption?: string;
  className?: string;
}

export function CharacterCard({
  imageUrl,
  imageAlt,
  name,
  role,
  caption,
  className = '',
}: CharacterCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <DraggablePanel className={`pointer-events-auto ${className}`} label={`${name} portrait card`}>
      <Tilt3DCard intensity={8} className="h-full">
        <figure className="manga-frame bg-[#FFF9F1] p-3 h-full">
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#211E25] bg-[#301B29]">
            {!imgError ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-[#F6EBDD]">
                <Code2 className="h-10 w-10 text-[#E8BFC9]" aria-hidden="true" />
                <p className="font-display text-xl font-bold">{name}</p>
                <p className="text-xs text-[#E8BFC9]">{role}</p>
              </div>
            )}
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#632D40]">
            <span className="font-semibold text-[#211E25]">{name}</span>
            <span>{caption ?? role}</span>
          </figcaption>
        </figure>
      </Tilt3DCard>
    </DraggablePanel>
  );
}
