import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LOGO_SRC } from '../data/previewCatalog';

interface EntryLogoCurtainProps {
  visible: boolean;
  onDismiss: () => void;
}

const DOT_COLORS = ['#F088B0', '#F01818', '#F8D000', '#00A048'] as const;

export function EntryLogoCurtain({ visible, onDismiss }: EntryLogoCurtainProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      onDismiss();
    }, 720);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sd-entry-logo-curtain"
          data-testid="entry-logo-curtain"
          role="dialog"
          aria-modal="true"
          aria-label="School Decor brand introduction"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0.36 } }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onDismiss();
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          {/* Top & Bottom Bi-Parting White Architectural Shutters */}
          <motion.div
            aria-hidden="true"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.36, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-white pointer-events-none"
          >
            <div className="grid grid-cols-4 h-1 w-full">
              <span className="bg-[#F088B0]" />
              <span className="bg-[#F01818]" />
              <span className="bg-[#F8D000]" />
              <span className="bg-[#00A048]" />
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.36, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-white pointer-events-none"
          />

          {/* Center Architectural Brand Stage */}
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -14 }}
            transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-8 py-8 sm:px-14 sm:py-10 pointer-events-none"
          >
            {/* Subtle Ambient Radial Spotlight + Architectural Orbit Ring */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(240,136,176,0.14)_0%,rgba(0,160,72,0.09)_46%,transparent_72%)] blur-xl pointer-events-none"
            />
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.8, rotate: -18 }}
              animate={{ opacity: 0.45, scale: 1, rotate: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -inset-3 rounded-[2.25rem] border border-dashed border-[#007B36]/25 pointer-events-none"
            />

            {/* Expanding Architectural L-Corner Brackets */}
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: 14, y: 14 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.52, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#007B36]/60 rounded-tl-md"
            />
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: -14, y: 14 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.52, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C22768]/60 rounded-tr-md"
            />
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: 14, y: -14 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.52, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#F8D000]/90 rounded-bl-md"
            />
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: -14, y: -14 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.52, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#007B36]/60 rounded-br-md"
            />

            {/* 4 Logo-Palette Bouncing Dots */}
            <div className="flex items-center gap-2.5 mb-3" aria-hidden="true">
              {DOT_COLORS.map((hex, i) => (
                <motion.span
                  key={hex}
                  initial={{ opacity: 0, y: -18, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.42,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-2.5 h-2.5 rounded-full block shadow-xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            {/* Masked Horizon Unfold + Light Sheen Pass Over Exact Untouched Original Logo */}
            <div className="relative overflow-hidden px-3 py-1.5 rounded-xl">
              <motion.div
                initial={{ y: '110%', opacity: 0, scale: 0.92 }}
                animate={{ y: '0%', opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={LOGO_SRC}
                  alt="School Decor"
                  decoding="async"
                  fetchPriority="high"
                  className="w-[220px] sm:w-[285px] h-auto object-contain block"
                />
              </motion.div>
              <motion.div
                aria-hidden="true"
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '220%', opacity: [0, 0.55, 0] }}
                transition={{ duration: 0.78, delay: 0.52, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] pointer-events-none"
              />
            </div>

            {/* Center-Out Expanding 4-Color Architectural Seam */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0.3 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.62, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'center center' }}
              className="w-[220px] sm:w-[280px] h-[3.5px] rounded-full overflow-hidden grid grid-cols-4 mt-4"
            >
              <span className="bg-[#F088B0]" />
              <span className="bg-[#F01818]" />
              <span className="bg-[#F8D000]" />
              <span className="bg-[#00A048]" />
            </motion.div>

            {/* Editorial Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: '0.14em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }}
              transition={{ duration: 0.48, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3.5 text-xs sm:text-sm font-semibold text-[#525852]"
            >
              Designing Better Spaces for Brighter Futures
            </motion.p>
          </motion.div>

          <motion.button
            type="button"
            onClick={onDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-full border border-[#E3E5E0] bg-white text-xs font-semibold text-[#525852] hover:text-[#007B36] hover:border-[#007B36] transition-colors cursor-pointer"
          >
            Skip Intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
