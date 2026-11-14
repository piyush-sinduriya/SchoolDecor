import { Scale, Check } from 'lucide-react';
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
    <article className="group flex flex-col bg-white border border-[#E5DEC9] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-[#BDE2CB]">
      <div className="relative aspect-[4/3] bg-[#FAF7F0] overflow-hidden">
        <button
          type="button"
          onClick={() => onOpenProduct(product.handle)}
          aria-label={product.title}
          className="relative block w-full h-full p-0 border-0 bg-transparent cursor-pointer"
        >
          {primaryIsCutout ? (
            <div className="w-full h-full flex items-center justify-center p-4 pb-6 bg-[radial-gradient(circle_at_50%_45%,#FFFFFF_0%,#F6F2E8_100%)]">
              <div
                aria-hidden="true"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-3.5 rounded-full bg-[#161A17]/15 blur-md transition-all duration-500 group-hover:scale-x-110 group-hover:opacity-60"
              />
              <img
                src={product.images[0]}
                alt={product.title}
                loading="lazy"
                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_14px_18px_rgba(22,26,23,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:scale-105"
              />
            </div>
          ) : (
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          )}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </button>

        {onSale ? (
          <span className="absolute top-2.5 left-2.5 z-30 px-2 py-0.5 rounded bg-[#D91B22] text-white text-[10px] font-bold tracking-wider uppercase">
            Sale
          </span>
        ) : product.quoteOnly ? (
          <span className="absolute top-2.5 left-2.5 z-30 px-2 py-0.5 rounded bg-[#FDF2F7] border border-[#F4C5D8] text-[#C22768] text-[10px] font-bold tracking-wide">
            Quotation
          </span>
        ) : !product.available ? (
          <span className="absolute top-2.5 left-2.5 z-30 px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#4D554E] text-[10px] font-bold">
            Unavailable
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute right-2.5 bottom-2.5 z-30 px-2.5 py-1 rounded-lg bg-white/95 border border-[#E5DEC9] text-xs font-semibold text-[#161A17] opacity-100 sm:opacity-0 sm:translate-y-1.5 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-200 shadow-sm cursor-pointer"
        >
          Quick View
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4D554E]">
          {product.category}
        </p>
        <h3 className="text-sm md:text-base font-bold text-[#161A17] leading-snug">
          <button
            type="button"
            onClick={() => onOpenProduct(product.handle)}
            className="text-left hover:text-[#C22768] bg-transparent border-0 p-0 cursor-pointer"
          >
            {product.title}
          </button>
        </h3>

        <div className="font-mono-num flex items-baseline gap-2 mt-0.5">
          {product.quoteOnly ? (
            <span className="text-xs md:text-sm font-semibold text-[#C22768]">
              Custom Institutional Pricing
            </span>
          ) : (
            <>
              <span className="text-sm md:text-base font-bold text-[#161A17]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {onSale && product.compareAtPrice && (
                <s className="text-xs text-[#4D554E]">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </s>
              )}
            </>
          )}
        </div>

        {(product.dimensions || product.materials) && (
          <p className="text-[11px] font-mono-num text-[#4D554E] line-clamp-1 pt-0.5">
            {product.dimensions || product.materials}
          </p>
        )}

        <p className="text-xs text-[#4D554E]">
          {product.quoteOnly
            ? 'Made to Order · Custom Specification'
            : product.available
              ? 'In Stock · Dispatch Ready'
              : 'Currently Unavailable'}
        </p>

        <div className="mt-auto pt-3 flex items-center gap-2">
          {product.quoteOnly ? (
            <button
              type="button"
              onClick={() => onOpenQuote(product.title)}
              className="flex-1 py-2 px-3 rounded-lg border border-[#C22768] text-[#C22768] hover:bg-[#FDF2F7] active:scale-[0.985] text-xs font-bold transition-all cursor-pointer"
            >
              Request a Quote
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="sd-btn-sheen flex-1 py-2 px-3 rounded-lg bg-[#007B36] hover:bg-[#005D28] active:scale-[0.985] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer"
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
              className={`inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                isCompared
                  ? 'bg-[#161A17] text-white border-[#161A17]'
                  : 'bg-[#FAF7F0] text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17] hover:text-[#161A17]'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 text-[#A8E6BE]" /> : <Scale className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{isCompared ? 'Added' : 'Compare'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
