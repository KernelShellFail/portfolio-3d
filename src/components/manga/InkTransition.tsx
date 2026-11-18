import { AnimatePresence, motion } from 'motion/react';

interface InkTransitionProps {
  active: boolean;
  label?: string;
}

export function InkTransition({
  active,
  label = 'Turning Chapter Page',
}: InkTransitionProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#211E25]"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.03, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="border-2 border-[#E8BFC9] bg-[#301B29] px-8 py-5 text-center shadow-[6px_6px_0_#B84955]"
          >
            <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#E8BFC9]">
              CHAPTER TRANSITION
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-[#FFF9F1]">
              {label}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
