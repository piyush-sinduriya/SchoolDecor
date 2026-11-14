import { useState, useEffect } from 'react';
import { ZoomIn, Plus, Minus, MessageCircle, ShieldCheck, CheckCircle2, Scale } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PREVIEW_PRODUCTS } from '../data/previewCatalog';
import { findBrandByCollection } from '../utils/campusLocations';
import { calculateBulkTierPricing } from '../utils/wingPackages';
import { buildWhatsAppUrl, type StoreProduct } from '../utils/storefrontHelpers';
import { ProductCard } from './ProductCard';
import { MotionReveal, MotionStagger, MotionStaggerItem, PAGE_EASE_OUT } from './PageMotion';
import type { PreviewRoute } from './HeaderNav';

interface ProductDetailViewProps {
  handle: string;
  onNavigate: (r: PreviewRoute) => void;
  onAddToCart: (p: StoreProduct, variant: string, qty: number) => void;
  onQuickView: (p: StoreProduct) => void;
  onOpenQuote: (title?: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (p: StoreProduct) => void;
}

export function ProductDetailView({
  handle,
  onNavigate,
  onAddToCart,
  onQuickView,
  onOpenQuote,
  isCompared = false,
  onToggleCompare,
}: ProductDetailViewProps) {
  const product = PREVIEW_PRODUCTS.find((p) => p.handle === handle) || PREVIEW_PRODUCTS[0];
  const matchedBrand = findBrandByCollection(product.collectionHandle);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [detailTab, setDetailTab] = useState<'desc' | 'specs' | 'features' | 'info'>('desc');

  useEffect(() => {
    setActiveImg(0);
    setZoomed(false);
    setSelectedVariant(product.variants[0]);
    setQty(1);
  }, [product]);

  const related = PREVIEW_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const waHref = buildWhatsAppUrl(
    '919312254660',
    product.title,
    `https://www.schooldecor.in/products/${product.handle}`
  );

  return (
    <div className="bg-gradient-to-b from-[#FAF7F0] via-[#FFFFFF] to-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-[#4D554E] mb-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onNavigate({ page: 'home' })} className="hover:underline bg-transparent border-0 p-0 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collection', handle: product.collectionHandle })}
            className="hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#161A17] font-semibold">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: GALLERY */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
            className="lg:col-span-7"
          >
            {(() => {
              const currentSrc = product.images[activeImg] || product.images[0];
              const currentIsCutout = (product.isCutout && activeImg === 0) || currentSrc?.includes('cutout_');
              return (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E5DEC9] bg-gradient-to-br from-[#FAF7F0] to-[#F5F1E6] shadow-sm">
                  <div
                    aria-hidden="true"
                    className="absolute inset-8 rounded-full border border-dashed border-[#007B36]/15 sd-blueprint-spin pointer-events-none"
                  />
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSrc}
                      src={currentSrc}
                      alt={product.title}
                      initial={{ opacity: 0.4, scale: 0.96 }}
                      animate={{ opacity: 1, scale: zoomed ? 1.45 : 1 }}
                      exit={{ opacity: 0.3 }}
                      transition={{ duration: 0.28, ease: PAGE_EASE_OUT }}
                      onClick={() => setZoomed((z) => !z)}
                      className={`relative z-10 w-full h-full ${
                        currentIsCutout
                          ? 'object-contain p-7 sd-cutout-sticker'
                          : 'object-cover'
                      } ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    />
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => setZoomed((z) => !z)}
                    className="absolute right-4 bottom-4 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 border border-[#E5DEC9] text-xs font-bold shadow-xs cursor-pointer hover:border-[#161A17]"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{zoomed ? 'Reset Zoom' : 'Inspect Zoom'}</span>
                  </button>
                </div>
              );
            })()}

            {product.images.length > 1 && (
              <div className="flex gap-3 mt-3.5">
                {product.images.map((img, i) => {
                  const thumbIsCutout = (product.isCutout && i === 0) || img.includes('cutout_');
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={`w-22 h-18 rounded-2xl overflow-hidden border-2 bg-[#FAF7F0] cursor-pointer p-0 transition-transform hover:-translate-y-0.5 ${
                        activeImg === i ? 'border-[#C22768] shadow-sm' : 'border-[#E5DEC9]'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className={`w-full h-full ${thumbIsCutout ? 'object-contain p-1.5' : 'object-cover'}`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* RIGHT: DETAILS & PURCHASE / QUOTE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: PAGE_EASE_OUT }}
            className="lg:col-span-5 rounded-3xl bg-white border border-[#E5DEC9] p-6 sm:p-7 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                {product.category}
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
                  <span>{matchedBrand.name}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#161A17] mt-1.5 leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 font-mono-num flex items-baseline gap-3">
              {product.quoteOnly ? (
                <span className="text-lg font-extrabold text-[#C22768]">
                  Institutional Quotation Pricing
                </span>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-[#161A17]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && (
                    <s className="text-base text-[#4D554E]">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </s>
                  )}
                </>
              )}
            </div>

            <p className="text-xs font-semibold text-[#007B36] mt-2 inline-flex items-center gap-1.5 bg-[#EAF7EF] px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {product.quoteOnly
                  ? 'Custom Built / Institutional Order'
                  : product.available
                    ? 'Available for Order · Pan-India Dispatch'
                    : 'Currently Unavailable'}
              </span>
            </p>

            <p className="text-sm text-[#4D554E] mt-4 leading-relaxed">{product.description}</p>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#161A17] mb-2">
                Variant / Configuration
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      selectedVariant === v
                        ? 'border-[#C22768] bg-[#FDF1F6] text-[#C22768] shadow-xs'
                        : 'border-[#E5DEC9] bg-[#FAF7F0] text-[#4D554E] hover:border-[#161A17]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Institutional Volume Tier Calculator */}
            {!product.quoteOnly && product.price > 0 && (() => {
              const tier = calculateBulkTierPricing(product.price, qty);
              return (
                <div
                  data-testid="pdp-bulk-calculator"
                  className="mt-5 rounded-2xl bg-[#FAF3EB] border border-[#E5DEC9] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C22768]">
                      Institutional Batch Pricing
                    </span>
                    <span className="text-[11px] font-mono-num font-bold text-[#007B36]">
                      {tier.discountRate > 0
                        ? `Save ₹${tier.savingsTotal.toLocaleString('en-IN')} (${Math.round(tier.discountRate * 100)}% Off)`
                        : 'Select 20+ Units for 8%–14% Off'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { count: 1, label: 'Sample (1)' },
                      { count: 25, label: 'Class (25 · -8%)' },
                      { count: 60, label: 'Wing (60 · -14%)' },
                    ].map((preset) => (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => setQty(preset.count)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          qty === preset.count
                            ? 'bg-[#161A17] text-white border-[#161A17]'
                            : 'bg-white text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#E5DEC9] text-xs font-mono-num">
                    <span className="text-[#4D554E]">
                      Effective Unit Rate: <strong className="text-[#161A17]">₹{tier.unitPriceAfterDiscount.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="font-extrabold text-[#161A17]">
                      Batch: ₹{tier.batchTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center border border-[#E5DEC9] rounded-full bg-[#FAF7F0] p-0.5">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-10 inline-flex items-center justify-center rounded-full hover:bg-white cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold font-mono-num">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-10 inline-flex items-center justify-center rounded-full hover:bg-white cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {product.quoteOnly ? (
                <button
                  type="button"
                  onClick={() => onOpenQuote(product.title)}
                  className="sd-btn-sheen flex-1 h-11 px-6 rounded-full bg-[#C22768] hover:bg-[#A11D54] text-white text-sm font-bold cursor-pointer shadow-sm"
                >
                  Request a Quote
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedVariant, qty)}
                  className="sd-btn-sheen flex-1 h-11 px-6 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-sm font-bold cursor-pointer shadow-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {!product.quoteOnly && (
                <button
                  type="button"
                  onClick={() => onOpenQuote(product.title)}
                  className="py-2.5 px-4 rounded-full border border-[#F5C7DA] bg-[#FDF1F6] hover:bg-[#fadce9] text-xs font-bold text-[#C22768] cursor-pointer transition-colors"
                >
                  Request Bulk Quote
                </button>
              )}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#FAF3EB] border border-[#E5DEC9] text-[#161A17] text-xs font-bold hover:border-[#007B36] transition-colors ${
                  product.quoteOnly ? 'sm:col-span-2' : ''
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#007B36]" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Institutional Compliance & Compare Row */}
            <div className="mt-5 pt-4 border-t border-[#EFEAD9] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#4D554E]">
              <p className="font-mono-num">
                EN-71 Child Safe · Rounded Edge Profile · ISO-9001 QC
              </p>
              {onToggleCompare && (
                <button
                  type="button"
                  onClick={() => onToggleCompare(product)}
                  className={`inline-flex items-center gap-1.5 font-bold cursor-pointer bg-transparent border-0 p-0 ${
                    isCompared ? 'text-[#007B36]' : 'text-[#C22768] hover:underline'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Comparison Tray' : 'Add to Compare'}</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* BELOW PRODUCT DETAILS: ANIMATED TABS WITH layoutId INDICATOR */}
        <MotionReveal className="mt-14 pt-8 border-t border-[#E5DEC9]">
          <div className="flex overflow-x-auto no-scrollbar gap-5 sm:gap-6 border-b border-[#E5DEC9] mb-6 whitespace-nowrap" role="tablist">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: 'Specifications & Dimensions' },
              { id: 'features', label: 'Product Features' },
              { id: 'info', label: 'Additional Information' },
            ].map((t) => {
              const active = detailTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDetailTab(t.id as typeof detailTab)}
                  className={`relative pb-3 text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer bg-transparent ${
                    active ? 'text-[#C22768]' : 'text-[#4D554E] hover:text-[#161A17]'
                  }`}
                >
                  <span>{t.label}</span>
                  {active && (
                    <motion.span
                      layoutId="pdp-tab-indicator"
                      className="absolute inset-x-0 -bottom-[1px] h-[2.5px] bg-[#C22768] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={detailTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: PAGE_EASE_OUT }}
            >
              {detailTab === 'desc' && (
                <p className="text-sm md:text-base text-[#4D554E] max-w-3xl leading-relaxed">
                  {product.description}
                </p>
              )}
              {detailTab === 'specs' && (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E5DEC9]">
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#4D554E]">Dimensions</dt>
                    <dd className="text-sm font-extrabold mt-1 font-mono-num text-[#161A17]">{product.dimensions}</dd>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E5DEC9]">
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#4D554E]">Materials</dt>
                    <dd className="text-sm font-extrabold mt-1 text-[#161A17]">{product.materials}</dd>
                  </div>
                </dl>
              )}
              {detailTab === 'features' && (
                <ul className="space-y-2.5 text-sm text-[#161A17] max-w-2xl">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#007B36] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {detailTab === 'info' && (
                <p className="text-sm text-[#4D554E] max-w-3xl leading-relaxed">
                  Available for institutional customization, room-by-room layout planning, and pan-India delivery. Specifications are pulled dynamically from Shopify product metafields (<code className="font-mono-num text-[#161A17]">custom.dimensions</code>, <code className="font-mono-num text-[#161A17]">custom.materials</code>, <code className="font-mono-num text-[#161A17]">custom.features</code>, <code className="font-mono-num text-[#161A17]">custom.additional_info</code>).
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </MotionReveal>

        {/* RELATED PRODUCTS */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#E5DEC9]">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#161A17] mb-5 sm:mb-6">Related Products</h2>
          <MotionStagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 min-[390px]:gap-3 sm:gap-4 md:gap-6">
            {related.map((p) => (
              <MotionStaggerItem key={p.id}>
                <ProductCard
                  product={p}
                  onOpenProduct={(h) => onNavigate({ page: 'product', handle: h })}
                  onQuickView={onQuickView}
                  onAddToCart={(prod) => onAddToCart(prod, prod.variants[0], 1)}
                  onOpenQuote={onOpenQuote}
                />
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </div>
    </div>
  );
}
