import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Ruler,
  Users,
  CheckCircle2,
  ShoppingCart,
  FileText,
  MessageCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  calculateCampusPlan,
  FINISH_PALETTES,
  WING_PRESETS,
  type FinishPaletteId,
  type WingTypeId,
} from '../utils/smartPlanner';
import { buildWhatsAppUrl } from '../utils/storefrontHelpers';

interface SmartCampusPlannerProps {
  onAddKitToCart: (items: { productHandle: string; qty: number; variantOverride?: string }[]) => void;
  onOpenQuoteWithBrief: (title: string, requirements: string, quantity?: string) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SmartCampusPlanner({
  onAddKitToCart,
  onOpenQuoteWithBrief,
}: SmartCampusPlannerProps) {
  const [wingType, setWingType] = useState<WingTypeId>('primary');
  const [lengthFt, setLengthFt] = useState<number>(WING_PRESETS.primary.defaultLength);
  const [widthFt, setWidthFt] = useState<number>(WING_PRESETS.primary.defaultWidth);
  const [studentCount, setStudentCount] = useState<number>(WING_PRESETS.primary.defaultStudents);
  const [finishPalette, setFinishPalette] = useState<FinishPaletteId>('birch-emerald');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleSelectWing = (nextWing: WingTypeId) => {
    const preset = WING_PRESETS[nextWing];
    setWingType(nextWing);
    setLengthFt(preset.defaultLength);
    setWidthFt(preset.defaultWidth);
    setStudentCount(preset.defaultStudents);
    setAddedFeedback(false);
  };

  const plan = useMemo(
    () =>
      calculateCampusPlan({
        wingType,
        lengthFt,
        widthFt,
        studentCount,
        finishPalette,
      }),
    [wingType, lengthFt, widthFt, studentCount, finishPalette]
  );

  const pricedItems = plan.items.filter((i) => !i.quoteOnly && i.qty > 0);
  const totalUnitCount = plan.items.reduce((sum, item) => sum + item.qty, 0);

  const handleAddKit = () => {
    if (pricedItems.length === 0) return;
    onAddKitToCart(
      pricedItems.map((i) => ({
        productHandle: i.productHandle,
        qty: i.qty,
        variantOverride: plan.palette.name,
      }))
    );
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 2600);
  };

  const handleOpenQuote = () => {
    onOpenQuoteWithBrief(
      `${plan.wingLabel} (${plan.lengthFt}×${plan.widthFt} ft)`,
      plan.whatsappSummary,
      `${plan.studentCount} Students · ${totalUnitCount} Modules`
    );
  };

  const flowBadgeStyles =
    plan.flowRating === 'Spacious Flow'
      ? 'bg-[#EFF7F2] text-[#007B36] border-[#BDE2CB]'
      : plan.flowRating === 'Balanced Layout'
        ? 'bg-[#FFF9E3] text-[#8A6D00] border-[#EED67E]'
        : 'bg-[#FDF2F7] text-[#C22768] border-[#F4C5D8]';

  // Scaled preview box aspect constraints so architectural grid stays balanced inside card
  const cols =
    plan.wingType === 'stem-lab'
      ? 2
      : plan.wingType === 'active-play'
        ? 3
        : Math.max(4, Math.min(6, Math.round(plan.widthFt / 4.8)));

  return (
    <section
      id="smart-campus-planner"
      data-testid="smart-campus-planner"
      className="bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#EFF7F2] py-16 md:py-20 border-y border-[#E5DEC9] sd-lazy-section"
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex h-[3px] w-6 rounded-full bg-[#007B36]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                Smart Room &amp; BOQ Architect
              </p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#161A17] tracking-tight text-balance">
              Plan Your Classroom in{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">Real Time</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4D554E] mt-1.5 max-w-[60ch]">
              Dial in room dimensions, batch strength, and finish swatches to inspect live circulation flow, ergonomic posture heights, and an instant Bill of Quantities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSelectWing(wingType)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E5DEC9] hover:border-[#007B36] text-xs font-semibold text-[#4D554E] hover:text-[#161A17] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Wing Defaults</span>
          </button>
        </motion.div>

        {/* Wing Type Switcher */}
        <div
          role="tablist"
          aria-label="Select campus wing type"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6"
        >
          {(Object.keys(WING_PRESETS) as WingTypeId[]).map((id) => {
            const preset = WING_PRESETS[id];
            const active = wingType === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`planner-wing-${id}`}
                onClick={() => handleSelectWing(id)}
                className={`px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#161A17] text-white border-[#161A17] shadow-md -translate-y-0.5'
                    : 'bg-white hover:bg-[#FAF7F0] text-[#161A17] border-[#E5DEC9]'
                }`}
              >
                <span
                  className={`block text-[10px] font-mono-num uppercase tracking-wider ${
                    active ? 'text-[#A8E6BE]' : 'text-[#4D554E]'
                  }`}
                >
                  {preset.aisleMm} mm aisle
                </span>
                <span className="block text-xs sm:text-sm font-bold mt-0.5 truncate">
                  {preset.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Split Workspace: Left Controls & Live Floorplan | Right Smart BOQ & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Sliders + Finish Swatches + Scaled Architectural Blueprint Canvas */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E5DEC9] shadow-sm p-5 sm:p-6 space-y-6">
            {/* Dimension & Strength Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#161A17] mb-2">
                  <label htmlFor="planner-length" className="inline-flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#007B36]" />
                    <span>Length</span>
                  </label>
                  <span className="font-mono-num font-bold text-[#007B36]">{lengthFt} ft</span>
                </div>
                <input
                  id="planner-length"
                  type="range"
                  min={14}
                  max={48}
                  step={1}
                  value={lengthFt}
                  onChange={(e) => setLengthFt(Number(e.target.value))}
                  className="w-full sd-range-slider"
                />
                <div className="flex justify-between text-[10px] font-mono-num text-[#4D554E] mt-1">
                  <span>14 ft</span>
                  <span>48 ft</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#161A17] mb-2">
                  <label htmlFor="planner-width" className="inline-flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C22768]" />
                    <span>Width</span>
                  </label>
                  <span className="font-mono-num font-bold text-[#C22768]">{widthFt} ft</span>
                </div>
                <input
                  id="planner-width"
                  type="range"
                  min={12}
                  max={40}
                  step={1}
                  value={widthFt}
                  onChange={(e) => setWidthFt(Number(e.target.value))}
                  className="w-full sd-range-slider"
                />
                <div className="flex justify-between text-[10px] font-mono-num text-[#4D554E] mt-1">
                  <span>12 ft</span>
                  <span>40 ft</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#161A17] mb-2">
                  <label htmlFor="planner-students" className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#9A7200]" />
                    <span>Students</span>
                  </label>
                  <span className="font-mono-num font-bold text-[#161A17]">{studentCount}</span>
                </div>
                <input
                  id="planner-students"
                  type="range"
                  min={8}
                  max={45}
                  step={1}
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full sd-range-slider"
                />
                <div className="flex justify-between text-[10px] font-mono-num text-[#4D554E] mt-1">
                  <span>8</span>
                  <span>45 max</span>
                </div>
              </div>
            </div>

            {/* Finish Palette Selector */}
            <div className="pt-4 border-t border-[#EFEAD9] flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4D554E]">
                  Campus Finish Spec
                </p>
                <p className="text-xs font-semibold text-[#161A17] mt-0.5">
                  {plan.palette.name} · {plan.palette.woodTone}
                </p>
              </div>
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Finish palette">
                {FINISH_PALETTES.map((pal) => {
                  const selected = pal.id === finishPalette;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={pal.name}
                      onClick={() => setFinishPalette(pal.id)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#161A17] text-white border-[#161A17] shadow-xs'
                          : 'bg-[#FAF7F0] text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/60 shrink-0"
                        style={{ backgroundColor: pal.accentHex }}
                      />
                      <span className="hidden sm:inline">{pal.name.split('+')[1]?.trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scaled Interactive 2D Floor Blueprint Grid */}
            <div className="rounded-xl border border-[#DDD4BC] sd-blueprint-paper p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-num font-bold text-[#161A17]">
                    {plan.lengthFt} ft × {plan.widthFt} ft · {plan.areaSqFt} sq.ft
                  </span>
                  <span className="text-[#BDB6A3]">·</span>
                  <span className="text-xs font-mono-num text-[#4D554E]">
                    {plan.sqFtPerStudent} sq.ft / student
                  </span>
                </div>
                <span
                  data-testid="planner-flow-rating"
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${flowBadgeStyles}`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.flowRating}</span>
                </span>
              </div>

              {/* Proportioned Room Floor Plan Visualization */}
              <div className="flex justify-center py-2">
                <div
                  className="relative w-full rounded-lg border-2 bg-white/85 p-3 sm:p-4 transition-all duration-300 shadow-inner"
                  style={{
                    maxWidth: '520px',
                    minHeight: '170px',
                    borderColor: plan.palette.accentHex,
                    backgroundColor: plan.palette.surfaceTint,
                  }}
                >
                  {/* Teaching Wall / Front Chalkboard Marker */}
                  <div className="flex items-center justify-between text-[10px] font-mono-num uppercase tracking-wider text-[#4D554E] mb-3 pb-1.5 border-b border-dashed border-[#161A17]/20">
                    <span>Front Teaching Zone</span>
                    <span>Safe Rec: up to {plan.maxSafeCapacity} students</span>
                  </div>

                  {/* Dynamic Station Grid */}
                  <div
                    className="grid gap-1.5 sm:gap-2"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: plan.visualModulesCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-5 sm:h-6 rounded border bg-white/95 flex items-center justify-center transition-all duration-200"
                        style={{ borderColor: plan.palette.borderTint }}
                      >
                        <span
                          className="w-2.5 h-1.5 rounded-xs"
                          style={{ backgroundColor: plan.palette.accentHex }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-1.5 border-t border-dashed border-[#161A17]/15 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-num text-[#4D554E]">
                    <span>
                      Desk {plan.ergonomicSpec.deskHeightMm} mm · Seat {plan.ergonomicSpec.seatHeightMm} mm
                    </span>
                    <span>
                      {plan.ergonomicSpec.cornerRadius} · Clear Aisle {plan.recommendedAisleMm} mm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Calculated BOQ & 1-Click Procurement Actions */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E5DEC9] shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#EFEAD9]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C22768]">
                    Auto-Calculated Spec &amp; Kit
                  </p>
                  <h3 className="text-lg font-extrabold text-[#161A17] mt-0.5">
                    {plan.wingLabel}
                  </h3>
                </div>
                <span className="font-mono-num text-xs font-bold text-[#4D554E]">
                  {totalUnitCount} Units
                </span>
              </div>

              {/* Spec Summary Line (Unboxed clean typography) */}
              <p className="text-xs text-[#4D554E] font-mono-num py-2.5 border-b border-[#EFEAD9]">
                {plan.ergonomicSpec.ageLabel} · Desk {plan.ergonomicSpec.deskHeightMm} mm · {plan.palette.name}
              </p>

              {/* Itemized BOQ */}
              <ul className="divide-y divide-[#F1EDE0] mt-1">
                {plan.items.map((item) => (
                  <li key={item.productHandle} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#161A17] leading-snug">
                        <span
                          className="font-mono-num mr-1.5"
                          style={{ color: plan.palette.accentHex }}
                        >
                          {item.qty}×
                        </span>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#4D554E] mt-0.5">{item.roleLabel}</p>
                    </div>
                    <div className="text-right shrink-0 font-mono-num">
                      {item.quoteOnly ? (
                        <span className="text-xs font-bold text-[#C22768]">Custom Quote</span>
                      ) : (
                        <>
                          <p className="text-xs sm:text-sm font-bold text-[#161A17]">
                            ₹{item.lineTotal.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-[#4D554E]">
                            ₹{item.unitPrice.toLocaleString('en-IN')} / unit
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E5DEC9] space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4D554E]">
                  Estimated Hardware Kit
                </span>
                <div className="text-right">
                  <span
                    data-testid="planner-subtotal"
                    className="text-xl font-extrabold font-mono-num text-[#161A17]"
                  >
                    ₹{plan.estimatedSubtotal.toLocaleString('en-IN')}
                  </span>
                  {plan.hasCustomQuoteItems && (
                    <span className="block text-[10px] font-semibold text-[#C22768]">
                      + Site-measured quote modules
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pricedItems.length > 0 && (
                  <button
                    type="button"
                    data-testid="planner-add-kit-btn"
                    onClick={handleAddKit}
                    className="sd-btn-sheen inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#007B36] hover:bg-[#005D28] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                  >
                    {addedFeedback ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kit Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add Kit to Cart</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  data-testid="planner-quote-btn"
                  onClick={handleOpenQuote}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    pricedItems.length === 0 ? 'sm:col-span-2 ' : ''
                  }border-[#C22768] bg-[#FDF2F7] hover:bg-[#fae2ed] text-[#C22768]`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Quote with BOQ</span>
                </button>
              </div>

              <a
                href={buildWhatsAppUrl('919312254660', plan.whatsappSummary)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-[#E5DEC9] hover:border-[#007B36] text-xs font-semibold text-[#161A17] hover:text-[#007B36] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#007B36]" />
                <span>Send Room Brief via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
