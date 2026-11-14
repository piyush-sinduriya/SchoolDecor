import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  WING_PACKAGES,
  calculateWingPackageEstimate,
  type WingEdition,
  type WingPackageId,
} from '../utils/wingPackages';
import type { PreviewRoute } from './HeaderNav';

interface CampusWingPackagesProps {
  onAddKitToCart: (
    items: { productHandle: string; qty: number; variantOverride?: string }[]
  ) => void;
  onOpenQuoteWithBrief: (
    title: string,
    requirements: string,
    quantity?: string
  ) => void;
  onNavigate?: (r: PreviewRoute) => void;
}

export function CampusWingPackages({
  onAddKitToCart,
  onOpenQuoteWithBrief,
  onNavigate,
}: CampusWingPackagesProps) {
  const [selectedId, setSelectedId] = useState<WingPackageId>('primary-classroom');
  const [edition, setEdition] = useState<WingEdition>('standard-pack');

  const estimate = calculateWingPackageEstimate(selectedId, edition);
  const { pkg } = estimate;
  const shoppableItems = pkg.items.filter((item) => !item.quoteOnly);

  const handleAddCompleteWing = () => {
    if (shoppableItems.length === 0) return;
    onAddKitToCart(
      shoppableItems.map((item) => ({
        productHandle: item.productHandle,
        qty: item.qty,
        variantOverride:
          edition === 'custom-branding'
            ? 'Custom School Branding'
            : undefined,
      }))
    );
  };

  return (
    <section
      id="campus-wing-packages"
      data-testid="campus-wing-packages"
      className="bg-[#FAF6EE] py-16 md:py-20 border-y border-[#E5DEC9] sd-lazy-section"
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        {/* Editorial Section Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#007B36]" />
              <span>Turnkey Campus Kits &amp; Institutional Bundles</span>
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#161A17] tracking-tight">
              Ready-to-Launch{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">
                Wing Starter Kits
              </span>
            </h2>
            <p className="text-sm md:text-base text-[#4D554E] mt-1.5 max-w-[60ch]">
              Skip manual piece-by-piece guesswork. Choose a pre-engineered campus wing kit tailored to student age, room capacity, and dispatch timeline.
            </p>
          </div>

          {/* Edition Toggle: Standard Ready Pack vs Custom School Branding */}
          <div
            className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 rounded-xl bg-white border border-[#E5DEC9] shadow-2xs"
            role="group"
            aria-label="Select kit configuration edition"
          >
            <button
              type="button"
              data-testid="wing-edition-standard"
              onClick={() => setEdition('standard-pack')}
              className={`px-2.5 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-xs font-bold text-center transition-colors cursor-pointer ${
                edition === 'standard-pack'
                  ? 'bg-[#161A17] text-white shadow-xs'
                  : 'text-[#4D554E] hover:text-[#161A17]'
              }`}
            >
              Ready-to-Ship (10% Off)
            </button>
            <button
              type="button"
              data-testid="wing-edition-custom"
              onClick={() => setEdition('custom-branding')}
              className={`px-2.5 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-xs font-bold text-center transition-colors cursor-pointer ${
                edition === 'custom-branding'
                  ? 'bg-[#C22768] text-white shadow-xs'
                  : 'text-[#4D554E] hover:text-[#161A17]'
              }`}
            >
              Custom RAL &amp; Logo (6% Off)
            </button>
          </div>
        </div>

        {/* 4 Wing Package Switcher Tabs */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 mb-6 sm:mb-7"
          role="tablist"
          aria-label="Choose campus wing kit"
        >
          {WING_PACKAGES.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`wing-tab-${item.id}`}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-[#161A17] text-white border-[#161A17] shadow-md -translate-y-0.5'
                    : 'bg-white text-[#161A17] border-[#E5DEC9] hover:border-[#161A17]'
                }`}
              >
                <span
                  className={`block text-[9.5px] sm:text-[10px] font-mono-num uppercase tracking-wider font-bold ${
                    active ? 'text-[#F8D000]' : 'text-[#C22768]'
                  }`}
                >
                  {item.ageGroup}
                </span>
                <span className="block text-[12.5px] sm:text-base font-extrabold mt-0.5 leading-snug">
                  {item.shortLabel}
                </span>
                <span
                  className={`block text-[10px] sm:text-[11px] mt-1 font-mono-num leading-snug ${
                    active ? 'text-white/75' : 'text-[#4D554E]'
                  }`}
                >
                  {item.capacityLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Split Details & Turnkey Pack Breakdown */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedId}-${edition}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left: Wing Engineering Profile & Dispatch Guarantees */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5DEC9] p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EFEAD9]">
                  <div>
                    <p className="text-[11px] font-mono-num uppercase tracking-wider text-[#C22768] font-bold">
                      {pkg.ageGroup} · {pkg.capacityLabel}
                    </p>
                    <h3
                      data-testid="wing-active-title"
                      className="text-xl sm:text-2xl font-extrabold text-[#161A17] mt-1"
                    >
                      {pkg.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#4D554E] leading-relaxed">
                  {pkg.summary}
                </p>

                {/* Architectural Metadata Hairline Grid */}
                <dl className="mt-5 pt-5 border-t border-[#EFEAD9] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#4D554E] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#007B36]" />
                      <span>Dispatch Window</span>
                    </dt>
                    <dd className="text-xs font-mono-num font-bold text-[#161A17] mt-1">
                      {pkg.dispatchTimeline}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#4D554E] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#007B36]" />
                      <span>Structural Cover</span>
                    </dt>
                    <dd className="text-xs font-bold text-[#161A17] mt-1">
                      {pkg.warrantyLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#4D554E] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007B36]" />
                      <span>Safety Compliance</span>
                    </dt>
                    <dd className="text-xs font-semibold text-[#161A17] mt-1 leading-snug">
                      {pkg.safetyStandard}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4 border-t border-[#EFEAD9] flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#4D554E]">
                  <strong className="text-[#161A17]">
                    {edition === 'standard-pack'
                      ? 'Natural Birch + Matte Charcoal'
                      : 'Custom School RAL Color & Logo Badge'}
                  </strong>{' '}
                  · Complete institutional packing list included
                </p>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({
                        page: 'collection',
                        handle: pkg.collectionHandle,
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    <span>Browse Individual Units</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Itemized Turnkey BOQ & Direct Procurement Actions */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5DEC9] p-6 sm:p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 pb-4 border-b border-[#EFEAD9]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#007B36]">
                    Included Furniture &amp; Zones
                  </p>
                  <p className="text-sm font-bold text-[#161A17] mt-0.5">
                    {estimate.editionLabel}
                  </p>
                </div>
                <span className="font-mono-num text-xs font-bold text-[#161A17] bg-[#FAF3EB] border border-[#E5DEC9] px-3 py-1 rounded-md">
                  {estimate.totalUnitCount} Total Units
                </span>
              </div>

              <ul className="divide-y divide-[#F1EDE0] mt-2">
                {pkg.items.map((item) => (
                  <li
                    key={`${item.productHandle}-${item.role}`}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#161A17]">
                        <span className="font-mono-num text-[#007B36] mr-1.5">
                          {item.qty}×
                        </span>
                        {item.title}
                      </p>
                      <p className="text-xs text-[#4D554E] mt-0.5">
                        {item.role}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm font-mono-num font-bold text-[#161A17] shrink-0">
                      {item.quoteOnly
                        ? 'Site Tender Spec'
                        : `₹${(item.qty * item.unitPrice).toLocaleString('en-IN')}`}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-[#E5DEC9] space-y-2">
                {estimate.baseShoppableTotal > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#4D554E] font-mono-num">
                    <span>
                      Direct Bundle Savings (
                      {Math.round(estimate.bundleDiscountRate * 100)}% Off)
                    </span>
                    <span className="text-[#007B36] font-bold">
                      -₹{estimate.bundleSavingsAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4D554E]">
                    {estimate.hasCustomQuoteItems
                      ? 'Ready Units Estimate (+ Site Spec)'
                      : 'Turnkey Wing Pack Total'}
                  </span>
                  <span
                    data-testid="wing-total-price"
                    className="text-2xl font-extrabold font-mono-num text-[#161A17]"
                  >
                    ₹{estimate.finalShoppableTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shoppableItems.length > 0 && (
                  <button
                    type="button"
                    data-testid="wing-add-cart-btn"
                    onClick={handleAddCompleteWing}
                    className="sd-btn-sheen inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {estimate.hasCustomQuoteItems
                        ? 'Add Standard Units'
                        : 'Add Complete Wing Pack'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  data-testid="wing-quote-btn"
                  onClick={() =>
                    onOpenQuoteWithBrief(
                      `Turnkey Kit: ${pkg.title}`,
                      estimate.quoteSummaryText,
                      `${estimate.totalUnitCount} Units (${pkg.capacityLabel})`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-[#FDF0F5] border border-[#C22768] text-[#C22768] text-xs sm:text-sm font-bold cursor-pointer transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Request Institutional Quote</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
