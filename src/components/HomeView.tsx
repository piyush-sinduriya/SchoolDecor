import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  X,
  SlidersHorizontal,
  ArrowRight,
  User,
  Mail,
  Building2,
  MapPin,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  COLLECTIONS_SHOWCASE,
  PREVIEW_PRODUCTS,
  THEME_IMAGES,
} from '../data/previewCatalog';
import {
  buildWhatsAppUrl,
  SCHOOL_DECOR_CONTACT,
  validateQuoteForm,
  type StoreProduct,
} from '../utils/storefrontHelpers';
import { ProductCard } from './ProductCard';
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

const HERO_SLIDES = [
  {
    id: 'slide-activity-room',
    eyebrow: 'Early Years Role-Play & Collaborative Learning',
    titleMain: 'Interactive & Creative',
    titleHighlight: 'Activity Room Setups',
    subtitle:
      'Turnkey school activity rooms featuring birchwood role-play bazaar stalls, miniature kitchens, hexagonal tables, and pastel chairs.',
    image: THEME_IMAGES.schoolActivityRoom,
    handle: 'activity-room',
  },
  {
    id: 'slide-softplay',
    eyebrow: 'Indoor Cushioned Play & Motor Skills',
    titleMain: 'Safe & Padded',
    titleHighlight: 'Soft Play Zones',
    subtitle:
      'Pastel foam climbers, slides, ball pits, and non-toxic EVA safety floor mats upholstered in wipe-clean antimicrobial vinyl.',
    image: THEME_IMAGES.indoorSoftPlayZone,
    handle: 'soft-play-zones',
  },
  {
    id: 'slide-jungle-zone',
    eyebrow: 'Themed Indoor Adventure Playgrounds',
    titleMain: 'Safari Treehouse',
    titleHighlight: 'Jungle Zone Arenas',
    subtitle:
      'Multi-level indoor treehouse climbers, cushioned suspension rope bridges, spiral tube slides, and soft safari animal rockers.',
    image: THEME_IMAGES.schoolJungleZone,
    handle: 'jungle-play-zone',
  },
  {
    id: 'slide-outdoor-musical',
    eyebrow: 'Acoustic Sensory Parks & Courtyards',
    titleMain: 'All-Weather Harmony',
    titleHighlight: 'Outdoor Musical Instruments',
    subtitle:
      'Pentatonic rainbow tubular chimes, playground xylophones, marimbas, and bongo drums crafted for outdoor school sensory parks.',
    image: THEME_IMAGES.outdoorMusicalInstrument,
    handle: 'outdoor-musical-instruments',
  },
  {
    id: 'slide-sensor-equipment',
    eyebrow: 'Occupational Therapy & Sensory Integration',
    titleMain: 'Calming & Tactile',
    titleHighlight: 'Sensory Equipment Rooms',
    subtitle:
      'Vestibular platform swings, multi-texture tactile walking paths, LED bubble tubes, illuminated sensory tables, and fine-motor wall panels.',
    image: THEME_IMAGES.schoolSensorEquipment,
    handle: 'sensory-equipment',
  },
  {
    id: 'slide-kindergarten',
    eyebrow: 'Early Years & Montessori Spaces',
    titleMain: 'Joyful, Nail-Less',
    titleHighlight: 'Kindergarten & K-12 Furniture',
    subtitle:
      '100% non-toxic birchwood moon tables, BIFMA student desks, library shelving, and science labs crafted at our School Decor Factory.',
    image: THEME_IMAGES.kindergartenMoonTable,
    handle: 'kindergarten-furniture',
  },
];

const EDU_PRODUCT_CATEGORIES = [
  {
    title: 'Activity Room',
    subtitle: 'Role-Play Bazaar Corners, Hexagonal Tables & Learning Hubs',
    handle: 'activity-room',
    image: THEME_IMAGES.schoolActivityRoom,
  },
  {
    title: 'Soft Play',
    subtitle: 'Padded Foam Climbers, Slides, Pastel Ball Pits & Mats',
    handle: 'soft-play-zones',
    image: THEME_IMAGES.indoorSoftPlayZone,
  },
  {
    title: 'Jungle Zone',
    subtitle: 'Indoor Safari Treehouse Climbers, Rope Bridges & Rockers',
    handle: 'jungle-play-zone',
    image: THEME_IMAGES.schoolJungleZone,
  },
  {
    title: 'Outdoor Musical Instrument',
    subtitle: 'Weatherproof Playground Chimes, Xylophones & Bongo Drums',
    handle: 'outdoor-musical-instruments',
    image: THEME_IMAGES.outdoorMusicalInstrument,
  },
  {
    title: 'Sensory Equipment',
    subtitle: 'Therapy Swings, Tactile Balance Paths, Bubble Tubes & Wall Panels',
    handle: 'sensory-equipment',
    image: THEME_IMAGES.schoolSensorEquipment,
  },
  {
    title: 'Kindergarten Furniture',
    subtitle: 'Ages 2–6 · Non-Toxic Birchwood Moon Tables & Chairs',
    handle: 'kindergarten-furniture',
    image: THEME_IMAGES.kindergartenMoonTable,
  },
  {
    title: 'School Classroom Furniture',
    subtitle: 'Grades 1–12 · BIFMA Ergonomic Desks & Benches',
    handle: 'senior',
    image: THEME_IMAGES.classroomDualDesks,
  },
  {
    title: 'Library Furniture',
    subtitle: 'Curved Shelving & Reading Step Lounges',
    handle: 'library',
    image: THEME_IMAGES.schoolLibrary,
  },
  {
    title: 'Montessori Materials',
    subtitle: 'Pink Tower, Bead Frames & Beechwood Trays',
    handle: 'montessori-material',
    image: THEME_IMAGES.montessoriWoodenToys,
  },
  {
    title: 'Preschool Cubbies & Storage',
    subtitle: '12-Bin Toy Organizers & Front-Facing Book Racks',
    handle: 'kindergarten-furniture',
    image: THEME_IMAGES.preschoolToyCubbies,
  },
  {
    title: 'Science & STEM Lab Furniture',
    subtitle: 'Chemical-Resistant Island Benches & Robotics Pods',
    handle: 'science-lab',
    image: THEME_IMAGES.scienceLab,
  },
  {
    title: 'Outdoor Play & EPDM Flooring',
    subtitle: 'Multi-Play Towers, Swings & Wet-Pour Safety Surfacing',
    handle: 'outdoor-fun-equipment',
    image: THEME_IMAGES.epdmSportsFlooring,
  },
];

const RECENT_DELIVERED_PROJECTS = [
  {
    name: 'SRS International School',
    location: 'Delhi NCR',
    category: 'Kindergarten Moon Tables & Activity Wing',
    image: THEME_IMAGES.kindergartenMoonTable,
    handle: 'kindergarten-furniture',
  },
  {
    name: 'Mount Litera Zee School',
    location: 'North India Campus',
    category: 'K-12 Dual Classroom Desks & Seating',
    image: THEME_IMAGES.classroomDualDesks,
    handle: 'senior',
  },
  {
    name: 'The Shri Ram Universal School',
    location: 'Gurugram / NCR',
    category: 'Curved Library & Reading Zone',
    image: THEME_IMAGES.schoolLibrary,
    handle: 'library',
  },
  {
    name: 'Delhi Public School',
    location: 'New Delhi',
    category: 'Outdoor Multi-Play & EPDM Flooring',
    image: THEME_IMAGES.epdmSportsFlooring,
    handle: 'outdoor-fun-equipment',
  },
  {
    name: 'G D Goenka Group',
    location: 'Delhi NCR',
    category: 'Student Cafeteria & Dining Commons',
    image: THEME_IMAGES.schoolCafeteriaDining,
    handle: 'senior',
  },
  {
    name: 'Delhi International School',
    location: 'New Delhi',
    category: 'Indoor Soft Play & Pastel Ball Pit',
    image: THEME_IMAGES.indoorSoftPlayZone,
    handle: 'soft-play-zones',
  },
  {
    name: 'Seth M.R. Jaipuria School',
    location: 'Lucknow / NCR',
    category: 'Computer & STEM Robotics Lab',
    image: THEME_IMAGES.computerStemLab,
    handle: 'computer-lab',
  },
  {
    name: 'The Doon School Wing',
    location: 'Dehradun',
    category: 'Composite Chemistry & Physics Lab',
    image: THEME_IMAGES.scienceLab,
    handle: 'science-lab',
  },
  {
    name: 'Birla Open Minds School',
    location: 'Pan-India Campus',
    category: 'Montessori Sensorial & Cubby Studio',
    image: THEME_IMAGES.montessoriWoodenToys,
    handle: 'montessori-material',
  },
];

const NEW_RANGE_GALLERY = [
  { title: 'Activity Room Setup', tag: 'Activity Room', image: THEME_IMAGES.schoolActivityRoom, handle: 'activity-room' },
  { title: 'Indoor Soft Play & Ball Pit', tag: 'Soft Play', image: THEME_IMAGES.indoorSoftPlayZone, handle: 'soft-play-zones' },
  { title: 'Safari Treehouse Jungle Zone', tag: 'Jungle Zone', image: THEME_IMAGES.schoolJungleZone, handle: 'jungle-play-zone' },
  { title: 'Outdoor Musical Instruments', tag: 'Musical Park', image: THEME_IMAGES.outdoorMusicalInstrument, handle: 'outdoor-musical-instruments' },
  { title: 'Sensory Equipment & Swings', tag: 'Sensory Equipment', image: THEME_IMAGES.schoolSensorEquipment, handle: 'sensory-equipment' },
  { title: 'Pastel Moon Activity Tables', tag: 'Kindergarten', image: THEME_IMAGES.kindergartenMoonTable, handle: 'kindergarten-furniture' },
  { title: 'K-12 Dual Classroom Desks', tag: 'Classroom Series', image: THEME_IMAGES.classroomDualDesks, handle: 'senior' },
  { title: '12-Bin Birch Toy Organizers', tag: 'Preschool Storage', image: THEME_IMAGES.preschoolToyCubbies, handle: 'kindergarten-furniture' },
  { title: 'Montessori Sensorial Apparatus', tag: 'Montessori', image: THEME_IMAGES.montessoriWoodenToys, handle: 'montessori-material' },
  { title: 'Architectural Wave Library', tag: 'Library Series', image: THEME_IMAGES.schoolLibrary, handle: 'library' },
  { title: 'Computer & Robotics STEM Lab', tag: 'Digital & STEM', image: THEME_IMAGES.computerStemLab, handle: 'computer-lab' },
  { title: 'EPDM Playground Safety Flooring', tag: 'Flooring & Parks', image: THEME_IMAGES.epdmSportsFlooring, handle: 'flooring' },
];

const EDU_TESTIMONIALS = [
  {
    author: 'Swami Ishanathananda - R K Mission',
    quote:
      'Our school was in dire need of quality furniture for our students. Thanks to School Decor, we’ve transformed our classrooms into comfortable spaces. The students love it! The complimentary design services they offered were a game-changer, helping us make the right choices for our space.',
  },
  {
    author: 'Prakash Sharma - Academic Director',
    quote:
      '"The quality and durability of the furniture exceeded our expectations. Our classrooms have never looked better, and the students love the new setup. Highly recommend School Decor for any educational institution looking to upgrade!"',
  },
  {
    author: 'Mr Bhavesh Thakur - Delhi Public School',
    quote:
      'School Decor helped us create a vibrant and safe playground for our students. The new playground equipment has added a new dimension to our school, and the kids couldn’t be happier.',
  },
  {
    author: 'Principal - Delhi Public School Wing',
    quote:
      '"Excellent service from start to finish. The furniture is sturdy, stylish, and perfectly suited for our classrooms. Delivery was on time, and the team was professional throughout. We’re thrilled with the results!"',
  },
  {
    author: 'Rajdeep Singh - Campus Administrator',
    quote:
      '"Our school’s learning environment has been transformed with this furniture. The desks and chairs are comfortable, functional, and built to last. The team was responsive and easy to work with. We’re very happy with our purchase!"',
  },
  {
    author: 'Mr Vivek Jain - Modern Public School',
    quote:
      'Excellent service from start to finish. The birchwood Montessori shelves, classroom desks, and lab benches are sturdy, child-safe, and delivered right on schedule across our campus.',
  },
];

const TRUSTED_INSTITUTIONS = [
  { name: 'THE DOON SCHOOL', sub: 'Institutional Partner', color: '#1B4F9C' },
  { name: 'DELHI PUBLIC SCHOOL', sub: 'K-12 Campus Network', color: '#006837' },
  { name: 'MOUNT LITERA ZEE SCHOOL', sub: 'Great School. Great Future', color: '#2B4C9B' },
  { name: 'BIRLA OPEN MINDS', sub: 'International Schools', color: '#D45D2A' },
  { name: 'G D GOENKA GROUP', sub: 'Schools of Excellence', color: '#8C1D40' },
  { name: 'VIBGYOR GROUP', sub: 'Group of Schools', color: '#E56B98' },
  { name: 'THE SHRI RAM SCHOOL', sub: 'Universal Campus', color: '#B8332A' },
  { name: 'SETH M.R. JAIPURIA', sub: 'Educational Society', color: '#1F3A60' },
  { name: 'MILLENNIUM WORLD', sub: 'Experience. Succeed. Lead.', color: '#197B4F' },
  { name: 'RAMAGYA SCHOOL', sub: 'Arise · Awake · Attain', color: '#D97724' },
  { name: 'DELHI INTERNATIONAL', sub: 'Creating Global Heads', color: '#212529' },
  { name: 'RAMAKRISHNA MISSION', sub: 'Educational Trust', color: '#C85A17' },
];

const SOCIAL_HIGHLIGHTS = [
  {
    badge: 'Early Years Safety',
    title: 'Learning Takes Flight with School Decor!',
    subtitle: '100% Nail-Less, Non-Toxic & Rounded-Edge Kindergarten Furniture',
    image: THEME_IMAGES.kindergartenMoonTable,
    accent: '#9AE66E',
    handle: 'kindergarten-furniture',
  },
  {
    badge: 'Collaborative Classrooms',
    title: 'Learning, Together and Happy!',
    subtitle: 'Modular Classroom Desks, Activity Tables & Colourful Storage Units',
    image: THEME_IMAGES.classroomDualDesks,
    accent: '#FFC4DC',
    handle: 'senior',
  },
  {
    badge: 'Montessori & Libraries',
    title: 'Curated Reading & Sensory Spaces',
    subtitle: 'Self-Directed Birchwood Shelving, Reading Nooks & Soft Play Zones',
    image: THEME_IMAGES.montessoriWoodenToys,
    accent: '#FFE07D',
    handle: 'montessori-material',
  },
  {
    badge: 'STEM & Active Play',
    title: 'Future-Ready Labs & Safe Playgrounds',
    subtitle: 'Robotics Workstations, Soft Play Climbers & EPDM Safety Surfacing',
    image: THEME_IMAGES.computerStemLab,
    accent: '#8CD4FF',
    handle: 'computer-lab',
  },
];

const REQUIREMENT_CHIPS = [
  'Kindergarten Wing',
  'K-12 Classrooms',
  'Science & STEM Labs',
  'Library Setup',
  'Indoor / Outdoor Play',
  'Complete School BOQ',
];

export function HomeView({
  onNavigate,
  onQuickView,
  onAddToCart,
  onOpenQuote,
  compareIds,
  onToggleCompare,
}: HomeViewProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [quickDrawerOpen, setQuickDrawerOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Left Quick Query Drawer State
  const [quickForm, setQuickForm] = useState({
    name: '',
    designation: '',
    institutionType: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
    qty: '',
  });
  const [quickSent, setQuickSent] = useState(false);
  const [quickError, setQuickError] = useState('');

  // Right Soft Pastel Logo-Pink Why-Choose-Us Enquiry Form State
  const [whyForm, setWhyForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    requirementScope: 'Kindergarten Wing',
    qtyEstimate: '50 – 150 Units',
    message: '',
  });
  const [whyErrors, setWhyErrors] = useState<string[]>([]);
  const [whySent, setWhySent] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[slideIdx];

  const filteredCatalogProducts =
    selectedCategoryFilter === 'all'
      ? PREVIEW_PRODUCTS
      : PREVIEW_PRODUCTS.filter((p) => {
          if (selectedCategoryFilter === 'activity-room') {
            return p.collectionHandle === 'activity-room' || p.category === 'Activity Room';
          }
          if (selectedCategoryFilter === 'soft-play-zones') {
            return p.collectionHandle === 'soft-play-zones';
          }
          if (selectedCategoryFilter === 'jungle-play-zone') {
            return p.collectionHandle === 'jungle-play-zone' || p.category === 'Jungle Zone';
          }
          if (selectedCategoryFilter === 'outdoor-musical-instruments') {
            return (
              p.collectionHandle === 'outdoor-musical-instruments' ||
              p.category === 'Outdoor Musical Instrument'
            );
          }
          if (selectedCategoryFilter === 'sensory-equipment') {
            return (
              p.collectionHandle === 'sensory-equipment' ||
              p.collectionHandle === 'sensory-room' ||
              p.collectionHandle === 'interactive-wall-panels' ||
              p.category === 'Sensory Equipment'
            );
          }
          if (selectedCategoryFilter === 'kindergarten-furniture') {
            return p.category === 'Kindergarten Furniture';
          }
          if (selectedCategoryFilter === 'senior') {
            return p.category === 'School Furniture';
          }
          if (selectedCategoryFilter === 'library-montessori') {
            return p.category === 'Library Furniture' || p.category === 'Montessori Materials';
          }
          if (selectedCategoryFilter === 'science-lab') {
            return p.category === 'Laboratory';
          }
          if (selectedCategoryFilter === 'outdoor-flooring') {
            return p.category === 'Outdoor' || p.category === 'Flooring';
          }
          return (
            p.collectionHandle === selectedCategoryFilter ||
            p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
          );
        });

  const handleQuickQuerySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!quickForm.name.trim() || !quickForm.phone.trim()) {
      setQuickError('Please enter your Name and Phone Number.');
      return;
    }
    setQuickError('');
    setQuickSent(true);
  };

  const handleWhyFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const combinedRequirements = `${whyForm.requirementScope} (${whyForm.qtyEstimate})${
      whyForm.message ? ` — ${whyForm.message}` : ''
    }`;
    const validation = validateQuoteForm({
      name: whyForm.name,
      phone: whyForm.phone,
      email: whyForm.email,
      institution: whyForm.location || 'School Enquiry',
      productName: whyForm.requirementScope || 'Campus Furniture Consultation',
      quantity: whyForm.qtyEstimate || 'Complete Project',
      location: whyForm.location,
      requirements: combinedRequirements,
    });
    if (!validation.valid) {
      setWhyErrors(validation.errors);
      setWhySent(false);
      return;
    }
    setWhyErrors([]);
    setWhySent(true);
  };

  return (
    <div className="bg-white text-[#212529]">
      {/* =====================================================================
          COLLAPSIBLE LEFT QUICK QUERY SIDEBAR (Upgraded Soft Pastel Form)
      ===================================================================== */}
      <div className="fixed left-0 top-[148px] z-30">
        {!quickDrawerOpen ? (
          <button
            type="button"
            onClick={() => setQuickDrawerOpen(true)}
            aria-label="Open Quick Enquiry Form"
            className="flex items-center gap-1.5 bg-[#EE7DA8] hover:bg-[#E06694] text-white font-bold text-xs px-3.5 py-3 rounded-r-2xl shadow-[0_8px_22px_rgba(238,125,168,0.38)] cursor-pointer transition-transform hover:translate-x-0.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Query</span>
          </button>
        ) : (
          <div className="relative w-[290px] sm:w-[320px] bg-white border border-[#F3BBD2] rounded-r-2xl shadow-[0_20px_50px_rgba(33,37,41,0.18)] overflow-hidden max-h-[82vh] flex flex-col">
            <div className="bg-gradient-to-r from-[#FADCE8] to-[#F7C6DA] px-4 py-3.5 border-b border-[#F3BBD2] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C74B7B] block">
                  Direct Factory Desk
                </span>
                <h3 className="text-xs sm:text-[13.5px] font-bold text-[#212529] leading-snug">
                  Quick Institutional Enquiry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickDrawerOpen(false)}
                aria-label="Close Quick Query Form"
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#212529] inline-flex items-center justify-center font-bold text-sm cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 bg-[#FFFBFD]">
              {quickError && (
                <p role="alert" className="text-[11px] text-red-600 font-semibold bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
                  {quickError}
                </p>
              )}
              {quickSent ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <p className="font-bold">Thank you, {quickForm.name}!</p>
                  <p>Our institutional furniture specialist will contact you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setQuickSent(false)}
                    className="text-[11px] font-bold text-[#D95B8A] underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickQuerySubmit} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    aria-label="Your Name"
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#EFC7D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      aria-label="Designation"
                      value={quickForm.designation}
                      onChange={(e) => setQuickForm({ ...quickForm, designation: e.target.value })}
                      className="w-full h-9 px-2.5 text-xs border border-[#EFC7D8] rounded-xl bg-white text-[#444444] focus:outline-none focus:border-[#EE7DA8]"
                    >
                      <option value="">Designation</option>
                      <option value="Owner">Owner / Chairman</option>
                      <option value="Director">Director / Trustee</option>
                      <option value="Principal">Principal</option>
                      <option value="Admin">Procurement</option>
                      <option value="Architect">Architect</option>
                    </select>
                    <select
                      aria-label="Institution Type"
                      value={quickForm.institutionType}
                      onChange={(e) => setQuickForm({ ...quickForm, institutionType: e.target.value })}
                      className="w-full h-9 px-2.5 text-xs border border-[#EFC7D8] rounded-xl bg-white text-[#444444] focus:outline-none focus:border-[#EE7DA8]"
                    >
                      <option value="">Campus Type</option>
                      <option value="Play School">Play School</option>
                      <option value="K-12 School">K-12 School</option>
                      <option value="Upcoming New School">New School</option>
                      <option value="Architect">Turnkey Partner</option>
                      <option value="College">College</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number *"
                    aria-label="Phone Number"
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#EFC7D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8]"
                  />
                  <input
                    type="email"
                    placeholder="Official Email Address"
                    aria-label="Email"
                    value={quickForm.email}
                    onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#EFC7D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      aria-label="City"
                      value={quickForm.city}
                      onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                      className="w-full h-9 px-3 text-xs bg-white border border-[#EFC7D8] rounded-xl focus:outline-none focus:border-[#EE7DA8]"
                    />
                    <select
                      aria-label="Approximate Quantity"
                      value={quickForm.qty}
                      onChange={(e) => setQuickForm({ ...quickForm, qty: e.target.value })}
                      className="w-full h-9 px-2.5 text-xs border border-[#EFC7D8] rounded-xl bg-white text-[#444444]"
                    >
                      <option value="">Approx Qty</option>
                      <option value="0-50">0 – 50 Units</option>
                      <option value="50-100">50 – 100 Units</option>
                      <option value="100-200">100 – 200 Units</option>
                      <option value="200+">200+ Units</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Furniture items or room details..."
                    aria-label="Message"
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    className="w-full p-2.5 text-xs bg-white border border-[#EFC7D8] rounded-xl focus:outline-none focus:border-[#EE7DA8]"
                  />
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#EE7DA8] hover:bg-[#E06694] text-white font-bold text-xs cursor-pointer transition-colors rounded-xl shadow-sm"
                  >
                    Send Quick Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          FULL-SCREEN HERO BANNER SLIDER WITH CHOREOGRAPHED ENTRANCE ANIMATION
      ===================================================================== */}
      <section aria-label="Featured School Furniture Banners" className="relative bg-white">
        <div className="relative w-full h-[76vh] min-h-[460px] sm:h-[calc(100vh-74px)] sm:min-h-[580px] max-h-[880px] overflow-hidden bg-[#FFF5F9]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.titleHighlight}
              fetchPriority="high"
              initial={{ scale: 1.1, opacity: 0.35 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.03, opacity: 0.25 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
            />
          </AnimatePresence>

          {/* Subtle localized soft gradient only behind the left text area — keeps the photo crystal clear */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(95deg,rgba(15,18,24,0.48)_0%,rgba(15,18,24,0.22)_44%,rgba(15,18,24,0.0)_74%)]"
          />

          <div className="absolute inset-0 max-w-[1280px] mx-auto px-5 sm:px-10 md:px-14 flex items-center justify-between gap-8 pb-10 sm:pb-14">
            {/* Left Staggered Entrance Text Stage */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col justify-center items-start text-left max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: -18, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.48, delay: 0.06, type: 'spring', stiffness: 180, damping: 18 }}
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-[#F7B7D2]/60 text-[#FFE3EE] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4 shadow-sm"
                >
                  <span className="w-3.5 h-[2px] bg-[#F59CC1]" aria-hidden="true" />
                  <span>{currentSlide.eyebrow}</span>
                </motion.div>

                <h1 className="text-white font-extrabold tracking-tight text-[clamp(1.85rem,5vw,4.25rem)] leading-[1.08] max-w-3xl [text-shadow:0_3px_18px_rgba(0,0,0,0.65),0_1px_4px_rgba(0,0,0,0.5)]">
                  <motion.span
                    initial={{ opacity: 0, x: -32, y: 12 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.52, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {currentSlide.titleMain}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 32, y: 14 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.56, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[#FFD1E3] mt-1 underline decoration-[#F088B0] decoration-[3px] underline-offset-[10px]"
                  >
                    {currentSlide.titleHighlight}
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 sm:mt-5 text-white font-medium text-xs sm:text-base md:text-[17px] leading-relaxed max-w-xl [text-shadow:0_2px_12px_rgba(0,0,0,0.75)]"
                >
                  {currentSlide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.36, type: 'spring', stiffness: 160, damping: 18 }}
                  className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
                >
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'collection', handle: currentSlide.handle })}
                    className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#EE7DA8] hover:bg-[#E06694] text-white text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-[1.03]"
                  >
                    <span>Explore {currentSlide.titleHighlight}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenQuote(currentSlide.titleHighlight)}
                    className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-white/95 hover:bg-white text-[#212529] text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all cursor-pointer hover:scale-[1.03]"
                  >
                    Get Free 2D/3D Layout &amp; Quote
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right Floating 3D Glass Preview Card (Desktop Entrance Accent) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${currentSlide.id}`}
                initial={{ opacity: 0, x: 40, y: 20, rotate: 3, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.94 }}
                transition={{ duration: 0.6, delay: 0.22, type: 'spring', stiffness: 140, damping: 18 }}
                className="hidden lg:flex flex-col w-[280px] rounded-3xl bg-white/90 backdrop-blur-md border-2 border-[#F4CFE0] p-3.5 shadow-[0_20px_50px_rgba(15,18,24,0.25)]"
              >
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#F4DCE6] bg-[#FFF5F9]">
                  <img
                    src={ HERO_SLIDES[(slideIdx + 1) % HERO_SLIDES.length].image }
                    alt={ HERO_SLIDES[(slideIdx + 1) % HERO_SLIDES.length].titleHighlight }
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/92 text-[#D95B8A] text-[10px] font-extrabold uppercase tracking-wider border border-[#F4CFE0]">
                    Next Range →
                  </span>
                </div>
                <div className="pt-3 px-1 flex items-center justify-between gap-2">
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D95B8A] truncate">
                      {HERO_SLIDES[(slideIdx + 1) % HERO_SLIDES.length].titleMain}
                    </p>
                    <p className="text-xs font-extrabold text-[#212529] truncate">
                      {HERO_SLIDES[(slideIdx + 1) % HERO_SLIDES.length].titleHighlight}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
                    aria-label="Preview next slide"
                    className="w-8 h-8 rounded-full bg-[#FADCE8] hover:bg-[#EE7DA8] text-[#D95B8A] hover:text-white inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden sm:block absolute inset-x-0 bottom-0 bg-white/88 backdrop-blur-md border-t border-[#F4CFE0] py-2.5">
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-4 gap-4 text-xs text-[#212529] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE7DA8]" />
                <span>100% Nail-Less &amp; Non-Toxic Birchwood</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE7DA8]" />
                <span>BIFMA &amp; EN-1729 Ergonomic Standards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE7DA8]" />
                <span>Direct New Delhi Factory Manufacturing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE7DA8]" />
                <span>Complimentary Campus Space Planning</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            aria-label="Previous slide"
            className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-[#EE7DA8] text-[#212529] hover:text-white shadow-md inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
            className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-[#EE7DA8] text-[#212529] hover:text-white shadow-md inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="bg-white py-3.5 flex items-center justify-center gap-2.5 border-b border-[#F8E5EE]">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlideIdx(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.titleHighlight}`}
              className="w-4 h-4 rounded-full border border-[#F088B0] inline-flex items-center justify-center p-0 bg-white cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full transition-transform ${
                  idx === slideIdx ? 'bg-[#EE7DA8] scale-100' : 'bg-[#F088B0]/35 scale-75'
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SLIM NON-STOP MARQUEE TICKER: India's Leading School Furniture Manufacturer
      ===================================================================== */}
      <section
        aria-label="India’s Leading School & Institutional Furniture Manufacturer"
        className="bg-gradient-to-r from-[#FFF3F8] via-[#FFF9FC] to-[#FFF3F8] border-b border-[#F4CFE0] py-2 sm:py-2.5 overflow-hidden select-none"
      >
        <h2 className="sr-only">
          India’s Leading School &amp; Institutional Furniture Manufacturer
        </h2>
        <div className="sd-ticker-nonstop items-center">
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              aria-hidden={copyIdx === 1 ? 'true' : undefined}
              className="flex items-center shrink-0"
            >
              {[1, 2, 3].map((itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 text-xs sm:text-sm md:text-[15px] font-bold tracking-wide text-[#212529] whitespace-nowrap"
                >
                  <span>
                    India’s Leading{' '}
                    <span className="text-[#E56B98] font-extrabold">
                      School &amp; Institutional Furniture
                    </span>{' '}
                    Manufacturer
                  </span>
                  <span className="text-[#EE7DA8] text-xs" aria-hidden="true">
                    ✦
                  </span>
                  <span className="font-medium text-[#444444]">
                    100% Nail-Less Birchwood Kindergarten Furniture
                  </span>
                  <span className="text-[#EE7DA8] text-xs" aria-hidden="true">
                    ✦
                  </span>
                  <span className="font-medium text-[#444444]">
                    BIFMA Certified K–12 Desks, Libraries, STEM Labs &amp; Playzones
                  </span>
                  <span className="text-[#EE7DA8] text-xs" aria-hidden="true">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 1: PRODUCT CATEGORIES (Category Name Overlaid Directly on Image)
      ===================================================================== */}
      <section className="bg-[#FFF9FC] py-10 sm:py-14 border-y border-[#F7E4EC]">
        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold text-[#212529]">
              Product <span className="text-[#E56B98]">Categories</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#555555] mt-2 leading-relaxed">
              Explore our latest collections, where form and function seamlessly blend to create
              inspiring learning environments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-7">
            {EDU_PRODUCT_CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.title}
                type="button"
                initial={{ opacity: 0, y: 26, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.46, delay: (idx % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onNavigate({ page: 'collection', handle: cat.handle })}
                className="group relative aspect-[16/10] w-full rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#FFFBFD] shadow-[0_8px_24px_rgba(238,125,168,0.10)] border border-[#F4DCE6] hover:border-[#EE7DA8] p-0 cursor-pointer focus:outline-none transition-all hover:-translate-y-1 text-left"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-[1.03] transition-transform duration-700 group-hover:scale-108"
                />
                {/* Clean Light Frosted Glass Overlay — Zero Black Gradient on Image */}
                <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3.5 sm:bottom-3.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/92 group-hover:bg-[#FFF5F9]/95 backdrop-blur-md border border-[#F4CFE0] shadow-[0_4px_16px_rgba(33,37,41,0.08)] flex items-center justify-between gap-2 transition-colors">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(0.78rem,2.2vw,1.08rem)] font-extrabold text-[#212529] group-hover:text-[#D95B8A] transition-colors leading-tight truncate">
                      {cat.title}
                    </h3>
                    <p className="hidden sm:block text-[11px] text-[#666666] mt-0.5 truncate">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FADCE8] group-hover:bg-[#EE7DA8] text-[#D95B8A] group-hover:text-white inline-flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: WHY SCHOOLS CHOOSE US + UPGRADED ARCHITECTURAL CONSULTATION FORM
      ===================================================================== */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Why Schools Choose Us */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2F7] border border-[#F5C6D8] text-[#D95B8A] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Direct Factory Manufacturing · New Delhi</span>
                </span>
                <h2 className="text-[clamp(1.55rem,3.5vw,2.25rem)] font-bold text-[#212529]">
                  Why Schools <span className="text-[#E56B98]">Choose Us</span>
                </h2>
                <p className="text-sm sm:text-[15px] text-[#555555] mt-2 leading-relaxed">
                  Experience Innovative Educational Furniture Collections that combine smart
                  design, premium materials, and modern aesthetics for future-ready institutions.
                </p>
              </div>

              <ul className="space-y-4 pt-1">
                <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFBFD] border border-[#F7E4EC]">
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full border-2 border-[#EE7DA8] bg-[#FADCE8] mt-1.5 shrink-0"
                  />
                  <div className="text-sm sm:text-[14.5px] text-[#666666] leading-relaxed">
                    <strong className="block text-[#212529] font-bold mb-0.5">
                      Industry Leadership &amp; In-House Manufacturing
                    </strong>
                    School Decor is a premier manufacturer and supplier of educational furniture in
                    New Delhi, with dedicated CNC woodworking, powder-coated steel fabrication, and
                    rigorous quality inspection for schools, colleges, and laboratories across
                    India.
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFBFD] border border-[#F7E4EC]">
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full border-2 border-[#EE7DA8] bg-[#FADCE8] mt-1.5 shrink-0"
                  />
                  <div className="text-sm sm:text-[14.5px] text-[#666666] leading-relaxed">
                    <strong className="block text-[#212529] font-bold mb-0.5">
                      Wide &amp; Versatile Product Range
                    </strong>
                    We offer a complete and diversified portfolio — from kindergarten furniture,
                    classroom desks, and science lab tables to library shelving, indoor soft play,
                    and outdoor playground equipment — making us a one-stop partner for all
                    institutional furnishing needs.
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFBFD] border border-[#F7E4EC]">
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full border-2 border-[#EE7DA8] bg-[#FADCE8] mt-1.5 shrink-0"
                  />
                  <div className="text-sm sm:text-[14.5px] text-[#666666] leading-relaxed">
                    <strong className="block text-[#212529] font-bold mb-0.5">
                      Custom Designed Solutions
                    </strong>
                    Our furniture is not just “off-the-shelf” — we provide customized,
                    institution-specific designs, safe rounded edges, and vibrant colour themes that
                    fit the unique floor plan and identity of every campus.
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFBFD] border border-[#F7E4EC]">
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full border-2 border-[#EE7DA8] bg-[#FADCE8] mt-1.5 shrink-0"
                  />
                  <div className="text-sm sm:text-[14.5px] text-[#666666] leading-relaxed">
                    <strong className="block text-[#212529] font-bold mb-0.5">
                      Complimentary Space &amp; Design Assistance
                    </strong>
                    School Decor offers free expert classroom layout and BOQ planning assistance —
                    helping school founders, principals, and architects visualize their learning
                    spaces before purchase.
                  </div>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={SCHOOL_DECOR_CONTACT.telHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EE7DA8] hover:bg-[#E06694] text-white font-bold text-sm shadow-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {SCHOOL_DECOR_CONTACT.phoneDisplay}</span>
                </a>
                <a
                  href={buildWhatsAppUrl(SCHOOL_DECOR_CONTACT.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#F088B0] text-[#D95B8A] hover:bg-[#FFF5F9] font-bold text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp BOQ Desk</span>
                </a>
              </div>
            </div>

            {/* Right Column: Upgraded Soft Pastel Pink Architectural Consultation Form Card */}
            <div className="lg:col-span-6 xl:col-span-5 bg-gradient-to-b from-[#FFF6FA] via-[#FDEBF3] to-[#FADCE8] border border-[#F2BCD2] rounded-[26px] p-5 sm:p-7 text-[#212529] shadow-[0_18px_45px_rgba(238,125,168,0.16)] relative overflow-hidden">
              {/* Top Soft Pink Form Header */}
              <div className="pb-4 mb-4 border-b border-[#F2C2D6]/70">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#F3BBD2] text-[#D95B8A] text-[10.5px] font-extrabold uppercase tracking-wider mb-2 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#EE7DA8]" />
                  <span>Free 2D/3D Layout &amp; Factory Quote</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#212529] tracking-tight">
                  Request Campus Consultation
                </h3>
                <p className="text-xs sm:text-[13px] text-[#555555] mt-1 leading-relaxed">
                  Share your requirement below for factory-direct institutional pricing &amp; space planning within 24 hours.
                </p>

                {/* 3 Micro-Trust Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Direct Factory Rates', 'BIFMA Certified', 'Pan-India Dispatch'].map((pill) => (
                    <span
                      key={pill}
                      className="px-2.5 py-0.5 rounded-md bg-white/80 border border-[#F3C8DA] text-[10.5px] font-semibold text-[#664352]"
                    >
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              </div>

              {whyErrors.length > 0 && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 rounded-xl bg-white text-red-700 text-xs space-y-1 border border-red-200 shadow-xs"
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please check the following:</span>
                  </div>
                  <ul className="list-disc pl-4">
                    {whyErrors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {whySent ? (
                <div
                  role="status"
                  className="p-6 rounded-2xl bg-white border border-[#F2C2D5] text-[#212529] space-y-3 text-sm shadow-sm"
                >
                  <div className="flex items-center gap-2 text-[#007B36] font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Consultation Request Received!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    Thank you, <strong>{whyForm.name}</strong>! Our project specialist at School
                    Decor ({SCHOOL_DECOR_CONTACT.phoneDisplay}) will reach out with your customized
                    layout and institutional quote for <strong>{whyForm.requirementScope}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setWhySent(false);
                      setWhyForm({
                        name: '',
                        email: '',
                        phone: '',
                        location: '',
                        requirementScope: 'Kindergarten Wing',
                        qtyEstimate: '50 – 150 Units',
                        message: '',
                      });
                    }}
                    className="text-xs font-bold text-[#D95B8A] underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWhyFormSubmit} noValidate className="space-y-3.5">
                  {/* Interactive Requirement Scope Pills */}
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A3D4A] mb-1.5">
                      1. Select Requirement Scope
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {REQUIREMENT_CHIPS.map((chip) => {
                        const active = whyForm.requirementScope === chip;
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setWhyForm({ ...whyForm, requirementScope: chip })}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                              active
                                ? 'bg-[#EE7DA8] text-white border-[#EE7DA8] shadow-2xs'
                                : 'bg-white/90 text-[#444444] border-[#F0C4D6] hover:border-[#EE7DA8]'
                            }`}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2-Column Row: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label htmlFor="why-name" className="block text-xs font-bold text-[#333333] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#D96B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="why-name"
                          type="text"
                          placeholder="Your Name"
                          value={whyForm.name}
                          onChange={(e) => setWhyForm({ ...whyForm, name: e.target.value })}
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-[#212529] text-xs sm:text-sm border border-[#F0C4D6] focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8] shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="why-phone" className="block text-xs font-bold text-[#333333] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#D96B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="why-phone"
                          type="tel"
                          placeholder="+91 98XXXXXXXX"
                          value={whyForm.phone}
                          onChange={(e) => setWhyForm({ ...whyForm, phone: e.target.value })}
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-[#212529] text-xs sm:text-sm border border-[#F0C4D6] focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8] shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Row: Email & School/City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="why-email" className="block text-xs font-bold text-[#333333] mb-1">
                        Official Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#D96B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="why-email"
                          type="email"
                          placeholder="name@school.edu"
                          value={whyForm.email}
                          onChange={(e) => setWhyForm({ ...whyForm, email: e.target.value })}
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-[#212529] text-xs sm:text-sm border border-[#F0C4D6] focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8] shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="why-location" className="block text-xs font-bold text-[#333333] mb-1">
                        School Name &amp; City *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#D96B96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="why-location"
                          type="text"
                          placeholder="e.g. DPS, New Delhi"
                          value={whyForm.location}
                          onChange={(e) => setWhyForm({ ...whyForm, location: e.target.value })}
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-[#212529] text-xs sm:text-sm border border-[#F0C4D6] focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8] shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message / Notes */}
                  <div>
                    <label htmlFor="why-msg" className="block text-xs font-bold text-[#333333] mb-1">
                      Room Count / Specific Requirements
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#D96B96] absolute left-3 top-3 pointer-events-none" />
                      <textarea
                        id="why-msg"
                        rows={2}
                        placeholder="Share classroom count, student age group, or delivery timeline..."
                        value={whyForm.message}
                        onChange={(e) => setWhyForm({ ...whyForm, message: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-[#212529] text-xs sm:text-sm border border-[#F0C4D6] focus:outline-none focus:ring-2 focus:ring-[#EE7DA8]/35 focus:border-[#EE7DA8] shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#EE7DA8] hover:bg-[#E06694] text-white font-bold text-sm shadow-[0_8px_20px_rgba(238,125,168,0.38)] transition-all cursor-pointer inline-flex items-center justify-center gap-2 mt-1"
                  >
                    <span>Get Free Price Quote &amp; Layout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: RECENTLY DELIVERED PROJECTS (School & Project Name Overlaid on Image)
      ===================================================================== */}
      <section className="bg-[#FFF9FC] py-10 sm:py-14 border-y border-[#F7E4EC]">
        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold text-[#212529]">
              Recently Delivered <span className="text-[#E56B98]">Projects</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#555555] mt-2 leading-relaxed">
              Experience Innovative Educational Furniture Collections that combine smart design,
              premium materials, and modern aesthetics for future-ready institutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-7">
            {RECENT_DELIVERED_PROJECTS.map((proj, index) => (
              <button
                key={`${proj.name}-${index}`}
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: proj.handle })}
                className="group relative aspect-[16/10] w-full rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#FFFBFD] shadow-[0_8px_24px_rgba(238,125,168,0.10)] border border-[#F4DCE6] hover:border-[#EE7DA8] p-0 cursor-pointer transition-all hover:-translate-y-1 text-left"
              >
                <img
                  src={proj.image}
                  alt={proj.name}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-[1.03] transition-transform duration-700 group-hover:scale-108"
                />
                {/* Location Badge Top-Left (Light Frosted Pill) */}
                <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/92 backdrop-blur-md border border-[#F4CFE0] text-[9.5px] sm:text-[10.5px] font-bold text-[#D95B8A] shadow-2xs">
                  <MapPin className="w-2.5 h-2.5 text-[#EE7DA8]" />
                  <span>{proj.location}</span>
                </span>
                {/* Overlaid Project Name & Category (Light Frosted Glass — Zero Black) */}
                <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3.5 sm:bottom-3.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/92 group-hover:bg-[#FFF5F9]/95 backdrop-blur-md border border-[#F4CFE0] shadow-[0_4px_16px_rgba(33,37,41,0.08)] transition-colors">
                  <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#D95B8A] truncate">
                    {proj.category}
                  </p>
                  <h3 className="text-[clamp(0.78rem,2.2vw,1.05rem)] font-extrabold text-[#212529] group-hover:text-[#D95B8A] transition-colors leading-snug truncate">
                    {proj.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: NEW PRODUCT RANGE (Overlaid Range Title on Image + Online Ordering Grid)
      ===================================================================== */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold text-[#212529]">
              New <span className="text-[#E56B98]">Product Range</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#555555] mt-2 leading-relaxed">
              School Decor recently completed a comprehensive school furniture range with a strong
              focus on quality, comfort, and durability — including student desks, ergonomic
              chairs, teacher tables, Montessori units, and laboratory furniture suitable for daily
              institutional use.
            </p>
          </div>

          {/* 4-Column Rounded Visual Range Grid with Clear Image & Light Frosted Overlay Name */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-12">
            {NEW_RANGE_GALLERY.map((item, idx) => (
              <button
                key={`${item.title}-${idx}`}
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: item.handle })}
                className="group relative aspect-[16/10] w-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#FFFBFD] border border-[#F4DCE6] hover:border-[#EE7DA8] shadow-xs cursor-pointer p-0 transition-all hover:-translate-y-0.5 text-left"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-[1.03] transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-x-2 bottom-2 sm:inset-x-2.5 sm:bottom-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/92 group-hover:bg-[#FFF5F9]/95 backdrop-blur-md border border-[#F4CFE0] shadow-xs transition-colors">
                  <span className="text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-[#D95B8A] block truncate">
                    {item.tag}
                  </span>
                  <span className="text-[#212529] group-hover:text-[#D95B8A] text-[11px] sm:text-[12.5px] font-bold leading-tight block truncate">
                    {item.title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Interactive E-Commerce Product Ordering & Bulk Quote Grid */}
          <div className="pt-4 border-t border-[#F7E4EC]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#212529]">
                  Order Online or Request Institutional Bulk Quote ({filteredCatalogProducts.length} Products)
                </h3>
                <p className="text-xs sm:text-sm text-[#666666]">
                  Filter by category below or select any furniture model for specifications, direct cart checkout, or custom campus pricing.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: `All Products (${PREVIEW_PRODUCTS.length})`, value: 'all' },
                  { label: 'Activity Room', value: 'activity-room' },
                  { label: 'Soft Play', value: 'soft-play-zones' },
                  { label: 'Jungle Zone', value: 'jungle-play-zone' },
                  { label: 'Outdoor Musical Instrument', value: 'outdoor-musical-instruments' },
                  { label: 'Sensory Equipment', value: 'sensory-equipment' },
                  { label: 'Kindergarten', value: 'kindergarten-furniture' },
                  { label: 'Classrooms & Labs', value: 'senior' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      selectedCategoryFilter === tab.value
                        ? 'bg-[#EE7DA8] text-white border-[#EE7DA8]'
                        : 'bg-[#FFF8FB] text-[#555555] border-[#F3DCE6] hover:border-[#EE7DA8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredCatalogProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenProduct={(handle) => onNavigate({ page: 'product', handle })}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onOpenQuote={(title) => onOpenQuote(title)}
                  isCompared={compareIds.includes(product.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: 'all' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EE7DA8] hover:bg-[#E06694] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>View Complete {COLLECTIONS_SHOWCASE.length}-Category Catalog ({PREVIEW_PRODUCTS.length} Models)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: TESTIMONIALS (White Cards with Soft Light Pink Bottom Accent)
      ===================================================================== */}
      <section className="bg-[#FFF9FC] py-10 sm:py-14 border-y border-[#F7E4EC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold text-[#212529] tracking-wide">
              Campus <span className="text-[#E56B98]">Testimonials</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#555555] mt-2 leading-relaxed">
              Don’t just take our word for it – hear from school leaders and educators who’ve
              experienced the transformative power of our furniture solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {EDU_TESTIMONIALS.map((item) => (
              <article
                key={item.author}
                className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F4DCE6] border-b-[3px] border-b-[#F088B0] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base sm:text-[17px] font-bold text-[#212529] mb-2.5">
                    {item.author}
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#666666] leading-relaxed">
                    {item.quote}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: TRUSTED BY LEADING BRANDS & INSTITUTIONS (Hairline Grid)
      ===================================================================== */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold text-[#212529]">
              Trusted By <span className="text-[#E56B98]">Leading Brands</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#555555] mt-2 leading-relaxed">
              Trusted by top organizations and educational institutions across India, we are proud
              of our extensive portfolio of successfully delivered campus projects.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#F3DCE6]">
            {TRUSTED_INSTITUTIONS.map((inst) => (
              <div
                key={inst.name}
                className="border-r border-b border-[#F3DCE6] p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[96px] hover:bg-[#FFF7FA] transition-colors"
              >
                <span
                  style={{ color: inst.color }}
                  className="font-extrabold text-xs sm:text-[13px] tracking-tight leading-snug"
                >
                  {inst.name}
                </span>
                <span className="text-[10.5px] text-[#777777] mt-1">{inst.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: CAMPUS SHOWCASE & UPDATES FEED (4-Col Visual Cards with Image Overlay)
      ===================================================================== */}
      <section className="bg-[#FFF9FC] py-10 sm:py-14 border-t border-[#F7E4EC]">
        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-[clamp(1.35rem,3vw,1.9rem)] font-bold text-[#212529]">
              Featured <span className="text-[#E56B98]">Campus Updates</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] mt-1.5">
              Fresh updates, ergonomic classroom insights, and behind-the-scenes from our Delhi NCR
              manufacturing unit.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {SOCIAL_HIGHLIGHTS.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate({ page: 'collection', handle: card.handle })}
                className="group bg-white rounded-2xl overflow-hidden border border-[#F4DCE6] hover:border-[#EE7DA8] shadow-xs flex flex-col text-left p-0 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFFBFD]">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover brightness-[1.03] transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-x-2.5 bottom-2.5 p-2.5 sm:p-3 rounded-xl bg-white/92 group-hover:bg-[#FFF5F9]/95 backdrop-blur-md border border-[#F4CFE0] shadow-xs">
                    <span className="text-[9px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-[#D95B8A] block">
                      {card.badge}
                    </span>
                    <h3 className="text-[11.5px] sm:text-xs font-bold text-[#212529] mt-0.5 line-clamp-2 leading-snug">
                      {card.title}
                    </h3>
                  </div>
                </div>
                <div className="px-3.5 py-2.5 bg-white border-t border-[#F7E2EB] flex items-center justify-between text-[10.5px] sm:text-xs font-bold text-[#212529]">
                  <span className="truncate">Bulk Orders: {SCHOOL_DECOR_CONTACT.phoneDisplay}</span>
                  <span className="text-[#E56B98] shrink-0 ml-1">Explore →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
