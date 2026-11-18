import { useRef, useState, type MouseEvent, type ReactNode } from 'react';

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function Tilt3DCard({
  children,
  className = '',
  intensity = 6,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState(
    'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, a, input, textarea, select')) {
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-ny * intensity).toFixed(2);
    const ry = (nx * intensity).toFixed(2);
    setTransformStyle(
      `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`,
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
      }}
      className={`transition-transform duration-100 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
