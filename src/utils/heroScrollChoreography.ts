export interface HeroScrollState {
  activeIndex: number;
  stageProgress: number;
  splitConvergence: number;
  deskTranslateX: number;
  chairTranslateX: number;
  deskRotateDeg: number;
  chairRotateDeg: number;
  pairScale: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Pure scroll-scrub choreography math for the multi-set centered Hero showcase.
 * - Stage 0 (0.00 -> 0.28): Desk (left) and Chair (right) converge into paired alignment.
 * - Stage 1..N-1: Evenly distributed across remaining scroll depth.
 */
export function computeHeroScrollState(
  scrollProgress: number,
  totalSets = 4
): HeroScrollState {
  const safeTotal = Math.max(1, Math.floor(totalSets));
  const p = clamp01(scrollProgress);

  if (safeTotal === 1) {
    const conv = clamp01(p / 0.55);
    const spread = (1 - conv) * 44;
    const tilt = Number(((1 - conv) * 2.2).toFixed(2));
    return {
      activeIndex: 0,
      stageProgress: p,
      splitConvergence: conv,
      deskTranslateX: Number((-spread).toFixed(2)),
      chairTranslateX: Number(spread.toFixed(2)),
      deskRotateDeg: -tilt,
      chairRotateDeg: tilt,
      pairScale: Number((0.96 + conv * 0.04).toFixed(4)),
    };
  }

  // First segment slightly weighted (0..0.28) so split Desk/Chair pairing feels deliberate
  const firstBreak = 0.28;
  let activeIndex = 0;
  let stageProgress = 0;

  if (p < firstBreak) {
    activeIndex = 0;
    stageProgress = clamp01(p / firstBreak);
  } else {
    const remaining = 1 - firstBreak;
    const step = remaining / (safeTotal - 1);
    const rawIdx = Math.floor((p - firstBreak) / step) + 1;
    activeIndex = Math.min(safeTotal - 1, Math.max(1, rawIdx));
    const segStart = firstBreak + (activeIndex - 1) * step;
    stageProgress = clamp01((p - segStart) / step);
  }

  // Within stage 0: desk & chair start apart (-54px / +54px) and meet seamlessly at center (-2px / +2px)
  // around stageProgress = 0.48, settling from subtle architectural inward cant to level.
  const meetRatio = clamp01(stageProgress / 0.48);
  const easedMeet = 1 - Math.pow(1 - meetRatio, 3);
  const spread = 54 * (1 - easedMeet) + 2;
  const tilt = Number(((1 - easedMeet) * 2.5).toFixed(2));

  return {
    activeIndex,
    stageProgress: Number(stageProgress.toFixed(4)),
    splitConvergence: Number(easedMeet.toFixed(4)),
    deskTranslateX: Number((-spread).toFixed(2)),
    chairTranslateX: Number(spread.toFixed(2)),
    deskRotateDeg: tilt === 0 ? 0 : -tilt,
    chairRotateDeg: tilt,
    pairScale: Number((0.95 + easedMeet * 0.05).toFixed(4)),
  };
}

export function getHeroScrollRatioForSet(index: number, totalSets = 4): number {
  const safeTotal = Math.max(1, Math.floor(totalSets));
  const clamped = Math.min(safeTotal - 1, Math.max(0, Math.floor(index)));
  if (clamped === 0) return 0.14;
  const firstBreak = 0.28;
  const step = (1 - firstBreak) / (safeTotal - 1);
  return Number((firstBreak + (clamped - 1) * step + step * 0.35).toFixed(4));
}
