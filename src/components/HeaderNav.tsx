import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { LOGO_SRC, MEGA_MENUS, PREVIEW_PRODUCTS } from '../data/previewCatalog';
import { buildWhatsAppUrl, SCHOOL_DECOR_CONTACT } from '../utils/storefrontHelpers';

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
  onNavigate: (r: PreviewRoute) => void;
  onOpenCart: () => void;
  onOpenQuote: (productTitle?: string) => void;
}

export function HeaderNav({
  route,
  cartCount,
  onNavigate,
  onOpenCart,
  onOpenQuote,
}: HeaderNavProps) {
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchMatches = searchQuery.trim().length >= 2
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
      <div className="bg-[#005D28] text-white text-xs py-2">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium m-0">
            Complete School Furniture, Play Zones, Laboratories &amp; Campus Flooring Across India
          </p>
          <div className="hidden md:flex items-center gap-5">
            <a href={SCHOOL_DECOR_CONTACT.telHref} className="hover:underline opacity-95 font-medium">
              {SCHOOL_DECOR_CONTACT.name} · {SCHOOL_DECOR_CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${SCHOOL_DECOR_CONTACT.email}`} className="hover:underline opacity-95">
              {SCHOOL_DECOR_CONTACT.email}
            </a>
            <a
              href={buildWhatsAppUrl(SCHOOL_DECOR_CONTACT.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 h-[3px] w-full sd-ribbon-animate" aria-hidden="true">
        <span className="bg-[#F088B0]" />
        <span className="bg-[#F01818]" />
        <span className="bg-[#F8D000]" />
        <span className="bg-[#00A048]" />
      </div>

      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E5E0] transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : ''
        }`}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation"
              className="w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNav({ page: 'home' })}
            aria-label="School Decor Home"
            className="shrink-0 flex items-center cursor-pointer bg-transparent border-0 p-0 group"
          >
            <img
              src={LOGO_SRC}
              alt="School Decor"
              className="w-[118px] md:w-[144px] h-auto object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            />
          </button>

          <nav className="hidden lg:flex items-center gap-5" aria-label="Primary Storefront Navigation">
            {MEGA_MENUS.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setActiveMega(menu.label)}
              >
                <button
                  type="button"
                  onClick={() => handleNav({ page: 'collection', handle: menu.href })}
                  aria-expanded={activeMega === menu.label}
                  className={`inline-flex items-center gap-1 py-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                    activeMega === menu.label
                      ? 'text-[#C22768] border-[#C22768]'
                      : 'text-[#181A18] border-transparent hover:text-[#C22768]'
                  }`}
                >
                  <span>{menu.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleNav({ page: 'collection', handle: 'all' })}
              className={`py-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                route.page === 'collection' && route.handle === 'all'
                  ? 'text-[#C22768] border-[#C22768]'
                  : 'text-[#181A18] border-transparent hover:text-[#C22768]'
              }`}
            >
              School Decor
            </button>
            <button
              type="button"
              onClick={() => handleNav({ page: 'about' })}
              className={`py-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                route.page === 'about'
                  ? 'text-[#C22768] border-[#C22768]'
                  : 'text-[#181A18] border-transparent hover:text-[#C22768]'
              }`}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNav({ page: 'contact' })}
              className={`py-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                route.page === 'contact'
                  ? 'text-[#C22768] border-[#C22768]'
                  : 'text-[#181A18] border-transparent hover:text-[#C22768]'
              }`}
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search catalog"
              className="w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
            >
              <Search className="w-5 h-5 text-[#181A18]" />
            </button>
            <button
              type="button"
              onClick={() => handleNav({ page: 'quote' })}
              aria-label="Account and Institutional Quotes"
              className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
            >
              <User className="w-5 h-5 text-[#181A18]" />
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="relative w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#181A18]" />
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#007B36] text-white text-[11px] font-bold flex items-center justify-center font-mono-num">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Panel */}
        <AnimatePresence>
        {activeMega && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E3E5E0] shadow-xl py-8 z-50"
          >
            {(() => {
              const mega = MEGA_MENUS.find((m) => m.label === activeMega);
              if (!mega) return null;
              return (
                <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-12 gap-8 items-start">
                  <div className="col-span-7 grid grid-cols-2 gap-8">
                    {mega.columns.map((col) => (
                      <div key={col.heading}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C22768] mb-3">
                          {col.heading}
                        </h3>
                        <ul className="space-y-2">
                          {col.links.map((lnk) => (
                            <li key={lnk.handle + lnk.title}>
                              <button
                                type="button"
                                onClick={() => handleNav({ page: 'collection', handle: lnk.handle })}
                                className="text-sm text-[#525852] hover:text-[#C22768] hover:underline text-left bg-transparent border-0 p-0 cursor-pointer"
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
                    className="col-span-5 text-left bg-[#F7F7F5] border border-[#E3E5E0] rounded-lg overflow-hidden hover:border-[#C22768] transition-colors cursor-pointer"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={mega.featuredImage}
                        alt={mega.featuredTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-[#181A18]">{mega.featuredTitle}</p>
                      <p className="text-xs text-[#525852] mt-1">{mega.featuredDesc}</p>
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
          <div className="border-t border-[#E3E5E0] bg-white py-5 shadow-lg">
            <div className="max-w-[1320px] mx-auto px-4 md:px-6">
              <div className="flex items-center gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classroom desks, Montessori shelving, labs, outdoor play..."
                  aria-label="Search School Decor catalog"
                  autoFocus
                  className="flex-1 h-11 px-4 rounded-md border border-[#E3E5E0] bg-[#F7F7F5] text-sm focus:outline-none focus:border-[#C22768]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {searchQuery.trim().length >= 2 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {searchMatches.length === 0 ? (
                    <p className="text-sm text-[#525852]">No matching products found for “{searchQuery}”.</p>
                  ) : (
                    searchMatches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNav({ page: 'product', handle: item.handle })}
                        className="flex items-center gap-3 p-2.5 rounded-md border border-[#E3E5E0] hover:border-[#C22768] text-left bg-white cursor-pointer"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#181A18] truncate">{item.title}</p>
                          <p className="text-xs text-[#525852] mt-0.5 font-mono-num">
                            {item.quoteOnly ? 'Request Quote' : `₹${item.price.toLocaleString('en-IN')}`}
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[min(360px,88vw)] h-full bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E5E0]">
              <img src={LOGO_SRC} alt="School Decor" className="w-[110px] h-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close mobile menu"
                className="w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-[#F7F7F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {MEGA_MENUS.map((m) => (
                <details key={m.label} className="border-b border-[#E3E5E0] pb-2">
                  <summary className="py-2 font-semibold text-sm cursor-pointer flex items-center justify-between">
                    <span>{m.label}</span>
                  </summary>
                  <div className="pl-3 pt-1 pb-2 space-y-1.5">
                    {m.columns.flatMap((c) => c.links).map((lnk) => (
                      <button
                        key={lnk.handle + lnk.title}
                        type="button"
                        onClick={() => handleNav({ page: 'collection', handle: lnk.handle })}
                        className="block w-full text-left py-1 text-sm text-[#525852] hover:text-[#C22768] bg-transparent border-0"
                      >
                        {lnk.title}
                      </button>
                    ))}
                  </div>
                </details>
              ))}
              <button
                type="button"
                onClick={() => handleNav({ page: 'about' })}
                className="block w-full text-left py-2 font-semibold text-sm border-b border-[#E3E5E0] bg-transparent"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => handleNav({ page: 'projects' })}
                className="block w-full text-left py-2 font-semibold text-sm border-b border-[#E3E5E0] bg-transparent"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => handleNav({ page: 'contact' })}
                className="block w-full text-left py-2 font-semibold text-sm border-b border-[#E3E5E0] bg-transparent"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuote();
                }}
                className="w-full mt-4 py-3 px-4 rounded-md bg-[#007B36] text-white font-semibold text-sm"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
