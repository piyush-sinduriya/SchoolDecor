import { Scale, Check, Eye } from 'lucide-react';
import type { StoreProduct } from '../utils/storefrontHelpers';

interface ProductCardProps {
  product: StoreProduct;
  onOpenProduct: (handle: string) => void;
  onQuickView: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  onOpenQuote: (title: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: StoreProduct) => void;
}

export function ProductCard({
  product,
  onOpenProduct,
  onQuickView,
  onAddToCart,
  onOpenQuote,
  isCompared = false,
  onToggleCompare,
}: ProductCardProps) {
  const onSale = !product.quoteOnly && product.compareAtPrice && product.compareAtPrice > product.price;
  const primaryIsCutout = Boolean(product.isCutout || product.images[0]?.includes('cutout_'));

  return (
    <article className="group flex flex-col bg-white border border-[#F3DCE6] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(238,125,168,0.15)] hover:border-[#F088B0]">
      {/* Crystal-Clear Product Image (Zero Black Tint) with Light Frosted Overlay Title */}
      <div className="relative aspect-[4/3] bg-[#FFFBFD] overflow-hidden border-b border-[#F8E5EE]">
        <button
          type="button"
          onClick={() => onOpenProduct(product.handle)}
          aria-label={product.title}
          className="relative block w-full h-full p-0 border-0 bg-transparent cursor-pointer text-left"
        >
          {primaryIsCutout ? (
            <div className="w-full h-full flex items-center justify-center p-3 sm:p-5 pb-12 sm:pb-14 bg-[radial-gradient(circle_at_50%_42%,#FFFFFF_0%,#FFF4F8_100%)]">
              <img
                src={product.images[0]}
                alt={product.title}
                loading="lazy"
                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(238,125,168,0.14)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-105"
              />
            </div>
          ) : (
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover brightness-[1.03] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          )}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 z-10 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          {/* Clean Light Frosted Glass Overlay Pill — Zero Black Shadow on Product */}
          <div className="absolute inset-x-2 bottom-2 sm:inset-x-2.5 sm:bottom-2.5 z-20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/92 group-hover:bg-[#FFF5F9]/95 backdrop-blur-md border border-[#F4CFE0] shadow-[0_4px_14px_rgba(33,37,41,0.08)] pointer-events-none transition-colors">
            <span className="block text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-[#D95B8A] truncate">
              {product.category}
            </span>
            <h3 className="text-[11.5px] sm:text-[13px] font-bold text-[#212529] group-hover:text-[#D95B8A] transition-colors leading-snug line-clamp-1">
              {product.title}
            </h3>
          </div>
        </button>

        {/* Top-Left Sale / Quotation Badge */}
        {onSale ? (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-30 px-2 py-0.5 rounded-full bg-[#EE7DA8] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-xs">
            Sale
          </span>
        ) : product.quoteOnly ? (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-30 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#F5C6D8] text-[#D95B8A] text-[9px] sm:text-[10px] font-bold tracking-wide shadow-2xs">
            Quotation
          </span>
        ) : null}

        {/* Top-Right Quick View Pill */}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.title}`}
          className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 z-30 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-white/92 hover:bg-white backdrop-blur-xs border border-[#F3DCE6] text-[10px] sm:text-[11px] font-semibold text-[#212529] hover:text-[#D95B8A] shadow-xs transition-all cursor-pointer"
        >
          <Eye className="w-3 h-3 text-[#EE7DA8]" />
          <span className="hidden sm:inline">Quick View</span>
        </button>
      </div>

      {/* Price, Specs & Actions Below Image */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 gap-1 sm:gap-1.5 bg-white">
        <div className="font-mono-num flex flex-wrap items-baseline justify-between gap-1.5">
          {product.quoteOnly ? (
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#D95B8A]">
              Custom Institutional Quote
            </span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] sm:text-sm md:text-base font-extrabold text-[#212529]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {onSale && product.compareAtPrice && (
                <s className="text-[10.5px] sm:text-xs text-[#888888]">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </s>
              )}
            </div>
          )}
        </div>

        {(product.dimensions || product.materials) && (
          <p className="hidden sm:block text-[11px] font-mono-num text-[#666666] line-clamp-1">
            {product.dimensions || product.materials}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center gap-1.5 sm:gap-2">
          {product.quoteOnly ? (
            <button
              type="button"
              onClick={() => onOpenQuote(product.title)}
              className="flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-[#F088B0] bg-[#FFF7FA] text-[#D95B8A] hover:bg-[#EE7DA8] hover:text-white active:scale-[0.985] text-[11px] sm:text-xs font-bold transition-all cursor-pointer truncate"
            >
              Request Quote
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl bg-[#EE7DA8] hover:bg-[#E06694] active:scale-[0.985] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer truncate"
            >
              Add to Cart
            </button>
          )}

          {onToggleCompare && (
            <button
              type="button"
              data-testid={`compare-toggle-${product.id}`}
              aria-pressed={isCompared}
              aria-label={isCompared ? `Remove ${product.title} from comparison` : `Compare ${product.title}`}
              title={isCompared ? 'Added to Compare' : 'Compare Specs'}
              onClick={() => onToggleCompare(product)}
              className={`inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                isCompared
                  ? 'bg-[#212529] text-white border-[#212529]'
                  : 'bg-[#FFF9FC] text-[#555555] border-[#F3DCE6] hover:border-[#F088B0] hover:text-[#E56B98]'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 text-[#F088B0]" /> : <Scale className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{isCompared ? 'Added' : 'Compare'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
