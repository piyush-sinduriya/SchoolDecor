import { X, Scale, ShoppingCart, FileText, Trash2 } from 'lucide-react';
import type { StoreProduct } from '../utils/storefrontHelpers';

interface CompareTrayBarProps {
  products: StoreProduct[];
  onOpenModal: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareTrayBar({
  products,
  onOpenModal,
  onRemove,
  onClear,
}: CompareTrayBarProps) {
  if (products.length === 0) return null;

  return (
    <div
      data-testid="compare-tray-bar"
      className="fixed left-4 bottom-4 z-30 max-w-[min(460px,calc(100vw-84px))] rounded-2xl bg-[#161A17] text-white shadow-2xl border border-white/15 px-3.5 py-2.5 flex items-center gap-3"
    >
      <div className="flex items-center gap-1.5 shrink-0">
        {products.map((p) => (
          <div key={p.id} className="relative group">
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-9 h-9 rounded-lg bg-white object-contain p-1"
            />
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              aria-label={`Remove ${p.title} from compare`}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D91B22] text-white flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono-num uppercase tracking-wider text-[#A8E6BE]">
          Spec Compare ({products.length}/3)
        </p>
        <p className="text-xs font-semibold truncate">
          {products.map((p) => p.title.split(' ').slice(0, 2).join(' ')).join(' vs ')}
        </p>
      </div>

      <button
        type="button"
        data-testid="open-compare-modal-btn"
        onClick={onOpenModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-bold whitespace-nowrap cursor-pointer"
      >
        <Scale className="w-3.5 h-3.5" />
        <span>Compare</span>
      </button>

      <button
        type="button"
        onClick={onClear}
        aria-label="Clear compare selection"
        className="p-1.5 text-white/65 hover:text-white cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface CompareModalProps {
  open: boolean;
  products: StoreProduct[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAddToCart: (product: StoreProduct) => void;
  onOpenQuote: (title: string) => void;
}

export function CompareModal({
  open,
  products,
  onClose,
  onRemove,
  onAddToCart,
  onOpenQuote,
}: CompareModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Side-by-Side Specification Comparison"
    >
      <div className="fixed inset-0 bg-black/55" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#E5DEC9]">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EFEAD9]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
              Side-by-Side Institutional Matrix
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#161A17] mt-0.5">
              Compare School Decor Specifications ({products.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison dialog"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-[#FAF7F0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <p className="text-sm text-[#4D554E]">
              Select up to 3 products using the Compare toggle on any catalog card to inspect dimensions and materials side-by-side.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#007B36] text-white text-xs font-bold cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EFEAD9]">
                  <th className="py-3 pr-4 w-36 text-xs font-bold uppercase tracking-wider text-[#4D554E] align-top">
                    Specification
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3 align-top min-w-[200px]">
                      <div className="relative rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] p-3 mb-2.5 flex items-center justify-center h-32">
                        <button
                          type="button"
                          onClick={() => onRemove(p.id)}
                          aria-label={`Remove ${p.title}`}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-[#E5DEC9] text-[#4D554E] hover:text-[#D91B22] flex items-center justify-center text-xs cursor-pointer"
                        >
                          ×
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className={`max-h-full max-w-full ${
                            p.isCutout || p.images[0]?.includes('cutout_')
                              ? 'object-contain'
                              : 'object-cover rounded-lg w-full h-full'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#C22768]">
                        {p.category}
                      </p>
                      <p className="font-bold text-[#161A17] leading-snug mt-0.5">{p.title}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EDE0]">
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Pricing</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 font-mono-num font-bold text-[#161A17]">
                      {p.quoteOnly ? (
                        <span className="text-[#C22768]">Custom Institutional Pricing</span>
                      ) : (
                        `₹${p.price.toLocaleString('en-IN')}`
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Dimensions</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 font-mono-num text-xs text-[#161A17]">
                      {p.dimensions || 'Site-Measured / Customizable'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Core Materials</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-xs text-[#4D554E]">
                      {p.materials || 'Institutional Grade'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Configurations</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-xs text-[#161A17]">
                      {p.variants.join(' · ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Key Highlights</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-xs text-[#4D554E]">
                      <ul className="space-y-1 list-disc pl-4">
                        {(p.features || []).slice(0, 3).map((feat) => (
                          <li key={feat}>{feat}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-[#4D554E]">Action</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3">
                      {p.quoteOnly ? (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenQuote(p.title);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#C22768] text-[#C22768] hover:bg-[#FDF2F7] text-xs font-bold cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Request Quote</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onAddToCart(p);
                            onClose();
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-bold cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
