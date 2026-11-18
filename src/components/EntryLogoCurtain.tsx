import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LOGO_SRC, THEME_IMAGES } from '../data/previewCatalog';

interface EntryLogoCurtainProps {
  visible: boolean;
  onDismiss: () => void;
}

const CURTAIN_COLUMNS = [
  { bg: 'from-[#FFF9FC] via-[#FFF3F8] to-[#FCE4EE]', bar: '#EE7DA8', delay: 0 },
  { bg: 'from-[#FFF6FA] via-[#FDECF4] to-[#FADCE8]', bar: '#F01818', delay: 0.065 },
  { bg: 'from-[#FFF9FC] via-[#FFF3F8] to-[#FCE4EE]', bar: '#F8D000', delay: 0.13 },
  { bg: 'from-[#FFF6FA] via-[#FDECF4] to-[#FADCE8]', bar: '#00A048', delay: 0.195 },
] as const;

const INTRO_PILLS = [
  { label: 'Kindergarten', dot: '#EE7DA8' },
  { label: 'K–12 Classrooms', dot: '#F01818' },
  { label: 'STEM & Science Labs', dot: '#F8D000' },
  { label: 'Soft & Outdoor Play', dot: '#00A048' },
] as const;

export function EntryLogoCurtain({ visible, onDismiss }: EntryLogoCurtainProps) {
  useEffect(() => {
    if (!visible) return;
    const isHold =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('intro') === 'hold';
    const timer = isHold
      ? undefined
      : window.setTimeout(() => {
          onDismiss();
        }, 1450);

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
          exit={{ opacity: 1, transition: { duration: 0.65 } }}
          onClick={onDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
        >
          {/* 4-Column Staggered Vertical Pastel Architectural Curtain Panels */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-4 pointer-events-none"
          >
            {CURTAIN_COLUMNS.map((col, idx) => (
              <motion.div
                key={idx}
                initial={{ y: '0%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-104%' }}
                transition={{
                  duration: 0.56,
                  delay: col.delay,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className={`relative h-full w-full bg-gradient-to-b ${col.bg} border-r border-[#F5D0E0]/60 last:border-r-0 flex flex-col justify-between`}
              >
                {/* Top subtle architectural grid texture */}
                <div className="w-full h-1.5 opacity-80" style={{ backgroundColor: col.bar }} />
                {/* Bottom signature color hem bar */}
                <div className="w-full h-2" style={{ backgroundColor: col.bar }} />
              </motion.div>
            ))}
          </div>

          {/* Center 3D Brand & Cutout Furniture Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.06, y: -28 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-6 py-8 max-w-2xl w-full pointer-events-none"
          >
            {/* Glowing Soft Pastel Aura + Rotating Orbit Ring */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(238,125,168,0.26)_0%,rgba(250,220,232,0.45)_42%,transparent_72%)] blur-2xl pointer-events-none"
            />

            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.72, rotate: -45 }}
              animate={{ opacity: 0.65, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed border-[#EE7DA8]/45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />

            {/* Floating Left & Right 3D Cutout Furniture Silhouettes */}
            <motion.img
              src={THEME_IMAGES.cutoutHeroDesk}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, x: -90, y: 20, rotate: -12, scale: 0.7 }}
              animate={{ opacity: 0.95, x: 0, y: 0, rotate: -6, scale: 1 }}
              transition={{ duration: 0.68, delay: 0.12, type: 'spring', stiffness: 140, damping: 16 }}
              className="hidden sm:block absolute -left-8 md:-left-16 top-1/2 -translate-y-1/2 w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_14px_24px_rgba(238,125,168,0.28)]"
            />
            <motion.img
              src={THEME_IMAGES.cutoutHeroChair}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, x: 90, y: 20, rotate: 12, scale: 0.7 }}
              animate={{ opacity: 0.95, x: 0, y: 0, rotate: 6, scale: 1 }}
              transition={{ duration: 0.68, delay: 0.16, type: 'spring', stiffness: 140, damping: 16 }}
              className="hidden sm:block absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 w-24 md:w-32 h-24 md:h-32 object-contain drop-shadow-[0_14px_24px_rgba(238,125,168,0.28)]"
            />

            {/* Top Kicker Badge */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 border border-[#F3BBD2] shadow-xs mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#EE7DA8]" />
              <span className="text-[10.5px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#D95B8A]">
                New Delhi · Direct Factory Educational Furniture
              </span>
            </motion.div>

            {/* 3D Spring-Unfolding Logo Capsule */}
            <motion.div
              initial={{ opacity: 0, scale: 0.74, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
              className="relative overflow-hidden rounded-[28px] bg-white/95 border-2 border-[#F4B8D0] px-8 py-5 sm:px-12 sm:py-7 shadow-[0_24px_60px_rgba(238,125,168,0.25)]"
            >
              <img
                src={LOGO_SRC}
                alt="School Decor"
                decoding="async"
                fetchPriority="high"
                className="w-[210px] sm:w-[275px] h-auto object-contain block mx-auto"
              />
              {/* Sweeping Gloss Sheen */}
              <motion.div
                aria-hidden="true"
                initial={{ x: '-130%', opacity: 0 }}
                animate={{ x: '230%', opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.85, delay: 0.32, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#FFE8F1]/90 to-transparent skew-x-[-20deg] pointer-events-none"
              />
            </motion.div>

            {/* Staggered Category Pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {INTRO_PILLS.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={{ opacity: 0, y: 12, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.36,
                    delay: 0.24 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#F3C6D8] text-[11px] sm:text-xs font-bold text-[#333333] shadow-2xs"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: pill.dot }}
                  />
                  <span>{pill.label}</span>
                </motion.span>
              ))}
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="mt-5 w-[200px] sm:w-[240px] h-1.5 rounded-full bg-white/80 border border-[#F3C6D8] overflow-hidden p-0.5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left center' }}
                className="h-full w-full rounded-full bg-gradient-to-r from-[#EE7DA8] via-[#F01818] to-[#00A048]"
              />
            </div>
          </motion.div>

          <motion.button
            type="button"
            data-testid="skip-intro-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-6 z-20 px-4 py-2 rounded-full border border-[#F2BCD2] bg-white/95 text-xs font-bold text-[#D95B8A] hover:bg-[#EE7DA8] hover:text-white shadow-sm transition-colors cursor-pointer"
          >
            Enter Store →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
