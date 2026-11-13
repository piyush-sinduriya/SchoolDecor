import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { Download, Eye, PackageCheck, MessageCircle, RotateCcw } from 'lucide-react';
import { EntryLogoCurtain } from './components/EntryLogoCurtain';
import { HeaderNav, type PreviewRoute } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { CollectionView } from './components/CollectionView';
import { ProductDetailView } from './components/ProductDetailView';
import { ThemePackageView } from './components/ThemePackageView';
import {
  AboutPage,
  ProjectsPage,
  FaqPage,
  ContactPage,
  PolicyPage,
  StorefrontFooter,
} from './components/StaticPages';
import {
  CartDrawer,
  QuickViewModal,
  QuoteModal,
} from './components/ModalsAndDrawers';
import { CompareModal, CompareTrayBar } from './components/CompareTrayModal';
import { PREVIEW_PRODUCTS } from './data/previewCatalog';
import {
  buildWhatsAppUrl,
  type CartItem,
  type StoreProduct,
} from './utils/storefrontHelpers';

function shouldPlayInitialIntro(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') return false;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  return true;
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => shouldPlayInitialIntro());
  const [studioMode, setStudioMode] = useState<'preview' | 'package'>('preview');
  const [route, setRoute] = useState<PreviewRoute>({ page: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const [quoteModalState, setQuoteModalState] = useState<{
    open: boolean;
    productTitle?: string;
    requirements?: string;
    quantity?: string;
  }>({
    open: false,
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route]);

  const handleAddToCart = (product: StoreProduct, variant?: string, qty = 1) => {
    const v = variant || product.variants[0] || 'Standard';
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.variant === v);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.variant === v
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          variant: v,
          price: product.price,
          quantity: qty,
          image: product.images[0],
        },
      ];
    });
    setCartOpen(true);
  };

  const handleAddKitToCart = (
    kitItems: { productHandle: string; qty: number; variantOverride?: string }[]
  ) => {
    setCartItems((prev) => {
      let updated = [...prev];
      for (const entry of kitItems) {
        const prod = PREVIEW_PRODUCTS.find((p) => p.handle === entry.productHandle);
        if (!prod || prod.quoteOnly || entry.qty <= 0) continue;
        const v = entry.variantOverride || prod.variants[0] || 'Standard';
        const existingIdx = updated.findIndex(
          (i) => i.productId === prod.id && i.variant === v
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + entry.qty,
          };
        } else {
          updated.push({
            productId: prod.id,
            title: prod.title,
            variant: v,
            price: prod.price,
            quantity: entry.qty,
            image: prod.images[0],
          });
        }
      }
      return updated;
    });
    setCartOpen(true);
  };

  const handleToggleCompare = (product: StoreProduct) => {
    setCompareIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      const next = prev.length >= 3 ? [...prev.slice(1), product.id] : [...prev, product.id];
      return next;
    });
  };

  const comparedProducts = compareIds
    .map((id) => PREVIEW_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PREVIEW_PRODUCTS)[number] => Boolean(p));

  const handleUpdateQty = (productId: string, variant: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId, variant);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variant === variant ? { ...i, quantity: qty } : i
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variant === variant))
    );
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex flex-col bg-white text-[#181A18]">
      {quotaExceeded && (
        <div
          role="alert"
          className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm"
        >
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* Fixed 4-Color Architectural Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scaleProgress, transformOrigin: '0% 50%' }}
        className="fixed top-0 inset-x-0 h-[3px] z-[90] pointer-events-none bg-gradient-to-r from-[#F088B0] via-[#F8D000] to-[#00A048]"
      />
      {/* Non-sticky Theme Studio Utility Bar */}
      <div className="bg-[#181A18] text-white border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[#F088B0]" />
              <span className="w-2 h-2 rounded-full bg-[#F01818]" />
              <span className="w-2 h-2 rounded-full bg-[#F8D000]" />
              <span className="w-2 h-2 rounded-full bg-[#00A048]" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-[#F9B8D2] whitespace-nowrap">
              School Decor · Shopify OS 2.0 Theme
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full md:w-auto overflow-x-auto">
            <div className="inline-flex p-0.5 bg-white/10 rounded-md shrink-0">
              <button
                type="button"
                onClick={() => setStudioMode('preview')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                  studioMode === 'preview' ? 'bg-white text-[#181A18]' : 'text-white/85 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Preview</span>
                <span className="hidden sm:inline">Live Storefront Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setStudioMode('package')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                  studioMode === 'package' ? 'bg-white text-[#181A18]' : 'text-white/85 hover:text-white'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Theme &amp; Guide</span>
                <span className="hidden sm:inline">Theme Files &amp; Setup Guide</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowIntro(true)}
              aria-label="Replay entry logo animation"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Replay Logo</span>
            </button>

            <a
              href="/school-decor-shopify-theme.zip"
              download="school-decor-shopify-theme.zip"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-semibold border border-white/25 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Get ZIP</span>
              <span className="hidden sm:inline">Download Theme ZIP</span>
            </a>
          </div>
        </div>
      </div>

      <EntryLogoCurtain visible={showIntro} onDismiss={() => setShowIntro(false)} />

      {studioMode === 'package' ? (
        <main className="flex-1 bg-[#F7F7F5]">
          <ThemePackageView />
        </main>
      ) : (
        <>
          <HeaderNav
            route={route}
            cartCount={cartCount}
            onNavigate={setRoute}
            onOpenCart={() => setCartOpen(true)}
            onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
          />

          <main className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={
                  route.page === 'collection' || route.page === 'product'
                    ? `${route.page}-${route.handle}`
                    : route.page === 'policy'
                      ? `${route.page}-${route.kind}`
                      : route.page
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                {route.page === 'home' && (
                  <HomeView
                    onNavigate={setRoute}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                    onOpenQuoteWithBrief={(productTitle, requirements, quantity) =>
                      setQuoteModalState({ open: true, productTitle, requirements, quantity })
                    }
                    onAddKitToCart={handleAddKitToCart}
                    compareIds={compareIds}
                    onToggleCompare={handleToggleCompare}
                  />
                )}

                {route.page === 'collection' && (
                  <CollectionView
                    handle={route.handle}
                    onNavigate={setRoute}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                    compareIds={compareIds}
                    onToggleCompare={handleToggleCompare}
                  />
                )}

                {route.page === 'product' && (
                  <ProductDetailView
                    handle={route.handle}
                    onNavigate={setRoute}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                  />
                )}

                {route.page === 'about' && (
                  <AboutPage
                    onNavigate={setRoute}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                  />
                )}

                {route.page === 'projects' && (
                  <ProjectsPage
                    onNavigate={setRoute}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                  />
                )}

                {route.page === 'faq' && (
                  <FaqPage
                    onNavigate={setRoute}
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                  />
                )}

                {(route.page === 'contact' || route.page === 'quote') && (
                  <ContactPage
                    onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                  />
                )}

                {route.page === 'policy' && <PolicyPage kind={route.kind} />}
              </motion.div>
            </AnimatePresence>
          </main>

          <StorefrontFooter onNavigate={setRoute} />

          {/* Floating WhatsApp Corner Button */}
          <a
            href={buildWhatsAppUrl('919312254660')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Enquiry"
            className="fixed right-3 bottom-3 sm:right-4 sm:bottom-4 z-30 inline-flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-semibold shadow-lg border border-white/25 transition-transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <CompareTrayBar
            products={comparedProducts}
            onOpenModal={() => setCompareModalOpen(true)}
            onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
            onClear={() => setCompareIds([])}
          />

          {(cartOpen || quickViewProduct || quoteModalState.open || compareModalOpen) && (
            <>
              <CartDrawer
                open={cartOpen}
                items={cartItems}
                onClose={() => setCartOpen(false)}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveCartItem}
              />

              <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onAddToCart={handleAddToCart}
                onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
                onViewFull={(handle) => setRoute({ page: 'product', handle })}
              />

              <QuoteModal
                open={quoteModalState.open}
                initialProduct={quoteModalState.productTitle}
                initialRequirements={quoteModalState.requirements}
                initialQuantity={quoteModalState.quantity}
                onClose={() => setQuoteModalState({ open: false })}
              />

              <CompareModal
                open={compareModalOpen}
                products={comparedProducts}
                onClose={() => setCompareModalOpen(false)}
                onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
                onAddToCart={(p) => handleAddToCart(p)}
                onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
              />
            </>
          )}
        </>
      )}
    </div>
    </MotionConfig>
  );
}
