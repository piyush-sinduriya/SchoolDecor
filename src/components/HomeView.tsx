import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  Headphones,
  MessageCircle,
  Eye,
  Plus,
  Minus,
  CheckCircle2,
  Ruler,
  Scale,
} from 'lucide-react';
import {
  COLLECTIONS_SHOWCASE,
  CUTOUT_SHOWCASE_ITEMS,
  MARQUEE_WORDS_ROW_1,
  MARQUEE_WORDS_ROW_2,
  PREVIEW_PRODUCTS,
  PROCESS_STEPS,
  THEME_IMAGES,
} from '../data/previewCatalog';
import {
  ERGO_GRADE_PRESETS,
  FINISH_PALETTES,
  getFinishPalette,
  type FinishPaletteId,
} from '../utils/smartPlanner';
import { calculateBulkTierPricing } from '../utils/wingPackages';
import { buildWhatsAppUrl, type StoreProduct } from '../utils/storefrontHelpers';
import { ProductCard } from './ProductCard';
import { CampusWingPackages } from './CampusWingPackages';
import { BrandsShowcase } from './BrandsShowcase';
import { SchoolCampusMap } from './SchoolCampusMap';
import type { PreviewRoute } from './HeaderNav';

interface HomeViewProps {
  onNavigate: (r: PreviewRoute) => void;
  onQuickView: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  onOpenQuote: (title?: string) => void;
  onOpenQuoteWithBrief: (title: string, requirements: string, quantity?: string) => void;
  onAddKitToCart: (items: { productHandle: string; qty: number; variantOverride?: string }[]) => void;
  compareIds: string[];
  onToggleCompare: (product: StoreProduct) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HERO_SLIDES = [
  {
    id: 'banner-classrooms',
    tabLabel: 'Classrooms',
    eyebrow: 'School Furniture & Educational Infrastructure',
    titleLead: 'Designing Better Spaces for',
    titleScript: 'Brighter Futures',
    title: 'Designing Better Spaces for Brighter Futures',
    desc: 'Discover ergonomic classroom desks, contoured seating, modular storage and complete learning environments crafted for modern K-12 campuses.',
    highlightStat: 'Grades 1–12 Ergonomic Sizing · FSC 18mm Birchwood',
    image: THEME_IMAGES.heroClassroom,
    imageAlt: 'Sunlit modern K-12 school classroom furnished with ergonomic birchwood desks and chairs',
    accentHex: '#007B36',
    ctaLabel: 'Explore Classrooms',
    ctaTarget: { page: 'collection', handle: 'senior' } as PreviewRoute,
  },
  {
    id: 'banner-preschool',
    tabLabel: 'Preschool & Play',
    eyebrow: 'Early Years, Montessori & Active Play',
    titleLead: 'Crafted Classrooms That Spark',
    titleScript: 'Curious Minds',
    title: 'Crafted Classrooms That Spark Curious Minds',
    desc: 'Child-scaled birchwood classrooms, Montessori shelving bays, soft-play zones and tactile sensory corners crafted for joyful early learning.',
    highlightStat: 'R20 Safety Corners · EN-71 Zero-VOC Child-Safe Finishes',
    image: THEME_IMAGES.heroPreschool,
    imageAlt: 'Bright early years Montessori preschool interior with birch tables and soft play learning corner',
    accentHex: '#C22768',
    ctaLabel: 'Shop Kindergarten',
    ctaTarget: { page: 'collection', handle: 'kindergarten-furniture' } as PreviewRoute,
  },
  {
    id: 'banner-labs',
    tabLabel: 'STEM & Science Labs',
    eyebrow: 'Academic, Robotics & STEM Laboratories',
    titleLead: 'Future-Ready Labs Built for',
    titleScript: 'STEM Discovery',
    title: 'Future-Ready Labs Built for STEM Discovery',
    desc: '19mm chemical-resistant phenolic resin worktops, integrated utility turrets and ventilated glass bays engineered for senior wings.',
    highlightStat: 'SEFA Chemical Grade Tops · Complete Turnkey Lab Utility Lines',
    image: THEME_IMAGES.scienceLab,
    imageAlt: 'Composite chemistry and STEM school laboratory equipped with island workbenches',
    accentHex: '#007B36',
    ctaLabel: 'Explore Science Labs',
    ctaTarget: { page: 'collection', handle: 'science-lab' } as PreviewRoute,
  },
  {
    id: 'banner-outdoor',
    tabLabel: 'Outdoor Parks',
    eyebrow: 'Outdoor Playgrounds & Open-Air Gyms',
    titleLead: 'Safe Outdoor Parks Made for',
    titleScript: 'Active Growth',
    title: 'Safe Outdoor Parks Made for Active Growth',
    desc: 'Hot-dip galvanized multi-play climbers, UV-8 stabilized LLDPE slides, sensory parks and outdoor campus benches built for every season.',
    highlightStat: 'Galvanized Steel Frames · UV-8 Weather-Stabilized Chutes',
    image: THEME_IMAGES.outdoorPlay,
    imageAlt: 'Lush outdoor school playground park with multi-play slides and climbing towers',
    accentHex: '#C22768',
    ctaLabel: 'Explore Outdoor Parks',
    ctaTarget: { page: 'collection', handle: 'outdoor-fun-equipment' } as PreviewRoute,
  },
  {
    id: 'banner-libraries',
    tabLabel: 'Libraries & Flooring',
    eyebrow: 'Libraries, Surfacing & Turnkey Campuses',
    titleLead: 'Complete Campus Solutions',
    titleScript: 'Under One Roof',
    title: 'Complete Campus Solutions Under One Roof',
    desc: 'Acoustic reading pods, modular library shelving, shock-attenuating EPDM play surfacing and multi-sport courts with pan-India installation.',
    highlightStat: '5 Regional Experience Studios · Pan-India Institutional Dispatch',
    image: THEME_IMAGES.schoolLibrary,
    imageAlt: 'Modern curved birchwood school library and terraced student collaboration lounge',
    accentHex: '#007B36',
    ctaLabel: 'Browse Full Catalog',
    ctaTarget: { page: 'collection', handle: 'all' } as PreviewRoute,
  },
];

const LOGO_BAR_COLORS = [
  'bg-[#F088B0]',
  'bg-[#00A048]',
  'bg-[#F8D000]',
  'bg-[#F01818]',
];

const EDITORIAL_SHOWCASES = [
  {
    eyebrow: 'Classroom Furniture',
    title: 'Furniture for Modern Classrooms',
    desc: 'Ergonomic student desks, collaborative tables, library seating and modular classroom storage built for focus, posture and everyday school use.',
    specs: [
      'Grades 1–12 ergonomic seat height grading',
      'Scratch-resistant PU birch tops & steel trays',
      'Anti-skid non-marking institutional gliders',
    ],
    handle: 'kindergarten-furniture',
    image: THEME_IMAGES.heroClassroom,
    cutout: THEME_IMAGES.cutoutStudentDesk,
    cutoutLabel: 'Ergonomic Birch Desk',
    reverse: true,
    bg: 'bg-[#F7F7F5]',
    accentBar: 'bg-[#F088B0]',
  },
  {
    eyebrow: 'Active Play & Sensory',
    title: 'Active Play and Sensory Equipment',
    desc: 'Safe soft play zones, jungle gyms, interactive wall panels and calming sensory rooms encouraging motor development and imaginative play.',
    specs: [
      '28-density HR core foam with antimicrobial skin',
      'Concealed child-safe zipper closures',
      'Modular hook-and-loop floor anchoring',
    ],
    handle: 'soft-play-zones',
    image: THEME_IMAGES.heroPreschool,
    cutout: THEME_IMAGES.cutoutSoftPlayClimber,
    cutoutLabel: 'Modular Soft-Play Climber',
    reverse: false,
    bg: 'bg-white',
    accentBar: 'bg-[#00A048]',
  },
  {
    eyebrow: 'Academic & STEM Labs',
    title: 'Innovative School Laboratories',
    desc: 'Purpose-built science, computer, mathematics, art and STEM laboratory benches and storage designed for hands-on experimentation.',
    specs: [
      '19mm acid & heat proof phenolic resin tops',
      'Integrated dual lab sinks & brass service turrets',
      'Lockable ventilated chemical & glass bays',
    ],
    handle: 'science-lab',
    image: THEME_IMAGES.scienceLab,
    cutout: THEME_IMAGES.cutoutScienceLabBench,
    cutoutLabel: 'STEM Island Workbench',
    reverse: true,
    bg: 'bg-[#F7F7F5]',
    accentBar: 'bg-[#F8D000]',
  },
  {
    eyebrow: 'Outdoor Campuses',
    title: 'Outdoor Learning and Playground Solutions',
    desc: 'Weather-ready multi-play climbers, sensory parks, open-air gyms, math and science park installations and campus benches.',
    specs: [
      'Hot-dip galvanized powder-coated frames',
      'UV-stabilized virgin LLDPE chutes & roofs',
      'Tamper-proof stainless steel hardware',
    ],
    handle: 'outdoor-fun-equipment',
    image: THEME_IMAGES.outdoorPlay,
    reverse: false,
    bg: 'bg-white',
    accentBar: 'bg-[#F01818]',
  },
  {
    eyebrow: 'Surfacing & Courts',
    title: 'Premium School Flooring',
    desc: 'Impact-absorbing preschool play mats, classroom surfacing, and specialized multi-sport and squash court flooring solutions.',
    specs: [
      'Shock-attenuating EPDM & PU court layers',
      'Seamless anti-slip indoor & outdoor finish',
      'Precision game-line court marking included',
    ],
    handle: 'flooring',
    image: THEME_IMAGES.schoolLibrary,
    reverse: true,
    bg: 'bg-[#F7F7F5]',
    accentBar: 'bg-[#007B36]',
  },
];

const ENVIRONMENT_GALLERY = [
  { caption: 'Modern Classrooms', handle: 'senior', image: THEME_IMAGES.heroClassroom, wide: true },
  { caption: 'Preschool Interiors', handle: 'kindergarten-furniture', image: THEME_IMAGES.heroPreschool, wide: false },
  { caption: 'Montessori Rooms', handle: 'montessori-material', image: THEME_IMAGES.ergonomicDesk, wide: false },
  { caption: 'Science Laboratories', handle: 'science-lab', image: THEME_IMAGES.scienceLab, wide: false },
  { caption: 'Computer Laboratories', handle: 'computer-lab', image: THEME_IMAGES.schoolLibrary, wide: false },
  { caption: 'Activity Rooms', handle: 'soft-play-zones', image: THEME_IMAGES.heroPreschool, wide: true },
  { caption: 'Outdoor Playgrounds', handle: 'outdoor-fun-equipment', image: THEME_IMAGES.outdoorPlay, wide: false },
  { caption: 'Sensory Rooms', handle: 'sensory-room', image: THEME_IMAGES.ergonomicDesk, wide: false },
];

export function HomeView({
  onNavigate,
  onQuickView,
  onAddToCart,
  onOpenQuote,
  onOpenQuoteWithBrief,
  onAddKitToCart,
  compareIds,
  onToggleCompare,
}: HomeViewProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [stagePaletteId, setStagePaletteId] = useState<FinishPaletteId>('birch-emerald');
  const [ergoPresetId, setErgoPresetId] = useState<string>('primary');
  const [activeHotspotIdx, setActiveHotspotIdx] = useState(0);
  const [cutoutTierQty, setCutoutTierQty] = useState<1 | 25 | 60>(25);
  const [openStepIdx, setOpenStepIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'best-sellers' | 'new-arrivals' | 'featured'>('best-sellers');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  const cutoutBandRef = useRef<HTMLElement>(null);
  const { scrollYProgress: cutoutScroll } = useScroll({
    target: cutoutBandRef,
    offset: ['start end', 'end start'],
  });
  const parallaxUp = useTransform(cutoutScroll, [0, 1], [-14, 14]);
  const parallaxDown = useTransform(cutoutScroll, [0, 1], [14, -14]);

  const slide = HERO_SLIDES[slideIdx] || HERO_SLIDES[0];
  const activeStageItem = CUTOUT_SHOWCASE_ITEMS[stageIdx] || CUTOUT_SHOWCASE_ITEMS[0];
  const activeHotspot =
    activeStageItem.hotspots[activeHotspotIdx] || activeStageItem.hotspots[0];
  const tabProducts = PREVIEW_PRODUCTS.filter((p) => p.tabs.includes(activeTab));

  const openCutoutQuickView = (productHandle: string, fallbackCollection: string) => {
    const matched = PREVIEW_PRODUCTS.find((p) => p.handle === productHandle);
    if (matched) {
      onQuickView(matched);
    } else {
      onNavigate({ page: 'collection', handle: fallbackCollection });
    }
  };

  const handleSlideChange = (nextIdx: number) => {
    const wrapped = (nextIdx + HERO_SLIDES.length) % HERO_SLIDES.length;
    setSlideIdx(wrapped);
  };

  const testimonials = [
    {
      quote:
        'Editable placeholder: Add real feedback from a school principal or founder here through the Shopify Theme Editor.',
      name: 'School Principal (Editable Placeholder)',
      org: 'Institution Name (Edit in Theme Editor)',
    },
    {
      quote:
        'Editable placeholder: Share a real institutional story about classroom furniture, soft play or laboratory installation.',
      name: 'Academic Director (Editable Placeholder)',
      org: 'Preschool / K-12 Campus (Edit in Theme Editor)',
    },
    {
      quote:
        'Editable placeholder: Add a verified testimonial from an educational trust or campus architect partner.',
      name: 'Campus Architect (Editable Placeholder)',
      org: 'Educational Trust (Edit in Theme Editor)',
    },
  ];

  return (
    <div className="overflow-x-clip">
      {/* SECTION A: BIG 5-BANNER ARCHITECTURAL HERO CAROUSEL */}
      <section
        data-testid="hero-banner-carousel"
        aria-roledescription="carousel"
        aria-label="Featured School Infrastructure Banners"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        className="relative bg-[#FAF7F0] overflow-hidden"
      >
        <div className="relative min-h-[540px] sm:min-h-[590px] lg:min-h-[650px] flex flex-col justify-between">
          {/* Full-Bleed Big Architectural Banner Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0.25, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="absolute inset-0 pointer-events-none"
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* Measured Sunlit Editorial Gradient Scrim: High-contrast readable text left + bright showcase right */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none lg:hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(250,247,240,0.94) 0%, rgba(250,247,240,0.88) 46%, rgba(250,247,240,0.52) 78%, rgba(250,247,240,0.82) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(94deg, rgba(250,247,240,0.97) 0%, rgba(250,247,240,0.93) 38%, rgba(250,247,240,0.68) 56%, rgba(250,247,240,0.14) 78%, rgba(250,247,240,0.04) 100%)',
            }}
          />

          {/* Main Foreground Content Container */}
          <div className="relative z-10 max-w-[1320px] w-full mx-auto px-3.5 sm:px-4 md:px-6 pt-7 sm:pt-14 lg:pt-16 pb-4 sm:pb-6 flex-1 flex items-center">
            <div className="w-full max-w-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-copy-${slide.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block w-5 sm:w-7 h-[3px] rounded-full bg-[#C22768] shrink-0" aria-hidden="true" />
                    <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#C22768] leading-snug">
                      0{slideIdx + 1} / 0{HERO_SLIDES.length} · {slide.eyebrow}
                    </p>
                  </div>

                  <h1 className="text-[clamp(1.45rem,6vw,2.15rem)] sm:text-5xl lg:text-[3.35rem] font-extrabold leading-[1.12] sm:leading-[1.06] tracking-tight text-[#161A17] text-balance">
                    {slide.titleLead}{' '}
                    <span
                      className="font-script text-[1.14em] sm:text-[1.18em] font-bold inline-block -rotate-1 underline decoration-[#F8D000] decoration-3 sm:decoration-4 underline-offset-4"
                      style={{ color: slide.accentHex }}
                    >
                      {slide.titleScript}
                    </span>
                  </h1>

                  <p className="mt-2.5 sm:mt-4 text-[clamp(0.78rem,3.3vw,0.92rem)] sm:text-base lg:text-[17px] text-[#353C36] max-w-[54ch] leading-relaxed font-medium">
                    {slide.desc}
                  </p>

                  <p className="mt-2 sm:mt-3 text-[10.5px] min-[375px]:text-[11px] sm:text-xs font-mono-num font-semibold text-[#4D554E]">
                    {slide.highlightStat}
                  </p>

                  <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate(slide.ctaTarget)}
                      className="sd-btn-sheen group flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 sm:gap-2 px-3 min-[375px]:px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white font-bold text-[11.5px] min-[375px]:text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer shadow-md whitespace-nowrap"
                    >
                      <span>{slide.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenQuote(slide.title)}
                      className="flex-1 sm:flex-initial text-center px-3 min-[375px]:px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white hover:bg-[#FDF2F7] text-[#161A17] font-bold text-[11.5px] min-[375px]:text-xs sm:text-sm border border-[#DCD4C0] hover:border-[#C22768] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Request a Quote
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom 5-Banner Navigation Strip + Prev/Next Arrows */}
          <div className="relative z-20 max-w-[1320px] w-full mx-auto px-3.5 sm:px-4 md:px-6 pb-8 sm:pb-12">
            <div className="rounded-2xl bg-white/94 backdrop-blur-md border border-[#E5DEC9] shadow-lg p-1.5 sm:p-2.5 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleSlideChange(slideIdx - 1)}
                aria-label="Previous hero banner"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FAF7F0] hover:bg-[#EFEAD9] border border-[#E5DEC9] text-[#161A17] inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                className="flex-1 flex lg:grid lg:grid-cols-5 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar snap-x"
                role="tablist"
                aria-label="Select hero banner"
              >
                {HERO_SLIDES.map((s, idx) => {
                  const isActive = idx === slideIdx;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-testid={`hero-banner-tab-${idx}`}
                      onClick={() => handleSlideChange(idx)}
                      className={`snap-start text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 lg:shrink lg:min-w-0 ${
                        isActive
                          ? 'bg-[#FAF3EB] border-[#007B36] text-[#161A17] shadow-xs'
                          : 'bg-white hover:bg-[#FAF7F0] border-transparent text-[#4D554E]'
                      }`}
                    >
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono-num font-extrabold shrink-0 ${
                          isActive ? 'text-[#007B36]' : 'text-[#7A827A]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap lg:truncate">{s.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleSlideChange(slideIdx + 1)}
                aria-label="Next hero banner"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FAF7F0] hover:bg-[#EFEAD9] border border-[#E5DEC9] text-[#161A17] inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Organic Sweeping Wave Divider into Light Paper Section B */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            className="absolute bottom-0 inset-x-0 w-full h-6 sm:h-9 pointer-events-none z-10"
          >
            <path
              d="M0,44 C260,76 520,8 860,34 C1120,54 1300,18 1440,36 L1440,72 L0,72 Z"
              fill="#F5F1E6"
            />
          </svg>
        </div>
      </section>

      {/* SECTION B: TRUST HIGHLIGHTS + EXPRESSIVE TILTED STORYTELLING (MYFRIDA + KERNJOSH) */}
      <section className="bg-[#F5F1E6] pt-5 pb-10 sm:pt-6 sm:pb-12 border-b border-[#E6DFCE]">
        <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 pb-8 sm:pb-10 border-b border-[#E2DAC8]">
            {[
              {
                icon: Layers,
                title: 'Complete School Solutions',
                desc: 'Classrooms, labs, active play, outdoor parks and flooring under one roof.',
                badge: 'bg-[#FDF1F6] text-[#C22768] border border-[#F5C7DA]',
              },
              {
                icon: ShieldCheck,
                title: 'Quality-Focused Products',
                desc: 'Durable institutional materials engineered for everyday school routines.',
                badge: 'bg-[#EAF7EF] text-[#007B36] border border-[#BCE3CB]',
              },
              {
                icon: Compass,
                title: 'Learning Through Play',
                desc: 'Thoughtful spaces supporting curiosity, sensory growth and movement.',
                badge: 'bg-[#FFFBE6] text-[#8A6D00] border border-[#F2DF7E]',
              },
              {
                icon: SlidersHorizontal,
                title: 'Customized Solutions',
                desc: 'Flexible sizing, finishes and project support tailored to your campus.',
                badge: 'bg-[#FDECEC] text-[#D91B22] border border-[#F8C4C6]',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                  className="group flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white/85 sm:bg-transparent border border-[#E5DEC9] sm:border-transparent transition-colors hover:bg-white"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${item.badge} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-[12.5px] sm:text-sm font-extrabold text-[#181A18] leading-snug">{item.title}</h2>
                    <p className="text-[11px] sm:text-xs text-[#525852] mt-1 leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Frida-Style Tactile Typography + Tilted Interactive Wing Stickers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
            className="pt-7 sm:pt-10 md:pt-12 text-center max-w-3xl mx-auto px-1"
          >
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-3.5 sm:mb-4">
              {[
                { label: 'Preschool Wings', handle: 'kindergarten-furniture', bg: 'bg-[#F01818] text-white', rot: '-rotate-2 sm:-rotate-3' },
                { label: 'Montessori Rooms', handle: 'montessori-material', bg: 'bg-[#007B36] text-white', rot: 'rotate-1 sm:rotate-2' },
                { label: 'Active Play', handle: 'soft-play-zones', bg: 'bg-[#F8D000] text-[#181A18]', rot: '-rotate-1 sm:-rotate-2' },
                { label: 'STEM Labs', handle: 'science-lab', bg: 'bg-[#F088B0] text-[#181A18]', rot: 'rotate-2 sm:rotate-3' },
              ].map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: tag.handle })}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10.5px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm cursor-pointer transition-transform duration-200 hover:scale-105 hover:rotate-0 ${tag.bg} ${tag.rot}`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <h2 className="text-[22px] sm:text-5xl font-extrabold tracking-tight text-[#181A18] leading-[1.12] text-balance">
              Whatever wing you&rsquo;re planning,
            </h2>
            <p className="font-script text-2xl sm:text-4xl font-bold text-[#007B36] mt-1.5 sm:mt-2 leading-tight">
              School Decor makes every classroom come alive.
            </p>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'about' })}
                className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#C22768] hover:bg-[#9e1d53] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Meet School Decor</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION B1: LIGHT ARCHITECTURAL DUAL-TRACK KINETIC MARQUEE */}
      <section
        aria-label="School Decor product highlights marquee"
        className="bg-white py-6 md:py-8 overflow-hidden sd-marquee-group border-y border-[#E6DFCE]"
      >
        <div className="sd-marquee-track-left">
          {[0, 1].map((dup) => (
            <div key={`m1-${dup}`} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {MARQUEE_WORDS_ROW_1.map((item) => (
                <span
                  key={`${dup}-${item.word}`}
                  style={{ color: item.color }}
                  className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight whitespace-nowrap select-none"
                >
                  {item.word}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="sd-marquee-track-right mt-2 sm:mt-2.5">
          {[0, 1].map((dup) => (
            <div key={`m2-${dup}`} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {MARQUEE_WORDS_ROW_2.map((item) => (
                <span
                  key={`${dup}-${item.word}`}
                  style={{ color: item.color }}
                  className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight whitespace-nowrap select-none opacity-90"
                >
                  {item.word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B2: LUMINOUS PASTEL-TINTED INTERACTIVE CUTOUT PLAYGROUND + FINISH & ERGONOMIC ADVISOR */}
      {(() => {
        const activeFinish = getFinishPalette(stagePaletteId);
        const activeErgo =
          ERGO_GRADE_PRESETS.find((e) => e.id === ergoPresetId) || ERGO_GRADE_PRESETS[2];
        return (
          <section
            ref={cutoutBandRef}
            data-testid="cutout-stage-section"
            style={{ backgroundColor: activeStageItem.stageBg }}
            className="text-[#161A17] py-14 md:py-20 transition-colors duration-500 overflow-x-clip relative border-b border-[#E5DEC9]"
          >
            <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6">
              {/* Interactive Category Switcher & Finish Palette Toolbar */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
                  {CUTOUT_SHOWCASE_ITEMS.map((item, idx) => {
                    const isSelected = stageIdx === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setStageIdx(idx);
                          setActiveHotspotIdx(0);
                        }}
                        aria-pressed={isSelected}
                        className={`px-3 sm:px-5 py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all duration-200 cursor-pointer border text-center truncate ${
                          isSelected
                            ? 'bg-[#161A17] text-white border-[#161A17] shadow-md -translate-y-0.5'
                            : 'bg-white/95 hover:bg-white text-[#161A17] border-[#D9D2C0] shadow-2xs'
                        }`}
                      >
                        {item.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Live Studio Material Finish Swatch Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white/90 border border-[#E5DEC9] rounded-full px-2.5 sm:px-3 py-1.5 shadow-2xs w-full sm:w-auto">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4D554E] px-1">
                    Finish:
                  </span>
                  {FINISH_PALETTES.map((pal) => {
                    const isPal = pal.id === stagePaletteId;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        data-testid={`stage-finish-${pal.id}`}
                        aria-pressed={isPal}
                        onClick={() => setStagePaletteId(pal.id)}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                          isPal
                            ? 'bg-[#161A17] text-white'
                            : 'text-[#4D554E] hover:text-[#161A17] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/70 shrink-0"
                          style={{ backgroundColor: pal.accentHex }}
                        />
                        <span>{pal.name.split('+')[1]?.trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Centered Featured Cutout Interactive Stage with Hotspot Engineering Callouts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pb-10 sm:pb-12 md:pb-16 border-b border-[#161A17]/10">
                <div className="lg:col-span-5 text-left">
                  <p
                    style={{ color: activeFinish.accentHex }}
                    className="font-script text-xl sm:text-3xl font-bold leading-none mb-1.5 sm:mb-2"
                  >
                    {activeStageItem.scriptTag}
                  </p>
                  <h2 className="text-[22px] sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#161A17] text-balance">
                    {activeStageItem.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-base text-[#4D554E] max-w-[46ch] leading-relaxed">
                    {activeStageItem.tagline}
                  </p>

                  {/* Clean Technical Spec Readout Grid */}
                  <div className="mt-3.5 sm:mt-4 p-2.5 sm:p-3 rounded-xl bg-white/85 border border-[#E5DEC9] grid grid-cols-3 gap-1.5 sm:gap-2 text-left">
                    <div className="min-w-0">
                      <p className="text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#4D554E] font-semibold">
                        Dimensions
                      </p>
                      <p className="text-[10.5px] sm:text-xs font-mono-num font-bold text-[#161A17] mt-0.5 leading-snug">
                        {activeStageItem.dimensions}
                      </p>
                    </div>
                    <div className="border-l border-[#E5DEC9] pl-1.5 sm:pl-2 min-w-0">
                      <p className="text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#4D554E] font-semibold">
                        Age Wing
                      </p>
                      <p className="text-[10.5px] sm:text-xs font-bold text-[#161A17] mt-0.5 leading-snug">
                        {activeStageItem.ageGroup}
                      </p>
                    </div>
                    <div className="border-l border-[#E5DEC9] pl-1.5 sm:pl-2 min-w-0">
                      <p className="text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#4D554E] font-semibold">
                        Finish
                      </p>
                      <p
                        className="text-[10.5px] sm:text-xs font-bold mt-0.5 leading-snug truncate"
                        style={{ color: activeFinish.accentHex }}
                      >
                        {activeFinish.name}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Ergonomic Grade Quick-Matcher */}
                  <div className="mt-3 sm:mt-4 rounded-xl bg-white/95 border border-[#E5DEC9] p-3 sm:p-3.5 text-left shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C22768]">
                        Ergonomic Grade Advisor
                      </span>
                      <span className="text-[10.5px] sm:text-[11px] font-mono-num font-semibold text-[#007B36]">
                        {activeErgo.ageRange}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ERGO_GRADE_PRESETS.map((preset) => {
                        const selected = preset.id === ergoPresetId;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setErgoPresetId(preset.id)}
                            className={`px-2 sm:px-2.5 py-1 rounded-md text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer ${
                              selected
                                ? 'bg-[#007B36] text-white'
                                : 'bg-[#FAF7F0] text-[#4D554E] hover:text-[#161A17]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <p
                      data-testid="ergo-advisor-spec"
                      className="mt-2 pt-2 border-t border-[#EFEAD9] text-[10.5px] sm:text-[11px] font-mono-num text-[#161A17]"
                    >
                      Desk <strong>{activeErgo.deskHeightMm} mm</strong> · Seat{' '}
                      <strong>{activeErgo.seatHeightMm} mm</strong> · {activeErgo.cornerRadius}
                    </p>
                  </div>

                  {/* Component & Material Breakdown Explorer (Replaced Numbered Pins) */}
                  {activeHotspot && (
                    <div className="mt-3 rounded-xl bg-white border border-[#E5DEC9] shadow-sm p-3 sm:p-3.5 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#C22768] mb-2">
                        Build &amp; Material Highlights
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2" role="tablist" aria-label="Product build components">
                        {activeStageItem.hotspots.map((spot, sIdx) => {
                          const selected = activeHotspotIdx === sIdx;
                          return (
                            <button
                              key={spot.id}
                              type="button"
                              role="tab"
                              aria-selected={selected}
                              onClick={() => setActiveHotspotIdx(sIdx)}
                              className={`px-2 sm:px-2.5 py-1 rounded-md text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer border ${
                                selected
                                  ? 'bg-[#161A17] text-white border-[#161A17]'
                                  : 'bg-[#FAF3EB] text-[#4D554E] border-[#E5DEC9] hover:text-[#161A17]'
                              }`}
                            >
                              {spot.label}
                            </button>
                          );
                        })}
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={activeHotspot.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          data-testid="cutout-component-detail"
                          className="text-[11.5px] sm:text-xs text-[#4D554E] leading-relaxed"
                        >
                          {activeHotspot.detail}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Institutional Bulk Rate Selector & Quick Compare */}
                  {(() => {
                    const matchedProduct = PREVIEW_PRODUCTS.find(
                      (p) => p.handle === activeStageItem.productHandle
                    );
                    const basePrice = matchedProduct && !matchedProduct.quoteOnly ? matchedProduct.price : 0;
                    const bulkQuote = basePrice > 0 ? calculateBulkTierPricing(basePrice, cutoutTierQty) : null;
                    const isCompared = matchedProduct ? compareIds.includes(matchedProduct.id) : false;

                    return (
                      <>
                        <div className="mt-3 rounded-xl bg-white/95 border border-[#E5DEC9] p-3 sm:p-3.5 text-left">
                          {bulkQuote ? (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007B36]">
                                  Institutional Volume Rate
                                </span>
                                <span className="text-xs font-mono-num font-extrabold text-[#161A17]">
                                  ₹{bulkQuote.unitPriceAfterDiscount.toLocaleString('en-IN')}{' '}
                                  <span className="text-[10px] font-normal text-[#4D554E]">/ unit</span>
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                                {[
                                  { qty: 1 as const, label: 'Single 1–19' },
                                  { qty: 25 as const, label: 'Class 20+ (8%)' },
                                  { qty: 60 as const, label: 'Wing 50+ (14%)' },
                                ].map((t) => (
                                  <button
                                    key={t.qty}
                                    type="button"
                                    onClick={() => setCutoutTierQty(t.qty)}
                                    className={`px-1.5 sm:px-2 py-1.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer border text-center ${
                                      cutoutTierQty === t.qty
                                        ? 'bg-[#007B36] text-white border-[#007B36]'
                                        : 'bg-[#FAF3EB] text-[#4D554E] border-[#E5DEC9] hover:text-[#161A17]'
                                    }`}
                                  >
                                    {t.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-[#161A17]">
                                Site-Measured Lab Specification · Pan-India CAD Included
                              </span>
                              <span className="text-xs font-mono-num font-bold text-[#C22768]">
                                Tender Pricing
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-start gap-2 sm:gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              openCutoutQuickView(
                                activeStageItem.productHandle,
                                activeStageItem.collectionHandle
                              )
                            }
                            className="sd-btn-sheen flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Inspect Product</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate({ page: 'collection', handle: activeStageItem.collectionHandle })
                            }
                            className="flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-white hover:bg-[#FAF7F0] text-[#161A17] border border-[#D9D2C0] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
                          >
                            <span>Explore Range</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          {matchedProduct && (
                            <button
                              type="button"
                              onClick={() => onToggleCompare(matchedProduct)}
                              className={`w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-3 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
                                isCompared
                                  ? 'bg-[#161A17] text-white border-[#161A17]'
                                  : 'bg-white text-[#161A17] border-[#D9D2C0] hover:border-[#C22768]'
                              }`}
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>{isCompared ? 'Compared' : 'Compare Unit'}</span>
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="lg:col-span-7 flex items-center justify-center gap-2 sm:gap-5 relative">
                  <button
                    type="button"
                    aria-label="Previous featured cutout"
                    onClick={() => {
                      setStageIdx(
                        (stageIdx - 1 + CUTOUT_SHOWCASE_ITEMS.length) % CUTOUT_SHOWCASE_ITEMS.length
                      );
                      setActiveHotspotIdx(0);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white border border-[#D9D2C0] text-[#161A17] shadow-sm inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="relative w-full max-w-[480px] h-[210px] sm:h-[350px] flex items-center justify-center">
                    <div
                      aria-hidden="true"
                      className="absolute inset-6 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
                      style={{ backgroundColor: activeFinish.stageGlow }}
                    />
                    <div
                      aria-hidden="true"
                      className="hidden sm:block absolute inset-4 rounded-full border-2 border-dashed sd-blueprint-spin pointer-events-none transition-colors duration-500"
                      style={{ borderColor: `${activeFinish.accentHex}55` }}
                    />
                    <div
                      aria-hidden="true"
                      className="hidden sm:block absolute inset-10 rounded-full border pointer-events-none transition-colors duration-500"
                      style={{
                        borderColor: activeFinish.borderTint,
                        backgroundColor: activeFinish.surfaceTint,
                        opacity: 0.42,
                      }}
                    />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStageItem.id}
                        initial={{ opacity: 0, scale: 0.88, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -14 }}
                        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={activeStageItem.image}
                          alt={activeStageItem.title}
                          loading="lazy"
                          decoding="async"
                          onClick={() =>
                            openCutoutQuickView(
                              activeStageItem.productHandle,
                              activeStageItem.collectionHandle
                            )
                          }
                          className="max-h-full max-w-full object-contain cursor-pointer sd-cutout-sticker sd-float-gentle"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    aria-label="Next featured cutout"
                    onClick={() => {
                      setStageIdx((stageIdx + 1) % CUTOUT_SHOWCASE_ITEMS.length);
                      setActiveHotspotIdx(0);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white border border-[#D9D2C0] text-[#161A17] shadow-sm inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Scroll-Linked Parallax Grid of All 4 Cutouts */}
              <div className="pt-8 sm:pt-10 md:pt-12">
                <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1">
                      Studio Cutout Series
                    </p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#161A17] tracking-tight">
                      Signature Floating Collection
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
                    className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#161A17] hover:bg-[#007B36] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                  >
                    <span>Shop All Products</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 md:gap-6">
                  {CUTOUT_SHOWCASE_ITEMS.map((item, idx) => {
                    const parallaxY = idx % 2 === 0 ? parallaxUp : parallaxDown;
                    return (
                      <motion.div
                        key={item.id}
                        style={{ y: parallaxY }}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.14 }}
                        transition={{ duration: 0.58, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                        className="will-change-transform"
                      >
                        <div
                          onClick={() => openCutoutQuickView(item.productHandle, item.collectionHandle)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openCutoutQuickView(item.productHandle, item.collectionHandle);
                            }
                          }}
                          className="group relative flex flex-col rounded-xl sm:rounded-2xl border border-[#E5DEC9] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer h-full"
                        >
                          <div
                            className="relative h-36 sm:h-56 md:h-60 flex items-center justify-center p-3 sm:p-5 pb-5 sm:pb-7 overflow-hidden"
                            style={{ backgroundColor: item.tintBg }}
                          >
                            <div
                              aria-hidden="true"
                              className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-3 sm:h-3.5 rounded-full bg-[#161A17]/18 blur-md transition-all duration-500 group-hover:scale-x-115 group-hover:opacity-65"
                            />
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_14px_18px_rgba(22,26,23,0.14)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-105"
                            />
                          </div>

                          <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between gap-2 sm:gap-3 bg-white border-t border-[#EFEAD9]">
                            <div>
                              <p className="text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4D554E] leading-snug">
                                {item.category} · <span className="text-[#007B36]">{item.ageGroup}</span>
                              </p>
                              <h4 className="text-[12.5px] sm:text-base font-extrabold text-[#161A17] mt-1 leading-snug group-hover:text-[#007B36] transition-colors">
                                {item.title}
                              </h4>
                              <ul className="hidden sm:block mt-2.5 space-y-1">
                                {item.specHighlights.slice(0, 2).map((spec) => (
                                  <li
                                    key={spec}
                                    className="flex items-center gap-1.5 text-[11px] text-[#4D554E]"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#007B36] shrink-0" />
                                    <span className="truncate">{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between gap-1.5 pt-2 sm:pt-2.5 border-t border-[#F1EDE0]">
                              <span className="text-[10.5px] sm:text-xs font-semibold font-mono-num text-[#161A17] truncate">
                                {item.priceLabel}
                              </span>
                              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10.5px] sm:text-xs font-bold text-[#C22768] transition-transform duration-200 group-hover:translate-x-1 shrink-0">
                                <span>Inspect</span>
                                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </span>
                            </div>
                          </div>

                          <span
                            aria-hidden="true"
                            style={{ backgroundColor: item.barColor }}
                            className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* SECTION C: EXPLORE OUR COLLECTIONS */}
      <section className="bg-white py-10 sm:py-14 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-3 sm:px-4 md:px-6">
          <div className="mb-5 sm:mb-7 md:mb-9 text-left">
            <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1">
              Product Universe
            </p>
            <h2 className="text-[clamp(1.35rem,5.2vw,1.85rem)] sm:text-3xl md:text-4xl font-extrabold text-[#181A18] tracking-tight">
              Explore Our Collections
            </h2>
            <p className="text-[#525852] text-[clamp(0.75rem,3vw,0.88rem)] sm:text-sm md:text-base mt-1.5 sm:mt-2 max-w-[62ch] leading-relaxed">
              Browse 12 specialized categories spanning classrooms, early years, laboratories, active play and outdoor environments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 min-[390px]:gap-3 sm:gap-5">
            {COLLECTIONS_SHOWCASE.map((col, idx) => (
              <button
                key={col.title}
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: col.handle })}
                className="group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5DEC9] text-left bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#007B36]/40 cursor-pointer p-0 h-full"
              >
                {/* Top Image Frame with Compact Non-Overlapping Tag Pill */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#F5F1E6] shrink-0">
                  <img
                    src={col.image}
                    alt={col.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/10 pointer-events-none"
                  />
                  <span className="absolute top-1.5 left-1.5 min-[375px]:top-2 min-[375px]:left-2 sm:top-3 sm:left-3 z-10 px-1.5 min-[375px]:px-2 sm:px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[clamp(0.48rem,2vw,0.58rem)] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#181A18] shadow-xs border border-black/5 leading-tight max-w-[calc(100%-12px)] truncate">
                    {col.tag}
                  </span>
                </div>

                {/* Bottom Dedicated White Content Area — Fluid Responsive Typography on All Mobile Sizes (320px–768px) */}
                <div className="p-2.5 min-[375px]:p-3 sm:p-4 bg-white flex-1 flex flex-col justify-between text-left border-t border-[#EFEAD9] w-full">
                  <div>
                    <h3 className="text-[clamp(0.75rem,3.3vw,0.92rem)] sm:text-[15px] md:text-base font-extrabold text-[#161A17] group-hover:text-[#007B36] leading-[1.22] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-[clamp(0.64rem,2.7vw,0.74rem)] sm:text-xs text-[#525852] mt-1 leading-[1.35] line-clamp-2">
                      {col.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-between sm:justify-start gap-1 mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-[#F4F0E6] text-[clamp(0.65rem,2.7vw,0.75rem)] sm:text-xs font-bold text-[#C22768] group-hover:text-[#007B36] transition-colors w-full">
                    <span>Explore Range</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[3px] ${LOGO_BAR_COLORS[idx % 4]} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-20`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: FEATURED PRODUCTS */}
      <section className="bg-[#FAF7F0] py-12 sm:py-16 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-9"
          >
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1.5 sm:mb-2">
                Curated Catalog
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-[#161A17] tracking-tight">
                Featured Products
              </h2>
            </div>

            <div className="inline-flex max-w-full overflow-x-auto no-scrollbar p-1 bg-white border border-[#E5DEC9] rounded-xl shadow-2xs" role="tablist" aria-label="Featured product tabs">
              {[
                { key: 'best-sellers', label: 'Best Sellers' },
                { key: 'new-arrivals', label: 'New Arrivals' },
                { key: 'featured', label: 'Featured Products' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.key}
                  onClick={() => setActiveTab(t.key as typeof activeTab)}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === t.key
                      ? 'bg-[#007B36] text-white shadow-xs'
                      : 'text-[#4D554E] hover:text-[#161A17]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6"
            >
              {tabProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.48, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                  className="flex"
                >
                  <div className="w-full flex [&>article]:w-full">
                    <ProductCard
                      product={product}
                      onOpenProduct={(handle) => onNavigate({ page: 'product', handle })}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onOpenQuote={onOpenQuote}
                      isCompared={compareIds.includes(product.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 sm:mt-9 text-center">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[#D9D2C0] bg-white hover:border-[#C22768] hover:text-[#C22768] text-xs sm:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION D2: TURNKEY CAMPUS WING STARTER KITS */}
      <CampusWingPackages
        onAddKitToCart={onAddKitToCart}
        onOpenQuoteWithBrief={onOpenQuoteWithBrief}
        onNavigate={onNavigate}
      />

      {/* SECTION E: ABOUT SCHOOL DECOR + KERNJOSH TACTILE PROCESS ACCORDION */}
      <section className="bg-[#F5F1E6] py-11 sm:py-16 md:py-20 border-y border-[#E6DFCE] sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6 space-y-10 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden border border-[#DDD5C3] bg-white shadow-sm"
            >
              <img
                src={THEME_IMAGES.schoolLibrary}
                alt="Modern school library and learning interior"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.09, ease: EASE_OUT_EXPO }}
              className="lg:col-span-6 text-left"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-block w-6 h-[3px] rounded-full bg-[#F088B0]" aria-hidden="true" />
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768]">
                  About School Decor
                </p>
              </div>
              <h2 className="text-[22px] sm:text-3xl md:text-4xl font-extrabold text-[#181A18] tracking-tight text-balance">
                Creating Inspiring{' '}
                <span className="font-script text-[1.2em] text-[#007B36]">Learning Environments</span>
              </h2>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#525852] leading-relaxed">
                School Decor equips schools, preschools and educational institutions with thoughtfully designed furniture, activity equipment, laboratories, outdoor play zones and complete campus infrastructure products.
              </p>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-[#525852] leading-relaxed">
                Whether you are launching a new early-learning center or upgrading a multi-wing K-12 campus, our team helps you plan spaces that balance ergonomics, safety and daily longevity.
              </p>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'about' })}
                  className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Interactive Numbered Process Accordion + Live Sticker Cutout Preview */}
          <div className="pt-8 sm:pt-12 border-t border-[#E2DAC8] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 text-left">
              <p className="font-script text-xl sm:text-2xl font-bold text-[#C22768] mb-1">
                From floor plan to first bell
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#181A18] tracking-tight mb-4 sm:mb-6">
                How We Build Your Campus
              </h3>

              <div className="space-y-2.5 sm:space-y-3">
                {PROCESS_STEPS.map((proc, idx) => {
                  const isOpen = openStepIdx === idx;
                  return (
                    <div
                      key={proc.step}
                      className={`rounded-xl sm:rounded-2xl border transition-colors duration-200 ${
                        isOpen
                          ? 'bg-white border-[#181A18] shadow-md'
                          : 'bg-white/65 border-[#DDD5C3] hover:bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenStepIdx(idx)}
                        className="w-full px-3.5 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                          <span
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono-num text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                              isOpen
                                ? 'bg-[#007B36] text-white'
                                : 'bg-[#F5F1E6] text-[#181A18] border border-[#DDD5C3]'
                            }`}
                          >
                            {proc.step}
                          </span>
                          <span className="text-[13px] sm:text-base font-bold text-[#181A18] leading-snug">
                            {proc.title}
                          </span>
                        </div>
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E3E5E0] flex items-center justify-center text-[#525852] shrink-0">
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 sm:pl-17 space-y-2.5 sm:space-y-3">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF7EF] text-[#007B36] text-[10px] font-bold uppercase tracking-wider">
                                {proc.phaseLabel}
                              </span>
                              <p className="text-xs sm:text-sm text-[#525852] leading-relaxed">
                                {proc.desc}
                              </p>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                                {proc.deliverables.map((del) => (
                                  <span
                                    key={del}
                                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-[#F5F1E6] border border-[#E2DAC8] text-[10.5px] sm:text-[11px] font-semibold text-[#181A18]"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#007B36] shrink-0" />
                                    <span>{del}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-24">
              {(() => {
                const activeStep = PROCESS_STEPS[openStepIdx] || PROCESS_STEPS[0];
                const cutout = CUTOUT_SHOWCASE_ITEMS[activeStep.cutoutIdx] || CUTOUT_SHOWCASE_ITEMS[0];
                return (
                  <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#DDD5C3] p-4 sm:p-8 shadow-sm text-center">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-script text-lg sm:text-xl font-bold text-[#007B36]">
                        Step 0{activeStep.step} Studio Match
                      </p>
                      <span className="text-[10.5px] sm:text-[11px] font-mono-num font-semibold text-[#525852] bg-[#F5F1E6] px-2.5 py-0.5 rounded-full">
                        {cutout.ageGroup}
                      </span>
                    </div>
                    <div
                      className="mt-3 h-44 sm:h-64 rounded-2xl flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
                      style={{ backgroundColor: cutout.tintBg }}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-6 rounded-full border border-dashed border-black/10 sd-blueprint-spin pointer-events-none"
                      />
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.img
                          key={`proc-cut-${cutout.id}`}
                          src={cutout.image}
                          alt={cutout.title}
                          initial={{ opacity: 0, scale: 0.9, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: -8 }}
                          transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                          className="relative z-10 max-h-full max-w-full object-contain sd-cutout-sticker"
                        />
                      </AnimatePresence>
                    </div>
                    <h4 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-[#181A18]">{cutout.title}</h4>
                    <p className="mt-1 text-xs text-[#525852]">{cutout.tagline}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-num text-[#007B36] bg-[#EAF7EF] px-2.5 sm:px-3 py-1 rounded-full max-w-full">
                      <Ruler className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cutout.dimensions} · {cutout.materials}</span>
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={() => openCutoutQuickView(cutout.productHandle, cutout.collectionHandle)}
                        className="mt-3.5 sm:mt-4 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#181A18] hover:bg-[#007B36] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Inspect Specification</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: PRODUCT CATEGORY SHOWCASE (5 ALTERNATING EDITORIAL SECTIONS WITH MULTI-PLANE DEPTH) */}
      {EDITORIAL_SHOWCASES.map((item) => (
        <section key={item.title} className={`${item.bg} py-11 sm:py-14 md:py-16 sd-lazy-section`}>
          <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
              className={`lg:col-span-6 relative ${
                item.reverse ? 'lg:order-2' : ''
              }`}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E3E5E0] shadow-sm bg-[#F7F7F5]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
              {item.cutout && (
                <div
                  className={`flex items-center gap-2 sm:gap-3 absolute bottom-2.5 right-2.5 sm:-bottom-5 ${
                    item.reverse ? 'sm:-left-4 sm:right-auto' : 'sm:-right-4'
                  } px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E3E5E0] shadow-lg sd-float-gentle max-w-[calc(100%-20px)]`}
                >
                  <img
                    src={item.cutout}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-9 sm:w-16 sm:h-14 object-contain shrink-0"
                  />
                  <div className="pr-1 text-left min-w-0">
                    <p className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#C22768]">
                      Featured Unit
                    </p>
                    <p className="text-[10.5px] sm:text-xs font-bold text-[#181A18] truncate">
                      {item.cutoutLabel}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: 0.09, ease: EASE_OUT_EXPO }}
              className={`lg:col-span-6 text-left ${item.reverse ? 'lg:order-1' : ''}`}
            >
              <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                <span className={`inline-block w-6 h-[3px] rounded-full ${item.accentBar}`} aria-hidden="true" />
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768]">
                  {item.eyebrow}
                </p>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#181A18] tracking-tight text-balance">
                {item.title}
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-[#525852] leading-relaxed max-w-[52ch]">{item.desc}</p>
              <ul className="mt-3.5 sm:mt-4 space-y-1.5 sm:space-y-2">
                {item.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#181A18]">
                    <CheckCircle2 className="w-4 h-4 text-[#007B36] shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection', handle: item.handle })}
                  className="group flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-md bg-[#007B36] hover:bg-[#005D28] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuote(item.title)}
                  className="flex-1 sm:flex-initial text-center px-4 sm:px-5 py-2.5 rounded-md border border-[#F5C7DA] bg-[#FDF1F6] hover:bg-[#fadce9] text-xs sm:text-sm font-semibold text-[#C22768] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer whitespace-nowrap"
                >
                  Request a Quote
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* SECTION G: SCHOOL ENVIRONMENT GALLERY */}
      <section className="bg-white py-12 sm:py-16 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mb-6 sm:mb-9"
          >
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1.5 sm:mb-2">
              Spaces in Focus
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#181A18] tracking-tight">
              School Environment Gallery
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#525852] mt-1.5 sm:mt-2 max-w-[60ch]">
              A visual look across classrooms, preschool interiors, Montessori rooms, laboratories, activity spaces, sensory rooms and playgrounds.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {ENVIRONMENT_GALLERY.map((tile, idx) => (
              <motion.button
                key={tile.caption}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.52, delay: (idx % 4) * 0.06, ease: EASE_OUT_EXPO }}
                onClick={() => onNavigate({ page: 'collection', handle: tile.handle })}
                className={`group relative rounded-xl overflow-hidden border border-[#E3E5E0] text-left cursor-pointer p-0 transition-shadow duration-300 hover:shadow-lg ${
                  tile.wide ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={tile.image}
                  alt={tile.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 text-white font-bold text-[11.5px] sm:text-sm transition-transform duration-200 group-hover:-translate-y-0.5 leading-snug"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(14,28,20,0.86))',
                  }}
                >
                  {tile.caption}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: WHY CHOOSE SCHOOL DECOR */}
      <section className="bg-[#F7F7F5] py-12 sm:py-16 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-3.5 sm:px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mb-6 sm:mb-9"
          >
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C22768] mb-1.5 sm:mb-2">
              Our Approach
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#181A18] tracking-tight">
              Why Choose School Decor
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {[
              {
                icon: Layers,
                title: 'Educational Environment Solutions',
                desc: 'Coordinated equipment for preschools, primary wings, senior classrooms, labs and campuses.',
                badge: 'bg-[#FDF1F6] text-[#C22768] border border-[#F5C7DA]',
              },
              {
                icon: Compass,
                title: 'Wide Product Selection',
                desc: 'Specialized ranges spanning Montessori materials, soft play, STEM labs and outdoor parks.',
                badge: 'bg-[#EAF7EF] text-[#007B36] border border-[#BCE3CB]',
              },
              {
                icon: ShieldCheck,
                title: 'Functional and Practical Designs',
                desc: 'Thoughtful ergonomics, rounded child-safe edges and materials built for daily school routines.',
                badge: 'bg-[#FFFBE6] text-[#8A6D00] border border-[#F2DF7E]',
              },
              {
                icon: SlidersHorizontal,
                title: 'Customized Project Support',
                desc: 'Flexible sizing, finishes and quantity planning tailored to your institution floor plan.',
                badge: 'bg-[#FDECEC] text-[#D91B22] border border-[#F8C4C6]',
              },
              {
                icon: Headphones,
                title: 'Dedicated Customer Assistance',
                desc: 'Direct consultation from product selection and quotation through delivery coordination.',
                badge: 'bg-[#EAF7EF] text-[#007B36] border border-[#BCE3CB]',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                  className={`group p-3.5 sm:p-6 bg-white border border-[#E3E5E0] rounded-xl transition-all duration-250 hover:-translate-y-1 hover:shadow-md hover:border-[#F5C7DA] ${
                    idx === 4 ? 'col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${pillar.badge} flex items-center justify-center mb-2.5 sm:mb-4 transition-transform duration-200 group-hover:scale-105`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-[12.5px] sm:text-sm font-extrabold text-[#181A18] mb-1 sm:mb-2 leading-snug">{pillar.title}</h3>
                  <p className="text-[11px] sm:text-xs text-[#525852] leading-snug sm:leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION I: FEATURED PROJECTS */}
      <section className="bg-white py-16 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap items-end justify-between gap-4 mb-9"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768] mb-2">
                Campus Showcase
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-[#181A18] tracking-tight">
                Featured School Projects
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'projects' })}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#D4D7D0] text-sm font-semibold hover:border-[#C22768] hover:text-[#C22768] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Early Years Wing & Montessori Setup',
                location: 'New Delhi NCR · Turnkey Delivery',
                category: 'Preschool & Montessori',
                desc: '140 child-safe 18mm FSC birch stations, curved open Montessori cubbies, and non-toxic tactile learning corners.',
                img: THEME_IMAGES.heroPreschool,
              },
              {
                title: 'K-12 Classroom & Library Modernization',
                location: 'Mumbai West · Institutional Wing',
                category: 'Classroom & Library',
                desc: '420 BIFMA-grade ergonomic student desks paired with curved birch reading stacks and acoustic lounge seating.',
                img: THEME_IMAGES.schoolLibrary,
              },
              {
                title: 'Composite STEM Lab & Outdoor Play Park',
                location: 'Bengaluru South · Campus Fit-Out',
                category: 'Laboratories & Outdoor',
                desc: 'Acid-resistant 19mm phenolic science islands with integrated utilities and UV-8 multi-play outdoor equipment.',
                img: THEME_IMAGES.scienceLab,
              },
            ].map((proj, idx) => (
              <motion.article
                key={proj.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                className="group border border-[#E3E5E0] rounded-xl overflow-hidden bg-white flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#BCE3CB]"
              >
                <div className="aspect-[4/3] bg-[#F7F7F5] overflow-hidden">
                  <img
                    src={proj.img}
                    alt={proj.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs text-[#525852]">
                    {proj.category} · {proj.location}
                  </p>
                  <h3 className="text-lg font-bold text-[#181A18] mt-1.5">{proj.title}</h3>
                  <p className="text-sm text-[#525852] mt-2 flex-1">{proj.desc}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'projects' })}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C22768] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    <span>View Project Details</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION J: TESTIMONIALS */}
      <section className="bg-[#F7F7F5] py-16 md:py-20 sd-lazy-section">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex items-end justify-between gap-4 mb-9"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C22768] mb-2">
                Educator Feedback
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-[#181A18] tracking-tight">
                What Educators &amp; School Leaders Say
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-md border border-[#E3E5E0] bg-white hover:border-[#C22768] hover:text-[#C22768] transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-md border border-[#E3E5E0] bg-white hover:border-[#C22768] hover:text-[#C22768] transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
                className={`p-7 bg-white border rounded-xl flex flex-col justify-between gap-5 transition-all duration-250 ${
                  idx === testimonialIdx
                    ? 'border-[#C22768] shadow-md -translate-y-0.5'
                    : 'border-[#E3E5E0] hover:border-[#F5C7DA]'
                }`}
              >
                <p className="text-sm md:text-base text-[#181A18] leading-relaxed">“{t.quote}”</p>
                <footer>
                  <cite className="not-italic font-bold text-sm text-[#181A18] block">
                    {t.name}
                  </cite>
                  <span className="text-xs text-[#525852]">{t.org}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION J2: PARTNER MATERIAL BRANDS & GOOGLE MAPS CAMPUS STUDIO LOCATOR */}
      <BrandsShowcase onNavigate={onNavigate} />
      <SchoolCampusMap onOpenQuote={onOpenQuote} />

      {/* SECTION K: LIGHT ARCHITECTURAL CTA BANNER WITH 4-COLOR LOGO RIBBON */}
      <div className="grid grid-cols-4 h-[3px] w-full sd-ribbon-animate" aria-hidden="true">
        <span className="bg-[#F088B0]" />
        <span className="bg-[#F01818]" />
        <span className="bg-[#F8D000]" />
        <span className="bg-[#00A048]" />
      </div>
      <section className="bg-gradient-to-br from-[#FAF4EB] via-[#FFFFFF] to-[#FDF2F6] text-[#181A18] py-16 md:py-20 border-b border-[#E6DFCE]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="max-w-3xl mx-auto px-4 md:px-6 text-center"
        >
          <p className="font-script text-2xl sm:text-3xl font-bold text-[#C22768] mb-1">
            Ready to design your campus?
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#181A18] text-balance">
            Let&rsquo;s Create Better Learning Spaces Together
          </h2>
          <p className="mt-4 text-[#525852] text-base md:text-lg max-w-[54ch] mx-auto">
            Planning a new school, upgrading your classroom or creating an inspiring play environment? Let&rsquo;s discuss your requirements.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'contact' })}
              className="px-6 py-3.5 rounded-full bg-[#007B36] hover:bg-[#005D28] text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985] cursor-pointer"
            >
              Contact Our Team
            </button>
            <a
              href={buildWhatsAppUrl(
                '919312254660',
                'School Decor Campus Planning & Furniture Solutions'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FDF0F5] border border-[#D4D7D0] hover:border-[#C22768] text-[#181A18] font-bold text-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.985]"
            >
              <MessageCircle className="w-4 h-4 text-[#007B36]" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
