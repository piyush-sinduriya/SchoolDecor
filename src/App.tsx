import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { MessageCircle, Phone, ChevronUp } from 'lucide-react';
import { EntryLogoCurtain } from './components/EntryLogoCurtain';
import { HeaderNav, type PreviewRoute } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { CollectionView } from './components/CollectionView';
import { ProductDetailView } from './components/ProductDetailView';
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
  return params.get('intro') !== '0';
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => shouldPlayInitialIntro());
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
      {/* Fixed Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scaleProgress, transformOrigin: '0% 50%' }}
        className="fixed top-0 inset-x-0 h-[3px] z-[90] pointer-events-none bg-[#F088B0]"
      />
      <EntryLogoCurtain visible={showIntro} onDismiss={() => setShowIntro(false)} />

      <HeaderNav
            route={route}
            cartCount={cartCount}
            compareCount={compareIds.length}
            onNavigate={setRoute}
            onOpenCart={() => setCartOpen(true)}
            onOpenQuote={(title) => setQuoteModalState({ open: true, productTitle: title })}
            onOpenCompare={() => setCompareModalOpen(true)}
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
                    isCompared={compareIds.some(
                      (cid) =>
                        PREVIEW_PRODUCTS.find((p) => p.handle === route.handle)?.id === cid
                    )}
                    onToggleCompare={handleToggleCompare}
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

          {/* Floating Right Action Stack: WhatsApp + Phone Call + Scroll Top */}
          <div className="fixed right-3 bottom-4 sm:right-4 sm:bottom-5 z-30 flex flex-col items-center gap-2.5">
            <a
              href={buildWhatsAppUrl('919312254660')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Enquiry"
              className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#1EB958] text-white inline-flex items-center justify-center shadow-lg ring-2 ring-[#F5A8C7] transition-transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>
            <a
              href="tel:+919312254660"
              aria-label="Call School Decor"
              className="w-11 h-11 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white inline-flex items-center justify-center shadow-lg ring-2 ring-[#F5A8C7] transition-transform hover:scale-105"
            >
              <Phone className="w-5 h-5 fill-current" />
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="w-10 h-10 rounded-md bg-[#EE7DA8] hover:bg-[#E06694] text-white inline-flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

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
    </div>
    </MotionConfig>
  );
}
