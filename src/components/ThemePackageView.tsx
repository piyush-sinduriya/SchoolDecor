import { useState } from 'react';
import { Download, FolderOpen, CheckSquare, Square, FileCode2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { THEME_FILE_TREE } from '../data/previewCatalog';
import { MotionReveal, PAGE_EASE_OUT } from './PageMotion';

const CHECKLIST_ITEMS = [
  'Upload school-decor-shopify-theme.zip in Shopify Admin → Online Store → Themes → Add theme → Upload zip file',
  'Verify original School Decor logo displays cleanly on desktop, mobile and footer',
  'Enter real WhatsApp number (e.g. 9198XXXXXXXX) in Theme settings → WhatsApp & Quotation System',
  'Configure Google Maps API Key inside Experience Studios & Map Locator section in Theme Editor',
  'Connect Best Sellers, New Arrivals and Featured Products collections in Featured Products Tabs',
  'Connect 12 category collections in Explore Our Collections & Brand Partner cards',
  'Tag custom/quotation-only products with quote-only (or set metafield custom.enquiry_only = true)',
  'Enable Price, Availability and Product type filters in Shopify Search & Discovery app',
  'Assign page templates (about-us, contact, projects, faq, request-quote, policies) in Online Store → Pages',
  'Test Add to Cart, Cart Drawer quantity stepper, and Request a Quote form',
];

export function ThemePackageView() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (idx: number) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalFiles = THEME_FILE_TREE.reduce((acc, g) => acc + g.files.length, 0);

  return (
    <div className="bg-gradient-to-b from-[#FAF7F0] via-[#FFFFFF] to-[#FAF7F0]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
        {/* Top Download Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
          className="rounded-3xl overflow-hidden border border-[#005D28] shadow-md"
        >
          <div className="grid grid-cols-4 h-1 w-full sd-ribbon-animate" aria-hidden="true">
            <span className="bg-[#F088B0]" />
            <span className="bg-[#F01818]" />
            <span className="bg-[#F8D000]" />
            <span className="bg-[#00A048]" />
          </div>
          <div className="p-6 md:p-8 bg-[#005D28] text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F9B8D2]">
                Shopify Online Store 2.0 Deliverable
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
                School Decor Architectural Shopify Theme Package
              </h1>
              <p className="text-sm text-white/90 mt-2 max-w-2xl">
                Complete Liquid, HTML5, CSS3, Vanilla JS and JSON templates packaged with{' '}
                <code className="bg-white/15 px-1.5 py-0.5 rounded font-mono-num">layout/theme.liquid</code> at the exact ZIP root—including Brands Showcase, Studio Map Locator, Smart Planner &amp; Scroll Choreography.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="/school-decor-shopify-theme.zip"
                download="school-decor-shopify-theme.zip"
                className="sd-btn-sheen inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#007B36] font-extrabold text-sm hover:bg-[#EAF7EF] shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Theme ZIP ({totalFiles} Files)</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Plain-English Guide Grid */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] bg-white space-y-3 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#161A17]">1. How to Install in Shopify (Zero Coding)</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#4D554E]">
              <li>Click <strong>Download Theme ZIP</strong> above to save <code className="text-[#161A17]">school-decor-shopify-theme.zip</code>.</li>
              <li>Open your <strong>Shopify Admin</strong> → <strong>Online Store</strong> → <strong>Themes</strong>.</li>
              <li>Scroll to Theme library → click <strong>Add theme</strong> → <strong>Upload zip file</strong>.</li>
              <li>Select the downloaded ZIP and click <strong>Upload file</strong>.</li>
              <li>Click <strong>Customize</strong> to visually edit sections, upload photos, and link collections before clicking <strong>Publish</strong>.</li>
            </ol>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] bg-white space-y-3 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#161A17]">2. Logo, Brands, Map &amp; Collections Setup</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#4D554E]">
              <li><strong>Original Logo &amp; Matching Palette:</strong> Your exact <code className="text-[#161A17]">school-decor-logo.png</code> and logo-harmonized colors (Rose, Emerald, Crimson, Marigold) are preloaded. Customize via <strong>Theme settings → Colors</strong>.</li>
              <li><strong>Brands &amp; Regional Hubs:</strong> Customize the <em>Partner Brands Showcase</em> and <em>Regional Experience Studios Map</em> sections directly in Theme Editor.</li>
              <li><strong>Connect Collections:</strong> In <em>Explore Our Collections</em> and <em>Featured Products Tabs</em>, pick your existing Shopify collections—all URLs and prices load dynamically.</li>
              <li><strong>Quote-Only Products:</strong> Tag any custom product with <code className="text-[#161A17]">quote-only</code> (or price it at ₹0, or set metafield <code className="text-[#161A17]">custom.enquiry_only</code> to true) to replace Add to Cart with Request a Quote + WhatsApp Enquiry.</li>
            </ul>
          </div>
        </MotionReveal>

        {/* Theme Editor Settings Summary + File Tree */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-2xl border border-[#E5DEC9] bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-[#C22768]" />
              <h2 className="text-lg font-extrabold text-[#161A17]">Complete Shopify Theme File Structure</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEME_FILE_TREE.map((group) => (
                <div key={group.folder} className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9]">
                  <p className="text-xs font-bold font-mono-num text-[#C22768] mb-2">{group.folder}</p>
                  <ul className="space-y-1 text-xs text-[#4D554E] font-mono-num">
                    {group.files.map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-[#E5DEC9] bg-white shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#007B36]" />
                  <h2 className="text-lg font-extrabold text-[#161A17]">Launch Testing Checklist</h2>
                </div>
                <span className="text-xs font-bold font-mono-num text-[#007B36]">
                  {completedCount}/{CHECKLIST_ITEMS.length}
                </span>
              </div>
              <ul className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item, idx) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      className="w-full flex items-start gap-2.5 text-left text-xs text-[#161A17] hover:text-[#007B36] bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {checked[idx] ? (
                        <CheckSquare className="w-4 h-4 text-[#007B36] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#4D554E] shrink-0 mt-0.5" />
                      )}
                      <span className={checked[idx] ? 'line-through text-[#4D554E]' : ''}>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F0] space-y-2">
              <h3 className="text-sm font-extrabold text-[#161A17]">Product Metafields Reference</h3>
              <p className="text-xs text-[#4D554E]">
                Create in Shopify Admin → Settings → Custom data → Products:
              </p>
              <ul className="text-xs font-mono-num text-[#007B36] space-y-1">
                <li>custom.dimensions (Single line text)</li>
                <li>custom.materials (Single line text)</li>
                <li>custom.age_group (Single line text)</li>
                <li>custom.features (Rich text)</li>
                <li>custom.additional_info (Rich text)</li>
                <li>custom.enquiry_only (True / false)</li>
              </ul>
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
}
