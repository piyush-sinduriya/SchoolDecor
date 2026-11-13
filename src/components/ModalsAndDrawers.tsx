import { useState, useEffect, type FormEvent } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import {
  calculateCartSubtotal,
  validateQuoteForm,
  buildWhatsAppUrl,
  type CartItem,
  type StoreProduct,
} from '../utils/storefrontHelpers';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, variant: string, qty: number) => void;
  onRemove: (productId: string, variant: string) => void;
}

export function CartDrawer({ open, items, onClose, onUpdateQty, onRemove }: CartDrawerProps) {
  const [note, setNote] = useState('');
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  if (!open) return null;
  const subtotal = calculateCartSubtotal(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[min(440px,100vw)] h-full bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E5E0]">
          <h2 className="font-bold text-lg text-[#181A18]">
            Your Cart <span className="text-[#525852] font-normal font-mono-num">({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-[#525852] text-sm">Your cart is currently empty.</p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-md bg-[#007B36] text-white text-sm font-semibold cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variant}`}
                  className="flex gap-3.5 pb-4 border-b border-[#E3E5E0]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-20 h-20 rounded-md bg-[#F7F7F5] border border-[#E3E5E0] shrink-0 ${
                      item.image.includes('cutout_') ? 'object-contain p-1.5' : 'object-cover'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#181A18]">{item.title}</p>
                    <p className="text-xs text-[#525852] mt-0.5">{item.variant}</p>
                    <p className="text-sm font-bold text-[#181A18] mt-1 font-mono-num">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="inline-flex items-center border border-[#E3E5E0] rounded-md">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.variant, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#F7F7F5] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold font-mono-num">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.variant, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.title}`}
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#F7F7F5] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.productId, item.variant)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="text-[#525852] hover:text-[#D91B22] p-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#E3E5E0] bg-[#F7F7F5] space-y-3">
            <div>
              <label htmlFor="preview-cart-note" className="block text-xs font-semibold text-[#181A18] mb-1">
                Institution / Order Notes
              </label>
              <textarea
                id="preview-cart-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="School name, delivery timeline or PO reference..."
                className="w-full px-3 py-2 text-xs rounded-md border border-[#E3E5E0] bg-white"
              />
            </div>
            <div className="flex items-center justify-between text-base font-bold">
              <span>Subtotal</span>
              <span className="font-mono-num">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-[#525852]">
              In Shopify live mode, clicking below routes directly to Shopify’s secure checkout.
            </p>
            {checkoutNotice && (
              <div className="p-2.5 rounded-md bg-[#EAF7EF] border border-[#BCE3CB] text-xs text-[#007B36]">
                Preview mode: Native Shopify <code>/checkout</code> preserves all store payment gateways and shipping rules once uploaded.
              </div>
            )}
            <button
              type="button"
              onClick={() => setCheckoutNotice(true)}
              className="w-full py-3 px-4 rounded-md bg-[#007B36] hover:bg-[#005D28] text-white font-semibold text-sm cursor-pointer"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#525852] hover:text-[#181A18] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuickViewModalProps {
  product: StoreProduct | null;
  onClose: () => void;
  onAddToCart: (product: StoreProduct, variant: string, qty: number) => void;
  onOpenQuote: (title: string) => void;
  onViewFull: (handle: string) => void;
}

export function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onOpenQuote,
  onViewFull,
}: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState('');

  useEffect(() => {
    if (product) setSelectedVariant(product.variants[0] || 'Standard');
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Quick view ${product.title}`}>
      <div className="fixed inset-0 bg-black/55" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F7F7F5] border border-[#E3E5E0] flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full ${
                product.isCutout || product.images[0]?.includes('cutout_')
                  ? 'object-contain p-5 drop-shadow-[0_14px_18px_rgba(24,26,24,0.16)]'
                  : 'object-cover'
              }`}
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#C22768]">{product.category}</p>
            <h2 className="text-xl font-bold text-[#181A18] mt-1">{product.title}</h2>
            <div className="mt-2 font-mono-num">
              {product.quoteOnly ? (
                <span className="text-sm font-semibold text-[#C22768]">Custom Institutional Pricing</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#181A18]">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.compareAtPrice && (
                    <s className="text-sm text-[#525852]">₹{product.compareAtPrice.toLocaleString('en-IN')}</s>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-[#525852] mt-3 leading-relaxed">{product.description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold text-[#181A18] mb-2">Configuration / Option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 text-xs rounded-md border cursor-pointer ${
                      (selectedVariant || product.variants[0]) === v
                        ? 'border-[#C22768] bg-[#FDF1F6] text-[#C22768] font-semibold'
                        : 'border-[#E3E5E0] text-[#525852]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {product.quoteOnly ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenQuote(product.title);
                  }}
                  className="w-full py-2.5 px-4 rounded-md bg-[#C22768] hover:bg-[#A11D54] text-white text-sm font-semibold cursor-pointer"
                >
                  Request a Quote
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedVariant || product.variants[0], 1);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-md bg-[#007B36] hover:bg-[#005D28] text-white text-sm font-semibold cursor-pointer"
                >
                  Add to Cart
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFull(product.handle);
                }}
                className="w-full py-2.5 px-4 rounded-md border border-[#E3E5E0] text-sm font-semibold text-[#181A18] hover:border-[#C22768] cursor-pointer"
              >
                View Full Product Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuoteModalProps {
  open: boolean;
  initialProduct?: string;
  initialRequirements?: string;
  initialQuantity?: string;
  onClose: () => void;
}

export function QuoteModal({
  open,
  initialProduct = '',
  initialRequirements = '',
  initialQuantity = '',
  onClose,
}: QuoteModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    institution: '',
    productName: initialProduct,
    quantity: initialQuantity,
    location: '',
    requirements: initialRequirements,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        productName: initialProduct || prev.productName,
        quantity: initialQuantity || prev.quantity,
        requirements: initialRequirements || prev.requirements,
      }));
      setErrors([]);
      setSubmitted(false);
    }
  }, [open, initialProduct, initialRequirements, initialQuantity]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const check = validateQuoteForm(form);
    if (!check.valid) {
      setErrors(check.errors);
      setSubmitted(false);
      return;
    }
    setErrors([]);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Request a Custom Quote">
      <div className="fixed inset-0 bg-black/55" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quote modal"
          className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs font-bold uppercase tracking-wider text-[#C22768]">Institutional Enquiry</p>
        <h2 className="text-2xl font-bold text-[#181A18] mt-1">Request a Custom Quote</h2>
        <p className="text-sm text-[#525852] mt-1">
          Share your school details and requirements. In Shopify, this form delivers directly to your store contact email or configured CRM webhook.
        </p>

        {errors.length > 0 && (
          <div role="alert" className="mt-4 p-3.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please check the following fields:</span>
            </div>
            <ul className="list-disc pl-5">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {submitted ? (
          <div role="status" className="mt-6 p-5 rounded-lg bg-[#EAF7EF] border border-[#BCE3CB] text-[#007B36] space-y-3">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>Quotation Request Ready</span>
            </div>
            <p className="text-sm text-[#181A18]">
              Validated enquiry for <strong>{form.institution}</strong> ({form.location}). You can also send these exact details immediately via WhatsApp:
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={buildWhatsAppUrl(
                  '919312254660',
                  `${form.productName || 'School Infrastructure'} (${form.institution}, ${form.location}, Qty: ${form.quantity || 'TBD'})`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#007B36] text-white text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-[#007B36] text-[#007B36] text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="qm-name" className="block text-xs font-semibold mb-1">Full Name *</label>
              <input
                id="qm-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Principal / Procurement Lead"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div>
              <label htmlFor="qm-phone" className="block text-xs font-semibold mb-1">Phone Number *</label>
              <input
                id="qm-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98XXXXXXXX"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div>
              <label htmlFor="qm-email" className="block text-xs font-semibold mb-1">Email Address *</label>
              <input
                id="qm-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="office@school.edu.in"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div>
              <label htmlFor="qm-inst" className="block text-xs font-semibold mb-1">Institution Name *</label>
              <input
                id="qm-inst"
                type="text"
                required
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="School or Preschool Name"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div>
              <label htmlFor="qm-prod" className="block text-xs font-semibold mb-1">Product / Category</label>
              <input
                id="qm-prod"
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="e.g. Kindergarten Furniture / Lab"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div>
              <label htmlFor="qm-qty" className="block text-xs font-semibold mb-1">Quantity</label>
              <input
                id="qm-qty"
                type="text"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g. 60 Desks / 3 Rooms"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="qm-loc" className="block text-xs font-semibold mb-1">Location (City, State) *</label>
              <input
                id="qm-loc"
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="qm-req" className="block text-xs font-semibold mb-1">Project Requirements *</label>
              <textarea
                id="qm-req"
                rows={3}
                required
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="Share age group, room count, timeline or customization details..."
                className="w-full px-3 py-2 text-sm rounded-md border border-[#E3E5E0]"
              />
            </div>
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-md bg-[#007B36] hover:bg-[#005D28] text-white font-semibold text-sm cursor-pointer"
              >
                Submit Quote Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
