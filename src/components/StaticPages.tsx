import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LOGO_SRC, THEME_IMAGES } from '../data/previewCatalog';
import { MATERIAL_BRANDS } from '../utils/campusLocations';
import { buildWhatsAppUrl, SCHOOL_DECOR_CONTACT, validateQuoteForm } from '../utils/storefrontHelpers';
import { BrandsShowcase } from './BrandsShowcase';
import { MotionReveal, MotionStagger, MotionStaggerItem, PAGE_EASE_OUT } from './PageMotion';
import { SchoolCampusMap } from './SchoolCampusMap';
import type { PreviewRoute } from './HeaderNav';

export function AboutPage({
  onNavigate,
  onOpenQuote,
}: {
  onNavigate: (r: PreviewRoute) => void;
  onOpenQuote: (t?: string) => void;
}) {
  const stats = [
    { num: '12+', label: 'Specialized Campus Wings', tone: '#007B36' },
    { num: '18mm', label: 'FSC European Birchwood Spec', tone: '#C22768' },
    { num: '2', label: 'Laxmi Nagar Office & Factory Units', tone: '#B88900' },
    { num: '100%', label: 'Rounded Child-Safe Chamfers', tone: '#D91B22' },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F5F1E6] to-[#FFFFFF] border-b border-[#E5DEC9] py-12 md:py-16">
        <div aria-hidden="true" className="absolute inset-0 sd-light-grid-bg opacity-55 pointer-events-none" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: PAGE_EASE_OUT }}
            className="lg:col-span-6 aspect-[4/3] rounded-3xl overflow-hidden border border-[#E5DEC9] shadow-lg bg-white"
          >
            <img
              src={THEME_IMAGES.schoolLibrary}
              alt="School Decor interiors"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.08, ease: PAGE_EASE_OUT }}
            className="lg:col-span-6"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-block w-6 h-[3px] rounded-full bg-[#007B36]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">About School Decor</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#161A17] tracking-tight leading-[1.08]">
              Designing Functional, Inspiring{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">Educational Spaces</span>
            </h1>
            <p className="mt-4 text-[#4D554E] leading-relaxed">
              School Decor brings together ergonomic classroom furniture, early-years Montessori environments, active soft play zones, science and STEM laboratories, outdoor play parks and specialized campus flooring.
            </p>
            <p className="mt-3 text-[#4D554E] leading-relaxed">
              We partner with school founders, principals, architects and educational trusts across India to configure layouts and equipment suited for daily classroom durability and joyful learning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
                className="sd-btn-sheen group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-sm font-bold cursor-pointer shadow-sm"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onOpenQuote()}
                className="px-6 py-3 rounded-full bg-white hover:bg-[#FDF2F7] border border-[#E5DEC9] hover:border-[#C22768] text-sm font-bold text-[#161A17] cursor-pointer transition-colors"
              >
                Request a Quote
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architectural Spec Metrics */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-6 py-12">
        <MotionStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((s) => (
            <MotionStaggerItem key={s.label}>
              <div className="rounded-2xl bg-[#FAF7F0] border border-[#E5DEC9] p-6 text-center hover:-translate-y-1 transition-transform">
                <p
                  className="text-3xl md:text-4xl font-extrabold font-mono-num"
                  style={{ color: s.tone }}
                >
                  {s.num}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#161A17]">{s.label}</p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {/* Material Engineering Standards Matrix */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-6 pb-12">
        <div className="rounded-3xl border border-[#E5DEC9] bg-[#FAF7F0] p-6 sm:p-8 overflow-x-auto">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
              Engineering Benchmark
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#161A17] mt-1">
              Material &amp; Safety Standards Matrix
            </h2>
            <p className="sm:hidden text-[11px] font-mono-num text-[#4D554E] mt-1">
              ← Swipe table horizontally to view all columns →
            </p>
          </div>
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5DEC9] text-[#4D554E] uppercase text-[11px] tracking-wider">
                <th className="py-3 pr-4 font-bold">Core Material</th>
                <th className="py-3 pr-4 font-bold">Gauge / Thickness</th>
                <th className="py-3 pr-4 font-bold">Child Safety Standard</th>
                <th className="py-3 font-bold">Campus Cover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAD9] text-[#161A17]">
              {[
                ['FSC European Birch', '18mm Multi-Ply Veneer', 'R16 / R20 Chamfer · Zero-VOC PU', '5-Yr Structural Warranty'],
                ['Powder-Coated Frame', '1.6mm Cold-Rolled Steel', 'Anti-Chip Epoxy · Non-Marking Shoes', '7-Yr Frame & Weld Cover'],
                ['Soft-Play Foam Core', '28-Density High-Resilience PU', 'Phthalate-Free Antimicrobial Vinyl', '3-Yr Core Compression'],
                ['Lab Phenolic Resin', '19mm Solid Compact Top', 'SEFA Acid & 180°C Thermal Proof', '10-Yr Lab Surface Cover'],
              ].map(([mat, thick, safety, warranty]) => (
                <tr key={mat}>
                  <td className="py-3.5 pr-4 font-bold">{mat}</td>
                  <td className="py-3.5 pr-4 font-mono-num text-[#4D554E]">{thick}</td>
                  <td className="py-3.5 pr-4 text-[#007B36] font-semibold">{safety}</td>
                  <td className="py-3.5 font-mono-num font-bold">{warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Partner Brands Strip integrated cleanly on About Page */}
      <BrandsShowcase onNavigate={onNavigate} compact />
    </div>
  );
}

export function ProjectsPage({
  onNavigate,
  onOpenQuote,
}: {
  onNavigate?: (r: PreviewRoute) => void;
  onOpenQuote: (t?: string) => void;
}) {
  const [filterCat, setFilterCat] = useState<'all' | 'preschool' | 'classroom' | 'stem'>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const items = [
    {
      title: 'Early Years Wing & Montessori Setup',
      tag: 'preschool',
      category: 'Preschool & Montessori',
      location: 'New Delhi NCR · Studio Spec',
      highlight: '140 Birch Stations + Sensory Corner',
      footprint: '4,200 sq.ft (6 Classrooms)',
      turnaround: '14 Days Supply & Assembly',
      specSummary: 'Curved Montessori open cubbies, toddler height seating, acoustic mats, and tactile wall stations.',
      img: THEME_IMAGES.heroPreschool,
      collectionHandle: 'kindergarten-furniture',
    },
    {
      title: 'K-12 Classroom & Library Modernization',
      tag: 'classroom',
      category: 'Classroom & Library',
      location: 'Mumbai West · Institutional',
      highlight: '420 BIFMA Desks + Modular Reading Pods',
      footprint: '11,500 sq.ft (14 Sections + Library)',
      turnaround: '21 Days Phased Dispatch',
      specSummary: 'Height-graded Grades 1–12 ergonomic birch desks paired with curved amphitheater library stacks.',
      img: THEME_IMAGES.schoolLibrary,
      collectionHandle: 'senior',
    },
    {
      title: 'Composite STEM Lab & Outdoor Play Park',
      tag: 'stem',
      category: 'Laboratories & Outdoor',
      location: 'Bengaluru South · Campus Turnkey',
      highlight: 'Phenolic Island Benches + Multi-Play Zone',
      footprint: '6,800 sq.ft (Indoor Labs + Court)',
      turnaround: '24 Days Plumbing & Anchoring',
      specSummary: '8 six-seater phenolic science islands with brass gas/water turrets plus galvanized UV-8 playground.',
      img: THEME_IMAGES.scienceLab,
      collectionHandle: 'science-lab',
    },
  ];

  const filtered =
    filterCat === 'all' ? items : items.filter((item) => item.tag === filterCat);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F5F1E6] to-[#FFFFFF] border-b border-[#E5DEC9] py-12 md:py-14">
        <div aria-hidden="true" className="absolute inset-0 sd-light-grid-bg opacity-55 pointer-events-none" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-block w-6 h-[3px] rounded-full bg-[#C22768]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
                Installations &amp; Case Studies
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#161A17] tracking-tight">
              School &amp; Institutional{' '}
              <span className="font-script text-[1.18em] text-[#007B36]">Projects</span>
            </h1>
            <p className="text-[#4D554E] mt-2.5 text-sm md:text-base max-w-[60ch]">
              Explore turnkey educational installations across preschool wings, ergonomic senior classrooms, composite STEM laboratories, and outdoor play campuses.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {(
              [
                { id: 'all', label: 'All Wings' },
                { id: 'preschool', label: 'Preschool & Montessori' },
                { id: 'classroom', label: 'K-12 & Library' },
                { id: 'stem', label: 'STEM & Playgrounds' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterCat(btn.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  filterCat === btn.id
                    ? 'bg-[#161A17] text-white border-[#161A17]'
                    : 'bg-white text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-6 py-12">
        <MotionStagger key={filterCat} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <MotionStaggerItem key={p.title}>
              <article className="group border border-[#E5DEC9] rounded-3xl overflow-hidden bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-[4/3] bg-[#FAF7F0] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 border border-[#E5DEC9] text-[10px] font-mono-num font-bold text-[#161A17]">
                    {p.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono-num text-[#4D554E] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#007B36]" />
                      <span>{p.location}</span>
                    </p>
                    <h2 className="text-lg font-extrabold text-[#161A17] mt-1.5">{p.title}</h2>
                    <p className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF3EB] border border-[#E5DEC9] text-[#161A17] text-xs font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-[#007B36]" />
                      <span>{p.highlight}</span>
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setExpandedProject(expandedProject === p.title ? null : p.title)}
                        className="text-xs font-bold text-[#007B36] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {expandedProject === p.title ? 'Hide Installation Specs ▲' : 'Inspect Site Specs ▼'}
                      </button>
                      {expandedProject === p.title && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] text-xs space-y-1">
                          <p className="font-mono-num">
                            <strong className="text-[#161A17]">Footprint:</strong> {p.footprint}
                          </p>
                          <p className="font-mono-num">
                            <strong className="text-[#161A17]">Turnaround:</strong> {p.turnaround}
                          </p>
                          <p className="text-[#4D554E] leading-relaxed">{p.specSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EFEAD9] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenQuote(`Similar Project: ${p.title}`)}
                      className="text-xs font-bold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Request Similar Setup Quote →
                    </button>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate({ page: 'collection', handle: p.collectionHandle })
                        }
                        className="text-xs font-bold text-[#007B36] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        Shop Spec
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>
    </div>
  );
}

export function FaqPage({
  onNavigate,
  onOpenQuote,
}: {
  onNavigate?: (r: PreviewRoute) => void;
  onOpenQuote?: (t?: string) => void;
}) {
  const [openIdx, setOpenIdx] = useState(0);
  const [catFilter, setCatFilter] = useState<'all' | 'ordering' | 'custom' | 'materials'>('all');

  const faqs = [
    {
      cat: 'ordering',
      q: 'How do I request a custom school quotation?',
      a: 'Click Request a Quote on any product, collection, or header menu to submit your school name, city, and quantities. Our team prepares itemized institutional quotes within 24 business hours.',
    },
    {
      cat: 'ordering',
      q: 'Does School Decor support both online cart checkout and quotation-only items?',
      a: 'Yes. Standard catalog products can be added to the Cart Drawer and checked out via Shopify Checkout, while custom laboratories, playgrounds and flooring switch cleanly to Request a Quote and WhatsApp Enquiry.',
    },
    {
      cat: 'custom',
      q: 'Can we customize furniture sizes or colors for our school?',
      a: 'Many furniture, storage and play systems support custom dimensions, ergonomic seat heights (Grades K–12), and RAL finish coordination. Share your classroom measurements in the Quote Request form.',
    },
    {
      cat: 'materials',
      q: 'What child-safety and quality standards do your partner brands follow?',
      a: 'Our primary timber divisions utilize FSC-certified 18mm birch plywood with R16/R20 rounded chamfers and EN-71 child-safe PU seals, paired with 28-density antimicrobial soft-play foam and chemical-resistant 19mm lab phenolic resin.',
    },
    {
      cat: 'custom',
      q: 'Do you provide regional sample walkthroughs or pan-India delivery?',
      a: 'Yes. Visit our Experience Studios in New Delhi NCR, Mumbai, and Bengaluru, or coordinate regional dispatches via Hyderabad and Jaipur hubs for scheduled term-start installations.',
    },
  ];

  const visibleFaqs =
    catFilter === 'all' ? faqs : faqs.filter((item) => item.cat === catFilter);

  return (
    <div className="bg-gradient-to-b from-[#FAF7F0] via-[#FFFFFF] to-[#FFFFFF]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-block w-6 h-[3px] rounded-full bg-[#007B36]" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">
              Support &amp; Campus Knowledge Base
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#161A17] tracking-tight">
            Frequently Asked{' '}
            <span className="font-script text-[1.18em] text-[#007B36]">Questions</span>
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: 'All Topics' },
                { id: 'ordering', label: 'Ordering & Quotes' },
                { id: 'custom', label: 'Customization & Delivery' },
                { id: 'materials', label: 'Safety & Materials' },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setCatFilter(pill.id);
                  setOpenIdx(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  catFilter === pill.id
                    ? 'bg-[#161A17] text-white border-[#161A17]'
                    : 'bg-white text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          {visibleFaqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-white border-[#161A17] shadow-md'
                    : 'bg-white/85 border-[#E5DEC9] hover:border-[#161A17]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="font-bold text-sm md:text-base text-[#161A17]">{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4D554E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#007B36]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: PAGE_EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-[#4D554E] leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {(onOpenQuote || onNavigate) && (
          <MotionReveal className="mt-10 rounded-3xl bg-[#FAF7F0] border border-[#E5DEC9] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#C22768] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Still Have Campus Questions?</span>
              </p>
              <p className="text-base font-extrabold text-[#161A17] mt-1">
                Speak directly with our institutional project planners.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {onOpenQuote && (
                <button
                  type="button"
                  onClick={() => onOpenQuote('Campus Consultation Enquiry')}
                  className="px-5 py-2.5 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-bold cursor-pointer"
                >
                  Request Consultation
                </button>
              )}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'contact' })}
                  className="px-5 py-2.5 rounded-full bg-white border border-[#E5DEC9] text-xs font-bold text-[#161A17] cursor-pointer hover:border-[#161A17]"
                >
                  Open Studio Map
                </button>
              )}
            </div>
          </MotionReveal>
        )}
      </div>
    </div>
  );
}

export function ContactPage({ onOpenQuote }: { onOpenQuote?: (title?: string) => void }) {
  const [purpose, setPurpose] = useState<'New Campus Setup' | 'Classroom Upgrade' | 'Tender / BOQ' | 'Studio Visit'>('New Campus Setup');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    institution: '',
    productName: '',
    quantity: '',
    location: '',
    requirements: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const check = validateQuoteForm({
      ...form,
      requirements: `[${purpose}] ${form.requirements}`.trim(),
    });
    if (!check.valid) {
      setErrors(check.errors);
      setSent(false);
      return;
    }
    setErrors([]);
    setSent(true);
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F5F1E6] to-[#FFFFFF] border-b border-[#E5DEC9] py-12 md:py-16">
        <div aria-hidden="true" className="absolute inset-0 sd-light-grid-bg opacity-55 pointer-events-none" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: PAGE_EASE_OUT }}
            className="lg:col-span-5 space-y-4"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-block w-6 h-[3px] rounded-full bg-[#C22768]" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#C22768]">Get In Touch</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#161A17] tracking-tight">
                Contact{' '}
                <span className="font-script text-[1.18em] text-[#007B36]">School Decor</span>
              </h1>
              <p className="text-sm text-[#4D554E] mt-2 leading-relaxed">
                Planning a new campus, upgrading classrooms or requesting institutional specifications? Reach our regional project specialists directly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5 shadow-xs">
              <h2 className="text-sm font-extrabold text-[#161A17]">Registered Head Office &amp; Showroom</h2>
              <p className="text-xs font-bold text-[#007B36]">{SCHOOL_DECOR_CONTACT.name} (Proprietor)</p>
              <p className="text-xs text-[#4D554E] leading-relaxed">
                {SCHOOL_DECOR_CONTACT.headOfficeAddress}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href={SCHOOL_DECOR_CONTACT.telHref} className="text-sm font-mono-num text-[#161A17] font-bold hover:text-[#007B36] hover:underline">
                  {SCHOOL_DECOR_CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${SCHOOL_DECOR_CONTACT.email}`} className="text-sm text-[#C22768] font-semibold hover:underline">
                  {SCHOOL_DECOR_CONTACT.email}
                </a>
              </div>
              <a
                href={SCHOOL_DECOR_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007B36] hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open Laxmi Nagar Head Office in Google Maps →</span>
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-2 shadow-xs">
              <h2 className="text-sm font-extrabold text-[#161A17]">School Decor Manufacturing Factory</h2>
              <p className="text-xs text-[#4D554E] leading-relaxed">
                {SCHOOL_DECOR_CONTACT.factoryAddress}
              </p>
              <a
                href={SCHOOL_DECOR_CONTACT.factoryMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C22768] hover:underline pt-0.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>View Delhi NCR Factory Location on Google Maps →</span>
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] space-y-2.5 shadow-xs">
              <h2 className="text-sm font-extrabold text-[#161A17]">WhatsApp Direct</h2>
              <p className="text-xs text-[#4D554E]">Instant product &amp; institutional project support with {SCHOOL_DECOR_CONTACT.name}.</p>
              <a
                href={buildWhatsAppUrl(SCHOOL_DECOR_CONTACT.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF3EB] border border-[#E5DEC9] space-y-1.5">
              <p className="text-xs font-bold text-[#007B36] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Verified Material Partner Network</span>
              </p>
              <p className="text-xs text-[#161A17] leading-relaxed">
                Sample swatches from {MATERIAL_BRANDS.slice(0, 3).map((b) => b.name).join(', ')} and more available on studio visit.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.08, ease: PAGE_EASE_OUT }}
            className="lg:col-span-7 p-6 md:p-8 rounded-3xl border border-[#E5DEC9] bg-white shadow-sm"
          >
            <h2 className="text-xl font-extrabold text-[#161A17] mb-3">Request a Quote / Send Enquiry</h2>
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#4D554E] mb-2">
                Enquiry Purpose
              </p>
              <div className="flex flex-wrap gap-2">
                {(['New Campus Setup', 'Classroom Upgrade', 'Tender / BOQ', 'Studio Visit'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPurpose(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      purpose === item
                        ? 'bg-[#161A17] text-white border-[#161A17]'
                        : 'bg-[#FAF3EB] text-[#4D554E] border-[#E5DEC9] hover:border-[#161A17]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {errors.length > 0 && (
              <div role="alert" className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold"><AlertCircle className="w-4 h-4" /><span>Please fix these fields:</span></div>
                <ul className="list-disc pl-5">{errors.map((err) => <li key={err}>{err}</li>)}</ul>
              </div>
            )}
            {sent ? (
              <div role="status" className="p-5 rounded-2xl bg-[#EAF7EF] border border-[#BCE3CB] text-[#007B36] text-sm flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Enquiry validated! In live Shopify, this sends directly to your store contact email.</span>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cp-name" className="block text-xs font-bold mb-1">Full Name *</label>
                  <input id="cp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div>
                  <label htmlFor="cp-phone" className="block text-xs font-bold mb-1">Phone *</label>
                  <input id="cp-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div>
                  <label htmlFor="cp-email" className="block text-xs font-bold mb-1">Email *</label>
                  <input id="cp-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div>
                  <label htmlFor="cp-inst" className="block text-xs font-bold mb-1">Institution Name *</label>
                  <input id="cp-inst" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cp-loc" className="block text-xs font-bold mb-1">City &amp; State *</label>
                  <input id="cp-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cp-req" className="block text-xs font-bold mb-1">Project Requirements *</label>
                  <textarea id="cp-req" rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#007B36]" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="sd-btn-sheen w-full py-3.5 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white font-bold text-sm cursor-pointer shadow-sm">
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Interactive Google Map Experience Studio Locator directly on Contact Page */}
      <SchoolCampusMap onOpenQuote={onOpenQuote} />
    </div>
  );
}

export function PolicyPage({ kind }: { kind: 'privacy' | 'terms' | 'shipping' }) {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms and Conditions',
    shipping: 'Shipping and Returns Policy',
  };
  return (
    <div className="bg-gradient-to-b from-[#FAF7F0] to-[#FFFFFF] py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: PAGE_EASE_OUT }}
          className="rounded-3xl bg-white border border-[#E5DEC9] p-6 sm:p-10 space-y-4 shadow-xs"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#C22768] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Policy</span>
          </p>
          <h1 className="text-3xl font-extrabold text-[#161A17]">{titles[kind]}</h1>
          <p className="text-sm md:text-base text-[#4D554E] leading-relaxed">
            This template automatically renders your store’s published Shopify Page content from <strong>Shopify Admin → Online Store → Pages</strong> or <strong>Settings → Policies</strong>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function StorefrontFooter({ onNavigate }: { onNavigate: (r: PreviewRoute) => void }) {
  const [activeMapTab, setActiveMapTab] = useState<'office' | 'factory'>('office');

  const mapQuery =
    activeMapTab === 'office'
      ? 'School+Decor+1/26A+Lalita+Park+Laxmi+Nagar+New+Delhi+110092'
      : 'School+Decor+Factory+Delhi';

  return (
    <footer className="bg-[#FFF4F8] border-t border-[#F7D4E3] pt-10 sm:pt-12 pb-6 text-[#333333]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Centered Top Brand Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="bg-transparent border-0 p-0 cursor-pointer"
          >
            <img
              src={LOGO_SRC}
              alt="School Decor"
              className="h-12 sm:h-14 w-auto max-w-[170px] object-contain mx-auto"
            />
          </button>
        </div>

        {/* 2-Column Split: Left Google Map Embed + Right Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-8 border-b border-[#F7D4E3]">
          {/* Left: Embedded Google Map with Laxmi Nagar Head Office / School Decor Factory Switcher */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#F7D4E3]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="inline-flex rounded-lg bg-[#FFF6FA] p-1 border border-[#F7D4E3]">
                <button
                  type="button"
                  onClick={() => setActiveMapTab('office')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    activeMapTab === 'office'
                      ? 'bg-[#EE7DA8] text-white'
                      : 'text-[#555555] hover:text-[#212529]'
                  }`}
                >
                  Laxmi Nagar Office
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapTab('factory')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    activeMapTab === 'factory'
                      ? 'bg-[#EE7DA8] text-white'
                      : 'text-[#555555] hover:text-[#212529]'
                  }`}
                >
                  School Decor Factory
                </button>
              </div>
              <a
                href={
                  activeMapTab === 'office'
                    ? SCHOOL_DECOR_CONTACT.googleMapsUrl
                    : SCHOOL_DECOR_CONTACT.factoryMapsUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E56B98] hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>

            <div className="w-full h-[230px] sm:h-[260px] rounded-xl overflow-hidden bg-[#F5F5F5] border border-[#E6E6E6]">
              <iframe
                title={
                  activeMapTab === 'office'
                    ? 'School Decor Corporate Office Laxmi Nagar New Delhi'
                    : 'School Decor Factory New Delhi'
                }
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Contact Details with Soft Pastel Pink Icons */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#333333]">Our 2 Official Locations</h3>

            <div className="space-y-3.5 text-sm text-[#444444]">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FADCE8] text-[#D95B8A] inline-flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </span>
                <p className="leading-relaxed">
                  <strong className="text-[#212529]">Laxmi Nagar Office &amp; Showroom:</strong>{' '}
                  {SCHOOL_DECOR_CONTACT.headOfficeAddress}{' '}
                  <a
                    href={SCHOOL_DECOR_CONTACT.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#E56B98] hover:underline ml-1"
                  >
                    (View Map ↗)
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FADCE8] text-[#D95B8A] inline-flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </span>
                <p className="leading-relaxed">
                  <strong className="text-[#212529]">School Decor Factory:</strong>{' '}
                  {SCHOOL_DECOR_CONTACT.factoryAddress}{' '}
                  <a
                    href={SCHOOL_DECOR_CONTACT.factoryMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#E56B98] hover:underline ml-1"
                  >
                    (Open Factory Map ↗)
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FADCE8] text-[#D95B8A] inline-flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono-num font-bold text-[#212529]">
                  <a href={SCHOOL_DECOR_CONTACT.telHref} className="hover:text-[#E56B98]">
                    {SCHOOL_DECOR_CONTACT.phoneDisplay} ({SCHOOL_DECOR_CONTACT.name})
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FADCE8] text-[#D95B8A] inline-flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <a
                  href={`mailto:${SCHOOL_DECOR_CONTACT.email}`}
                  className="font-medium text-[#212529] hover:text-[#E56B98]"
                >
                  {SCHOOL_DECOR_CONTACT.email}
                </a>
              </div>
            </div>

            {/* Quick Category & Page Links */}
            <div className="pt-3 border-t border-[#F7D4E3]">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#444444]">
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: 'kindergarten-furniture' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  Kindergarten Furniture
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: 'libraries' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  Library Furniture
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: 'senior' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  School Furniture
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: 'science-lab' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  Lab Furniture
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'projects' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  Delivered Projects
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'contact' })}
                  className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
                >
                  All Locations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policies */}
        <div className="pt-5 pb-14 sm:pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
          <p>© {new Date().getFullYear()} School Decor. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'policy', kind: 'privacy' })}
              className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'policy', kind: 'terms' })}
              className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'policy', kind: 'shipping' })}
              className="hover:text-[#E56B98] bg-transparent border-0 p-0 cursor-pointer"
            >
              Shipping &amp; Delivery
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
