import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Scale,
} from 'lucide-react';
import { LOGO_SRC, MEGA_MENUS, PREVIEW_PRODUCTS } from '../data/previewCatalog';

export type PreviewRoute =
  | { page: 'home' }
  | { page: 'collection'; handle: string }
  | { page: 'product'; handle: string }
  | { page: 'about' }
  | { page: 'projects' }
  | { page: 'contact' }
  | { page: 'faq' }
  | { page: 'quote'; productTitle?: string }
  | { page: 'policy'; kind: 'privacy' | 'terms' | 'shipping' };

interface HeaderNavProps {
  route: PreviewRoute;
  cartCount: number;
  compareCount?: number;
  onNavigate: (r: PreviewRoute) => void;
  onOpenCart: () => void;
  onOpenQuote: (productTitle?: string) => void;
  onOpenCompare?: () => void;
}

export function HeaderNav({
  route,
  cartCount,
  compareCount = 0,
  onNavigate,
  onOpenCart,
  onOpenQuote,
  onOpenCompare,
}: HeaderNavProps) {
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchMatches =
    searchQuery.trim().length >= 2
      ? PREVIEW_PRODUCTS.filter((p) =>
          `${p.title} ${p.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ).slice(0, 4)
      : [];

  const handleNav = (r: PreviewRoute) => {
    setActiveMega(null);
    setMobileOpen(false);
    setSearchOpen(false);
    onNavigate(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white border-b border-[#ECECEC] transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.07)]' : 'shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
        }`}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="relative max-w-[1320px] mx-auto px-3 sm:px-5 md:px-6 h-[78px] sm:h-[88px] lg:h-[96px] flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Mobile Menu Button + Desktop Logo */}
          <div className="flex items-center gap-2 min-w-[72px] lg:min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation"
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#E6E6E6] bg-[#FAFAFA] hover:bg-[#F2F2F2] text-[#212529] shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleNav({ page: 'home' })}
              aria-label="School Decor Home"
              className="hidden lg:inline-flex items-center py-1 cursor-pointer bg-transparent border-0 p-0 group shrink-0"
            >
              <img
                src={LOGO_SRC}
                alt="School Decor"
                className="h-[68px] xl:h-[76px] w-auto max-w-[225px] xl:max-w-[250px] object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </button>
          </div>

          {/* Centered Mobile & Tablet Logo (<1024px) */}
          <button
            type="button"
            onClick={() => handleNav({ page: 'home' })}
            aria-label="School Decor Home"
            className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center py-1 px-1 cursor-pointer bg-transparent border-0"
          >
            <img
              src={LOGO_SRC}
              alt="School Decor"
              className="h-[52px] min-[375px]:h-[56px] sm:h-[66px] md:h-[72px] w-auto max-w-[160px] min-[375px]:max-w-[178px] sm:max-w-[205px] md:max-w-[225px] object-contain block"
            />
          </button>

          {/* Center: ONLY Product Categories Navigation */}
          <nav
            className="hidden lg:flex items-center h-full gap-3.5 xl:gap-5"
            aria-label="Product Categories Navigation"
          >
            {MEGA_MENUS.map((menu) => {
              const isCurrentCategory =
                route.page === 'collection' &&
                (route.handle === menu.href ||
                  menu.columns.some((col) => col.links.some((l) => l.handle === route.handle)));

              return (
                <div
                  key={menu.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMega(menu.label)}
                >
                  <button
                    type="button"
                    onClick={() => handleNav({ page: 'collection', handle: menu.href })}
                    aria-expanded={activeMega === menu.label}
                    className={`inline-flex items-center gap-1 h-full text-[13px] xl:text-[14px] font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                      activeMega === menu.label || isCurrentCategory
                        ? 'text-[#E56B98] border-[#F088B0]'
                        : 'text-[#212529] border-transparent hover:text-[#E56B98]'
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-75 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Right: Search, Cart & Quote Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {onOpenCompare && compareCount > 0 && (
              <button
                type="button"
                onClick={onOpenCompare}
                aria-label={`Open specification comparison (${compareCount} units)`}
                className="relative inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full border border-[#F088B0]/50 bg-[#FFF5F9] text-xs font-bold text-[#212529] cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#E56B98]" />
                <span className="font-mono-num text-[11px] text-[#E56B98] font-extrabold">
                  {compareCount}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search catalog"
              className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full hover:bg-[#FFF5F9] text-[#212529] cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="relative w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full hover:bg-[#FFF5F9] text-[#212529] cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EE7DA8] text-white text-[10.5px] font-bold flex items-center justify-center font-mono-num shadow-2xs">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="hidden sm:inline-flex items-center justify-center px-4 md:px-5 py-2 rounded-full bg-[#EE7DA8] hover:bg-[#E06694] text-white text-xs md:text-[13.5px] font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Get Quote
            </button>
          </div>
        </div>

        {/* Desktop Category Mega Menu Panel */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16 }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#F6D5E3] shadow-xl py-7 z-50"
            >
              {(() => {
                const mega = MEGA_MENUS.find((m) => m.label === activeMega);
                if (!mega) return null;
                return (
                  <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-12 gap-8 items-start">
                    <div className="col-span-7 grid grid-cols-2 gap-8">
                      {mega.columns.map((col) => (
                        <div key={col.heading}>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E56B98] mb-3">
                            {col.heading}
                          </h3>
                          <ul className="space-y-2">
                            {col.links.map((lnk) => (
                              <li key={lnk.handle + lnk.title}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNav({ page: 'collection', handle: lnk.handle })
                                  }
                                  className="text-sm text-[#555555] hover:text-[#E56B98] hover:underline text-left bg-transparent border-0 p-0 cursor-pointer transition-colors"
                                >
                                  {lnk.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNav({ page: 'collection', handle: mega.href })}
                      className="col-span-5 text-left bg-[#FFF8FB] border border-[#F6D5E3] rounded-xl overflow-hidden hover:border-[#EE7DA8] transition-colors cursor-pointer p-0"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={mega.featuredImage}
                          alt={mega.featuredTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-sm text-[#212529]">{mega.featuredTitle}</p>
                        <p className="text-xs text-[#666666] mt-1">{mega.featuredDesc}</p>
                      </div>
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Predictive Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#F6D5E3] bg-white py-4 shadow-lg">
            <div className="max-w-[1320px] mx-auto px-4 md:px-6">
              <div className="flex items-center gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search kindergarten tables, classroom desks, library shelving, lab tables, student chairs..."
                  aria-label="Search School Decor catalog"
                  autoFocus
                  className="flex-1 h-11 px-4 rounded-lg border border-[#F2C6D8] bg-[#FFF9FC] text-sm focus:outline-none focus:border-[#EE7DA8]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-[#FFF5F9] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {searchQuery.trim().length >= 2 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {searchMatches.length === 0 ? (
                    <p className="text-sm text-[#666666]">
                      No matching products found for “{searchQuery}”.
                    </p>
                  ) : (
                    searchMatches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNav({ page: 'product', handle: item.handle })}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-[#F6D5E3] hover:border-[#EE7DA8] text-left bg-white cursor-pointer"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-md shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#212529] truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#E56B98] font-semibold mt-0.5 font-mono-num">
                            {item.quoteOnly
                              ? 'Request Quote'
                              : `₹${item.price.toLocaleString('en-IN')}`}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Categories Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile categories menu"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[min(340px,86vw)] h-full bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F6D5E3]">
              <img
                src={LOGO_SRC}
                alt="School Decor"
                className="h-12 w-auto max-w-[165px] object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close mobile menu"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-[#FFF5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {MEGA_MENUS.map((m) => (
                <details key={m.label} open className="border-b border-[#F8E2EC] pb-2">
                  <summary className="py-2 font-bold text-sm text-[#212529] cursor-pointer flex items-center justify-between">
                    <span>{m.label}</span>
                  </summary>
                  <div className="pl-3 pt-1 pb-2 space-y-1.5">
                    {m.columns
                      .flatMap((c) => c.links)
                      .map((lnk) => (
                        <button
                          key={lnk.handle + lnk.title}
                          type="button"
                          onClick={() => handleNav({ page: 'collection', handle: lnk.handle })}
                          className="block w-full text-left py-1 text-sm text-[#666666] hover:text-[#E56B98] bg-transparent border-0"
                        >
                          {lnk.title}
                        </button>
                      ))}
                  </div>
                </details>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuote();
                }}
                className="w-full mt-4 py-3 px-4 rounded-full bg-[#EE7DA8] hover:bg-[#E06694] text-white font-semibold text-sm text-center"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
