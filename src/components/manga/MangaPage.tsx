import { useEffect, useRef, type ReactNode } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { computeChapterRevealState } from '../../utils/portfolioLogic';

interface MangaPageProps {
  id: string;
  tone?: 'cream' | 'warm-white' | 'dark-wine' | 'dusk';
  ariaLabelledBy?: string;
  className?: string;
  children: ReactNode;
}

const edgeToneTint: Record<NonNullable<MangaPageProps['tone']>, string> = {
  cream: 'border-t border-[#E8BFC9]/15',
  'warm-white': 'border-t border-[#E8BFC9]/15',
  'dark-wine': 'border-t border-[#B84955]/25',
  dusk: 'border-t border-[#A9BBCF]/20',
};

export function MangaPage({
  id,
  tone = 'cream',
  ariaLabelledBy,
  className = '',
  children,
}: MangaPageProps) {
  const explore3DMode = usePortfolioStore((s) => s.explore3DMode);
  const sectionRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      inner.style.opacity = '1';
      inner.style.transform = 'none';
      section.dataset.scrollPhase = 'active';
      section.dataset.scrollFaded = 'false';
      return;
    }

    let rafPending = false;
    const updateReveal = () => {
      rafPending = false;
      const rect = section.getBoundingClientRect();
      const state = computeChapterRevealState(rect.top, rect.bottom, window.innerHeight);

      inner.style.opacity = String(state.opacity);
      inner.style.transform = `translate3d(0, ${state.translateY}px, 0) scale(${state.scale})`;
      section.dataset.scrollPhase = state.phase;
      section.dataset.scrollFaded = state.opacity < 0.28 ? 'true' : 'false';
    };

    const scheduleUpdate = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateReveal);
      }
    };

    updateReveal();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={explore3DMode}
      data-scroll-phase="active"
      data-scroll-faded="false"
      className={`pointer-events-none relative py-20 md:py-28 px-5 sm:px-8 ${edgeToneTint[tone]} ${
        explore3DMode ? 'invisible opacity-0' : 'opacity-100'
      } ${className}`}
    >
      <div
        ref={innerRef}
        className="relative z-10 mx-auto max-w-[1200px] will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        {children}
      </div>
    </section>
  );
}
