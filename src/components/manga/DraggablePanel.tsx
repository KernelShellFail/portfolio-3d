import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { GripHorizontal, RotateCcw } from 'lucide-react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { clampPanelDragOffset, shouldStartPanelDrag } from '../../utils/portfolioLogic';
import { playSpiritChime } from '../../utils/soundEffects';

let topPanelZ = 25;

interface DraggablePanelProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function DraggablePanel({
  children,
  className = '',
  label,
}: DraggablePanelProps) {
  const panelsResetSignal = usePortfolioStore((s) => s.panelsResetSignal);
  const setDraggedPanelsDelta = usePortfolioStore((s) => s.setDraggedPanelsDelta);
  const audioChimesEnabled = usePortfolioStore((s) => s.audioChimesEnabled);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zLayer, setZLayer] = useState<number | undefined>(undefined);

  const hasCountedMoveRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragSessionRef = useRef<{
    active: boolean;
    startedDrag: boolean;
    startClientX: number;
    startClientY: number;
    baseOffsetX: number;
    baseOffsetY: number;
  }>({
    active: false,
    startedDrag: false,
    startClientX: 0,
    startClientY: 0,
    baseOffsetX: 0,
    baseOffsetY: 0,
  });

  const markMovedState = useCallback(
    (moved: boolean) => {
      if (moved && !hasCountedMoveRef.current) {
        hasCountedMoveRef.current = true;
        setDraggedPanelsDelta(1);
      } else if (!moved && hasCountedMoveRef.current) {
        hasCountedMoveRef.current = false;
        setDraggedPanelsDelta(-1);
      }
    },
    [setDraggedPanelsDelta],
  );

  // Reset all moved panels smoothly when global reset is triggered
  useEffect(() => {
    if (panelsResetSignal === 0) return;
    setOffset({ x: 0, y: 0 });
    setZLayer(undefined);
    setIsDragging(false);
    hasCountedMoveRef.current = false;
  }, [panelsResetSignal]);

  // Clean up counter if component unmounts while moved (e.g. filter change)
  useEffect(() => {
    return () => {
      if (hasCountedMoveRef.current) {
        hasCountedMoveRef.current = false;
        usePortfolioStore.getState().setDraggedPanelsDelta(-1);
      }
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const s = dragSessionRef.current;
      if (!s.active) return;

      const dx = e.clientX - s.startClientX;
      const dy = e.clientY - s.startClientY;

      if (!s.startedDrag) {
        if (!shouldStartPanelDrag(dx, dy, 6)) return;
        s.startedDrag = true;
        suppressClickRef.current = true;
        topPanelZ += 1;
        setZLayer(topPanelZ);
        setIsDragging(true);
      }

      const next = clampPanelDragOffset(s.baseOffsetX + dx, s.baseOffsetY + dy);
      setOffset(next);
    };

    const onPointerUp = () => {
      const s = dragSessionRef.current;
      if (!s.active) return;
      s.active = false;
      if (s.startedDrag) {
        s.startedDrag = false;
        setIsDragging(false);
        markMovedState(true);
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 60);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [markMovedState]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest('input, textarea, select, option, [data-no-drag="true"]')) {
      return;
    }
    dragSessionRef.current = {
      active: true,
      startedDrag: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
      baseOffsetX: offset.x,
      baseOffsetY: offset.y,
    };
  };

  const handleClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleSnapBack = () => {
    setOffset({ x: 0, y: 0 });
    setZLayer(undefined);
    markMovedState(false);
    playSpiritChime('snap', audioChimesEnabled);
  };

  const isMoved = offset.x !== 0 || offset.y !== 0;

  return (
    <div
      data-draggable-panel="true"
      data-moved={isMoved ? 'true' : 'false'}
      aria-label={label ? `${label} (drag to move)` : undefined}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      onDoubleClick={() => {
        if (isMoved) handleSnapBack();
      }}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)${
          isDragging ? ' scale(1.012)' : ''
        }`,
        zIndex: zLayer,
        touchAction: isDragging ? 'none' : 'auto',
      }}
      className={`group/drag relative ${
        isDragging
          ? 'select-none cursor-grabbing'
          : 'cursor-grab transition-transform duration-300 ease-out'
      } ${className}`}
    >
      {/* Subtle corner drag handle indicator + quick snap-back button when moved */}
      <div className="pointer-events-none absolute top-1.5 right-1.5 z-20 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/drag:opacity-100 data-[moved=true]:opacity-100" data-moved={isMoved ? 'true' : 'false'}>
        <span
          aria-hidden="true"
          className="inline-flex h-5 items-center gap-1 border border-[#211E25]/35 bg-[#FFF9F1]/90 px-1.5 text-[10px] font-medium text-[#632D40]"
        >
          <GripHorizontal className="h-3 w-3" />
        </span>
        {isMoved && (
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              handleSnapBack();
            }}
            aria-label="Snap panel back"
            title="Snap panel back to original slot"
            className="pointer-events-auto inline-flex h-5 w-5 items-center justify-center border border-[#211E25] bg-[#B84955] text-[#FFF9F1] hover:bg-[#632D40] cursor-pointer"
          >
            <RotateCcw className="h-2.5 w-2.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
