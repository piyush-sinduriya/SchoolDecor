import { useState } from 'react';
import { SlidersHorizontal, MessageCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { COLLECTIONS_SHOWCASE, PREVIEW_PRODUCTS, THEME_IMAGES } from '../data/previewCatalog';
import { MATERIAL_BRANDS, findBrandByCollection } from '../utils/campusLocations';
import {
  buildWhatsAppUrl,
  filterAndSortProducts,
  type StoreProduct,
} from '../utils/storefrontHelpers';
import { ProductCard } from './ProductCard';
import { MotionReveal, MotionStagger, MotionStaggerItem, PAGE_EASE_OUT } from './PageMotion';
import type { PreviewRoute } from './HeaderNav';

interface CollectionViewProps {
  handle: string;
  onNavigate: (r: PreviewRoute) => void;
  onQuickView: (p: StoreProduct) => void;
  onAddToCart: (p: StoreProduct) => void;
  onOpenQuote: (title?: string) => void;
  compareIds?: string[];
  onToggleCompare?: (p: StoreProduct) => void;
}

export function CollectionView({
  handle,
  onNavigate,
  onQuickView,
  onAddToCart,
  onOpenQuote,
  compareIds = [],
  onToggleCompare,
}: CollectionViewProps) {
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [quoteMode, setQuoteMode] = useState<'all' | 'direct' | 'quote'>('all');
  const [productType, setProductType] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [ageWing, setAgeWing] = useState<'all' | 'early' | 'k12' | 'stem-outdoor'>('all');
  const [columns, setColumns] = useState<3 | 4>(3);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const AGE_WING_GROUPS: Record<'early' | 'k12' | 'stem-outdoor', string[]> = {
    early: [
      'activity-room',
      'kindergarten-furniture',
      'soft-play-zones',
      'jungle-play-zone',
      'sensory-equipment',
      'interactive-wall-panels',
      'montessori-material',
      'day-care',
      'sensory-room',
    ],
    k12: ['senior', 'library'],
    'stem-outdoor': [
      'outdoor-musical-instruments',
      'science-lab',
      'stem-lab',
      'computer-lab',
      'outdoor-fun-equipment',
      'flooring',
    ],
  };

  const matchedCollection = COLLECTIONS_SHOWCASE.find((c) => c.handle === handle);
  const matchedBrand = findBrandByCollection(handle);
  const title =
    matchedCollection?.title ||
    (handle === 'all'
      ? 'All School Decor Products'
      : handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

  const baseMatches = filterAndSortProducts(PREVIEW_PRODUCTS, {
    collectionHandle: handle === 'all' || ageWing !== 'all' ? undefined : handle,
    availabilityOnly,
    quoteOnlyFilter: quoteMode,
    productType,
    maxPrice,
    sortBy,
  }).filter((p) => {
    if (ageWing === 'all') return true;
    return AGE_WING_GROUPS[ageWing].includes(p.collectionHandle);
  });

  const displayed =
    baseMatches.length > 0 || availabilityOnly || quoteMode !== 'all' || productType !== 'all' || maxPrice !== null || ageWing !== 'all'
      ? baseMatches
      : PREVIEW_PRODUCTS;

  const types = Array.from(new Set(PREVIEW_PRODUCTS.map((p) => p.category)));

  return (
    <div className="bg-white">
      {/* Sunlit Porcelain Collection Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F5F1E6] to-[#FFFFFF] border-b border-[#E5DEC9] py-10 md:py-14">
        <div aria-hidden="true" className="absolute inset-0 sd-light-grid-bg opacity-55 pointer-events-none" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
            className="md:col-span-7"
          >
            <nav aria-label="Breadcrumb" className="text-xs text-[#4D554E] mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'home' })}
                className="hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span>Collections</span>
              <span>/</span>
              <span className="text-[#161A17] font-semibold">{title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block w-6 h-[3px] rounded-full bg-[#007B36]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                {matchedCollection?.tag || 'Curated Range'}
              </p>
              {matchedBrand && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono-num font-bold border"
                  style={{
                    backgroundColor: matchedBrand.surfaceTint,
                    color: matchedBrand.accentHex,
                    borderColor: `${matchedBrand.accentHex}38`,
                  }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{matchedBrand.name} · {matchedBrand.standard}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#161A17] tracking-tight">
              {title}
            </h1>
            <p className="text-[#4D554E] text-sm md:text-base mt-2.5 max-w-[56ch] leading-relaxed">
              Browse School Decor’s {title.toLowerCase()} range. Standard items support direct online checkout; customized institutional setups include CAD layout advice, bulk quotation, and WhatsApp support.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onOpenQuote(title)}
                className="sd-btn-sheen px-5 py-2.5 rounded-full bg-[#C22768] hover:bg-[#A11D54] text-white text-xs font-bold cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Request Collection Quote
              </button>
              <a
                href={buildWhatsAppUrl('919312254660', title, `https://www.schooldecor.in/collections/${handle}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#BCE3CB] bg-[#EAF7EF] hover:bg-[#ddf0e5] text-xs font-bold text-[#007B36] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#007B36]" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: PAGE_EASE_OUT }}
            className="md:col-span-5 aspect-[16/10] rounded-3xl overflow-hidden border border-[#E5DEC9] shadow-lg bg-white"
          >
            <img
              src={matchedCollection?.image || THEME_IMAGES.heroClassroom}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Interactive Partner Brand Collection Filter Pills */}
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 mt-8 pt-5 border-t border-[#E5DEC9] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D554E] mr-1">
            Shop by Brand Spec:
          </span>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              handle === 'all'
                ? 'bg-[#161A17] text-white border-[#161A17]'
                : 'bg-white text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
            }`}
          >
            All Catalog
          </button>
          {MATERIAL_BRANDS.map((b) => {
            const active = handle === b.collectionHandle;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: b.collectionHandle })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#007B36] text-white border-[#007B36] shadow-xs'
                    : 'bg-white text-[#161A17] border-[#E5DEC9] hover:border-[#007B36]'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-6 py-10">
        {/* Quick Student Age Wing Segmented Filter */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by student age wing">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D554E] mr-1">
              Age Wing:
            </span>
            {[
              { id: 'all' as const, label: 'All Wings' },
              { id: 'early' as const, label: 'Toddlers & Pre-K (2–6 Yrs)' },
              { id: 'k12' as const, label: 'Grades 1–12 & Library' },
              { id: 'stem-outdoor' as const, label: 'STEM Labs & Outdoor' },
            ].map((w) => (
              <button
                key={w.id}
                type="button"
                data-testid={`age-wing-${w.id}`}
                onClick={() => setAgeWing(w.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  ageWing === w.id
                    ? 'bg-[#161A17] text-white border-[#161A17] shadow-2xs'
                    : 'bg-[#FAF3EB] text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17] hover:text-[#161A17]'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
          {ageWing !== 'all' && (
            <button
              type="button"
              onClick={() => setAgeWing('all')}
              className="text-xs font-bold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Reset Age Wing
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-[#E5DEC9]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5DEC9] bg-[#FAF7F0] text-xs font-bold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <p className="text-sm text-[#4D554E] font-mono-num">
              Showing <strong className="text-[#161A17]">{displayed.length}</strong> curated units
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:inline-flex border border-[#E5DEC9] rounded-full overflow-hidden bg-[#FAF7F0] p-0.5">
              <button
                type="button"
                onClick={() => setColumns(3)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  columns === 3 ? 'bg-[#007B36] text-white' : 'text-[#4D554E]'
                }`}
              >
                3 Col
              </button>
              <button
                type="button"
                onClick={() => setColumns(4)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  columns === 4 ? 'bg-[#007B36] text-white' : 'text-[#4D554E]'
                }`}
              >
                4 Col
              </button>
            </div>
            <label htmlFor="preview-sort" className="sr-only">Sort products</label>
            <select
              id="preview-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 px-3.5 rounded-full border border-[#E5DEC9] bg-white text-xs font-semibold text-[#161A17]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className={`lg:col-span-3 border border-[#E5DEC9] rounded-2xl p-5 bg-[#FAF7F0] space-y-5 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#161A17]">Filter Catalog</h2>
              <button
                type="button"
                onClick={() => {
                  setAvailabilityOnly(false);
                  setQuoteMode('all');
                  setProductType('all');
                  setMaxPrice(null);
                }}
                className="text-xs font-bold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="border-t border-[#E5DEC9] pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4D554E] mb-2">Availability</p>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="accent-[#007B36]"
                />
                <span>Available Only</span>
              </label>
            </div>

            <div className="border-t border-[#E5DEC9] pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4D554E] mb-2">Purchase Mode</p>
              <div className="space-y-1.5 text-sm">
                {[
                  { val: 'all', label: 'All Products' },
                  { val: 'direct', label: 'Direct Online Purchase' },
                  { val: 'quote', label: 'Quotation Based' },
                ].map((opt) => (
                  <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quote-mode"
                      checked={quoteMode === opt.val}
                      onChange={() => setQuoteMode(opt.val as typeof quoteMode)}
                      className="accent-[#007B36]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E5DEC9] pt-4">
              <label htmlFor="filter-type" className="block text-xs font-bold uppercase tracking-wider text-[#4D554E] mb-2">
                Product Type
              </label>
              <select
                id="filter-type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[#E5DEC9] text-sm bg-white"
              >
                <option value="all">All Types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-[#E5DEC9] pt-4">
              <label htmlFor="filter-price" className="block text-xs font-bold uppercase tracking-wider text-[#4D554E] mb-2">
                Max Price ({maxPrice ? `₹${maxPrice.toLocaleString('en-IN')}` : 'Any'})
              </label>
              <input
                id="filter-price"
                type="range"
                min={5000}
                max={30000}
                step={2500}
                value={maxPrice ?? 30000}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full sd-range-slider"
              />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {displayed.length === 0 ? (
              <div className="p-10 border border-[#E5DEC9] bg-[#FAF7F0] rounded-2xl text-center space-y-3">
                <p className="text-sm text-[#4D554E]">No products match your selected filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setAvailabilityOnly(false);
                    setQuoteMode('all');
                    setProductType('all');
                    setMaxPrice(null);
                  }}
                  className="px-5 py-2 rounded-full border border-[#C22768] text-xs font-bold text-[#C22768] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <MotionStagger
                key={`${handle}-${sortBy}-${columns}`}
                className={`grid grid-cols-2 md:grid-cols-3 gap-2.5 min-[390px]:gap-3 sm:gap-4 md:gap-5 ${
                  columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                }`}
              >
                {displayed.map((p) => (
                  <MotionStaggerItem key={p.id}>
                    <ProductCard
                      product={p}
                      onOpenProduct={(h) => onNavigate({ page: 'product', handle: h })}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onOpenQuote={onOpenQuote}
                      isCompared={compareIds.includes(p.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </MotionStaggerItem>
                ))}
              </MotionStagger>
            )}
          </div>
        </div>

        {/* Custom Institutional Turnkey Strip */}
        <MotionReveal className="mt-14 rounded-3xl bg-gradient-to-r from-[#FAF3EB] via-[#FAF7F0] to-[#FDF2F7] border border-[#E5DEC9] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C22768] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need Room-by-Room Customization?</span>
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#161A17]">
              Request CAD Layout &amp; Institutional Pricing for {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenQuote(`Custom Wing Plan: ${title}`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#161A17] hover:bg-[#007B36] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </MotionReveal>
      </section>
    </div>
  );
}
