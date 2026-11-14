import heroClassroomImg from '../assets/images/hero_modern_classroom.webp';
import heroPreschoolImg from '../assets/images/hero_preschool_play.webp';
import scienceLabImg from '../assets/images/category_science_lab.webp';
import outdoorPlayImg from '../assets/images/category_outdoor_playground.webp';
import schoolLibraryImg from '../assets/images/about_school_interior.webp';
import ergonomicDeskImg from '../assets/images/product_ergonomic_desk.webp';
import cutoutStudentDeskImg from '../assets/images/cutout_student_desk.webp';
import cutoutHeroDeskImg from '../assets/images/cutout_hero_desk.webp';
import cutoutHeroChairImg from '../assets/images/cutout_hero_chair.webp';
import cutoutMontessoriShelfImg from '../assets/images/cutout_montessori_shelf.webp';
import cutoutSoftPlayClimberImg from '../assets/images/cutout_soft_play_climber.webp';
import cutoutScienceLabBenchImg from '../assets/images/cutout_science_lab_bench.webp';
import type { StoreProduct } from '../utils/storefrontHelpers';

export const LOGO_SRC = '/assets/aistudio/School_Decor.in__Logo_88b796f4.png';

export const THEME_IMAGES = {
  heroClassroom: heroClassroomImg,
  heroPreschool: heroPreschoolImg,
  scienceLab: scienceLabImg,
  outdoorPlay: outdoorPlayImg,
  schoolLibrary: schoolLibraryImg,
  ergonomicDesk: ergonomicDeskImg,
  cutoutStudentDesk: cutoutStudentDeskImg,
  cutoutHeroDesk: cutoutHeroDeskImg,
  cutoutHeroChair: cutoutHeroChairImg,
  cutoutMontessoriShelf: cutoutMontessoriShelfImg,
  cutoutSoftPlayClimber: cutoutSoftPlayClimberImg,
  cutoutScienceLabBench: cutoutScienceLabBenchImg,
};

export interface CutoutHotspot {
  id: string;
  label: string;
  detail: string;
  top: string;
  left: string;
}

export interface CutoutShowcaseItem {
  id: string;
  productHandle: string;
  collectionHandle: string;
  shortLabel: string;
  title: string;
  category: string;
  scriptTag: string;
  tagline: string;
  priceLabel: string;
  dimensions: string;
  ageGroup: string;
  materials: string;
  specHighlights: string[];
  hotspots: CutoutHotspot[];
  image: string;
  splitLeftImage?: string;
  splitRightImage?: string;
  tintBg: string;
  borderTint: string;
  barColor: string;
  stageBg: string;
  stageAccent: string;
  stickerRotate: number;
  parallaxOffset: number;
}

export const CUTOUT_SHOWCASE_ITEMS: CutoutShowcaseItem[] = [
  {
    id: 'cut-desk',
    productHandle: 'ergonomic-birch-student-desk',
    collectionHandle: 'senior',
    shortLabel: 'Student Desk',
    title: 'Ergonomic Birch & Steel Desk Set',
    category: 'School Furniture',
    scriptTag: 'posture-tuned',
    tagline: 'Height-adjustable powder-coated steel frames paired with warm contoured birchwood tops.',
    priceLabel: '₹9,450 · In Stock',
    dimensions: '600 × 450 × 640–760 mm',
    ageGroup: 'Grades 1–12',
    materials: '18mm Birch Plywood + 1.6mm Steel',
    specHighlights: ['Waterfall front comfort curve', 'Under-desk heavy steel book tray', 'Non-marking floor levelers'],
    hotspots: [
      { id: 'desk-top', label: 'Contoured Birch Top', detail: '18mm FSC birch veneer with rounded R16 forearm waterfall profile and scratch-resistant PU seal.', top: '22%', left: '36%' },
      { id: 'desk-frame', label: 'Powder-Coat Frame', detail: '1.6mm cold-rolled steel tube legs with telescopic height settings matching primary to senior wings.', top: '55%', left: '19%' },
      { id: 'chair-shell', label: 'Posture Backrest', detail: '3D curved laminated shell engineered for lumbar alignment during 6-hour school days.', top: '42%', left: '74%' },
    ],
    image: cutoutStudentDeskImg,
    splitLeftImage: cutoutHeroDeskImg,
    splitRightImage: cutoutHeroChairImg,
    tintBg: '#FAF3EB',
    borderTint: '#E5D8C6',
    barColor: '#C22768',
    stageBg: '#FAF3EB',
    stageAccent: '#161A17',
    stickerRotate: -3,
    parallaxOffset: -14,
  },
  {
    id: 'cut-shelf',
    productHandle: 'curved-montessori-classroom-shelving',
    collectionHandle: 'kindergarten-furniture',
    shortLabel: 'Montessori Unit',
    title: 'Curved Montessori Birch Activity Unit',
    category: 'Kindergarten & Early Years',
    scriptTag: 'child-scaled',
    tagline: 'Splinter-free rounded edges and open cubby bays built for self-directed early learning.',
    priceLabel: '₹16,800 · In Stock',
    dimensions: '1400 × 380 × 780 mm',
    ageGroup: 'Ages 2–6 Yrs',
    materials: 'Zero-VOC European Birch',
    specHighlights: ['Full R20 safety-radius edges', 'Anti-tip wide base geometry', 'Eye-level Montessori bay heights'],
    hotspots: [
      { id: 'shelf-edge', label: 'R20 Safety Corners', detail: 'Every corner CNC-chamfered and hand-sanded smooth to protect toddlers in active corners.', top: '18%', left: '28%' },
      { id: 'shelf-cubby', label: 'Open Activity Bays', detail: 'Variable-width open compartments fit Montessori trays, sensory baskets, and oversized picture books.', top: '52%', left: '54%' },
      { id: 'shelf-finish', label: 'Zero-VOC Sealant', detail: 'Water-based matte child-safe finish wipes clean effortlessly from tempera paint and markers.', top: '76%', left: '72%' },
    ],
    image: cutoutMontessoriShelfImg,
    tintBg: '#FDF0F5',
    borderTint: '#F5C7DA',
    barColor: '#C22768',
    stageBg: '#FDF0F5',
    stageAccent: '#C22768',
    stickerRotate: 2.5,
    parallaxOffset: 14,
  },
  {
    id: 'cut-play',
    productHandle: 'soft-rainbow-climber-play-zone',
    collectionHandle: 'soft-play-zones',
    shortLabel: 'Soft-Play Climber',
    title: 'Modular Soft-Play Foam Climber Set',
    category: 'Active Play Equipment',
    scriptTag: 'active play',
    tagline: 'High-density medical-grade foam wrapped in wipe-clean vinyl for safe gross-motor exploration.',
    priceLabel: '₹24,500 · Featured',
    dimensions: '2400 × 1800 × 620 mm',
    ageGroup: 'Pre-K & Toddler',
    materials: 'HR PU Foam + PVC-Free Vinyl',
    specHighlights: ['Antimicrobial wipe-clean skin', 'Hook-and-loop anchor strips', 'Concealed pinch-free zippers'],
    hotspots: [
      { id: 'play-foam', label: 'High-Resilience Core', detail: '28-density supportive PU foam absorbs jumps without bottoming out during group play.', top: '26%', left: '46%' },
      { id: 'play-seams', label: 'Reinforced Double Stitch', detail: 'Double-needle bonded nylon seams with hidden inward zipper pulls keep toddler fingers protected.', top: '56%', left: '72%' },
      { id: 'play-base', label: 'Modular Hook Strips', detail: 'Wide hook-and-loop underside connectors lock steps, arches, and landing mats firmly together.', top: '74%', left: '30%' },
    ],
    image: cutoutSoftPlayClimberImg,
    tintBg: '#FFF7DC',
    borderTint: '#F2DF7E',
    barColor: '#D4A800',
    stageBg: '#FFF7DC',
    stageAccent: '#8A6D00',
    stickerRotate: -2,
    parallaxOffset: -14,
  },
  {
    id: 'cut-lab',
    productHandle: 'modular-science-lab-island',
    collectionHandle: 'science-lab',
    shortLabel: 'STEM Island Lab',
    title: 'Chemistry & STEM Island Workbench',
    category: 'Science & STEM Labs',
    scriptTag: 'lab-engineered',
    tagline: 'Chemical-resistant phenolic worktops with integrated utility sinks and lockable reagent storage.',
    priceLabel: 'Custom Institutional Quote',
    dimensions: '2400 × 1200 × 900 mm',
    ageGroup: 'Grades 6–12 & Colleges',
    materials: '19mm Phenolic Resin + Steel',
    specHighlights: ['Acid & heat proof worktop', 'Dual gooseneck lab fixtures', 'Concealed service utility chase'],
    hotspots: [
      { id: 'lab-top', label: '19mm Phenolic Resin', detail: 'Laboratory-grade impervious worktop resists dilute acids, solvents, impact, and 180°C thermal shock.', top: '34%', left: '48%' },
      { id: 'lab-turret', label: 'Dual Service Turrets', detail: 'Epoxy-coated brass water taps, gas valves, and IP44 splash-proof electrical outlets at each bay.', top: '22%', left: '72%' },
      { id: 'lab-cab', label: 'Under-Bench Storage', detail: 'Lockable ventilated reagent drawers and chemical-resistant shelving keep glassware organized.', top: '72%', left: '28%' },
    ],
    image: cutoutScienceLabBenchImg,
    tintBg: '#EDF3F7',
    borderTint: '#CBD8E1',
    barColor: '#D91B22',
    stageBg: '#EDF3F7',
    stageAccent: '#C22768',
    stickerRotate: 3,
    parallaxOffset: 14,
  },
];

export const MARQUEE_WORDS_ROW_1 = [
  { word: 'Ergonomic', color: '#C22768' },
  { word: 'Birchwood', color: '#007B36' },
  { word: 'Montessori', color: '#9E7900' },
  { word: 'Active Play', color: '#D91B22' },
  { word: 'STEM Labs', color: '#181A18' },
  { word: 'Sensory', color: '#C22768' },
];

export const MARQUEE_WORDS_ROW_2 = [
  { word: 'Kindergarten', color: '#007B36' },
  { word: 'Outdoor Parks', color: '#181A18' },
  { word: 'Safe Edges', color: '#C22768' },
  { word: 'Modular', color: '#9E7900' },
  { word: 'Campus Ready', color: '#D91B22' },
  { word: 'Flooring', color: '#007B36' },
];

export const PROCESS_STEPS = [
  {
    step: '1',
    phaseLabel: 'Discovery & CAD Mapping',
    title: 'Campus Walkthrough & Space Mapping',
    desc: 'We review your wing dimensions, student age groups, and classroom flow so every desk, shelf, and activity zone fits naturally without crowding.',
    deliverables: ['2D Scaled Room Layouts', 'Age-Group Sizing Matrix', 'Circulation & Safety Zones'],
    cutoutIdx: 0,
  },
  {
    step: '2',
    phaseLabel: 'Material & Finish Spec',
    title: 'Custom Sizing, Colors & Finishes',
    desc: 'Select ergonomic seat heights, rounded birch laminates, powder-coat steel shades, and soft-play upholstery palettes aligned to your school identity.',
    deliverables: ['Birch & Laminate Swatches', 'RAL Powder-Coat Matching', 'Ergonomic Height Schedule'],
    cutoutIdx: 1,
  },
  {
    step: '3',
    phaseLabel: 'Factory Production & QA',
    title: 'Institutional Manufacturing & QC',
    desc: 'Every unit is built for multi-year daily campus use with child-safe edge radii, non-toxic finishes, and heavy-gauge hardware checks.',
    deliverables: ['CNC Corner Chamfering', 'Weld & Load Stress Audits', 'Non-Toxic Sealant Verification'],
    cutoutIdx: 2,
  },
  {
    step: '4',
    phaseLabel: 'Logistics & Installation',
    title: 'Coordinated Dispatch & Wing Setup',
    desc: 'Room-by-room delivery scheduling and guided assembly ensure laboratories, classrooms, and play rooms open cleanly before term starts.',
    deliverables: ['Wing-Labeled Flat Packing', 'On-Site Lab & Desk Anchoring', 'Final Principal Walkthrough'],
    cutoutIdx: 3,
  },
  {
    step: '5',
    phaseLabel: 'Multi-Year Partnership',
    title: 'Ongoing Campus Expansion Support',
    desc: 'When you add new sections, STEM labs, or outdoor play zones in future academic sessions, matching modules stay available seamlessly.',
    deliverables: ['Saved Campus Finish Specs', 'Modular Spare Parts Access', 'Rapid Batch Re-Ordering'],
    cutoutIdx: 0,
  },
];

export interface MegaMenuConfig {
  label: string;
  href: string;
  featuredTitle: string;
  featuredDesc: string;
  featuredImage: string;
  columns: {
    heading: string;
    links: { title: string; handle: string }[];
  }[];
}

export const MEGA_MENUS: MegaMenuConfig[] = [
  {
    label: 'Furniture',
    href: 'kindergarten-furniture',
    featuredTitle: 'Ergonomic Learning Furniture',
    featuredDesc: 'Kindergarten, primary, senior classroom, library and storage systems.',
    featuredImage: heroClassroomImg,
    columns: [
      {
        heading: 'Classroom & Early Years',
        links: [
          { title: 'Kindergarten Furniture', handle: 'kindergarten-furniture' },
          { title: 'Senior School Furniture', handle: 'senior' },
          { title: 'Day Care Furniture', handle: 'day-care' },
          { title: 'Montessori Materials', handle: 'montessori-material' },
          { title: 'Role Play Corners', handle: 'role-play' },
        ],
      },
      {
        heading: 'Spaces & Organization',
        links: [
          { title: 'Library Furniture', handle: 'library' },
          { title: 'Storage Solutions', handle: 'storage' },
          { title: 'Sensory Rooms', handle: 'sensory-room' },
          { title: 'Kids Sofa & Seating', handle: 'kids-sofa' },
          { title: 'Motor Skill Toys', handle: 'motor-skill-toys' },
        ],
      },
    ],
  },
  {
    label: 'Active Play',
    href: 'soft-play-zones',
    featuredTitle: 'Indoor Active & Sensory Play',
    featuredDesc: 'Safe soft play zones, climbing gyms and interactive wall panels.',
    featuredImage: heroPreschoolImg,
    columns: [
      {
        heading: 'Play Zones & Gyms',
        links: [
          { title: 'Soft Play Zones', handle: 'soft-play-zones' },
          { title: 'Jungle Play Zone', handle: 'jungle-play-zone' },
          { title: 'Toddlers & Kids Gym', handle: 'toddlers-kids-gym' },
          { title: 'Ride-Ons & Slides', handle: 'ride-ons-slides' },
        ],
      },
      {
        heading: 'Sensory & Motor Play',
        links: [
          { title: 'Interactive Wall Panels', handle: 'interactive-wall-panels' },
          { title: 'Sensory Bouncy Play', handle: 'sensory-bouncy-play' },
          { title: 'Sensory Rooms', handle: 'sensory-room' },
          { title: 'Motor Skill Toys', handle: 'motor-skill-toys' },
        ],
      },
    ],
  },
  {
    label: 'Laboratory',
    href: 'science-lab',
    featuredTitle: 'Future-Ready School Laboratories',
    featuredDesc: 'Science, STEM, computer, mathematics and creative art laboratories.',
    featuredImage: scienceLabImg,
    columns: [
      {
        heading: 'STEM & Sciences',
        links: [
          { title: 'Science Lab', handle: 'science-lab' },
          { title: 'STEM Lab', handle: 'stem-lab' },
          { title: 'Math Lab', handle: 'math-lab' },
        ],
      },
      {
        heading: 'Creative & Digital',
        links: [
          { title: 'Computer Lab', handle: 'computer-lab' },
          { title: 'Art Lab', handle: 'art-lab' },
          { title: 'World Explorer Lab', handle: 'world-explorer-lab' },
        ],
      },
    ],
  },
  {
    label: 'Outdoor',
    href: 'outdoor-fun-equipment',
    featuredTitle: 'Outdoor Play & Campus Parks',
    featuredDesc: 'Climbers, sensory parks, science park equipment and campus seating.',
    featuredImage: outdoorPlayImg,
    columns: [
      {
        heading: 'Play Structures',
        links: [
          { title: 'Outdoor Fun Equipment', handle: 'outdoor-fun-equipment' },
          { title: 'Climbers', handle: 'climbers' },
          { title: 'Outdoor Toy Train Ride', handle: 'outdoor-toy-train-ride' },
          { title: 'Animal Statues', handle: 'animal-statues' },
        ],
      },
      {
        heading: 'Activity & Campus Parks',
        links: [
          { title: 'Sensory Park', handle: 'sensory-park' },
          { title: 'Math & Science Park', handle: 'math-science-park-equipment' },
          { title: 'Open Air Gym', handle: 'open-air-gym' },
          { title: 'Park Benches', handle: 'park-bench' },
        ],
      },
    ],
  },
  {
    label: 'Flooring',
    href: 'flooring',
    featuredTitle: 'Specialized School Flooring',
    featuredDesc: 'Impact-safe play surfacing, classroom vinyl and squash/sports courts.',
    featuredImage: schoolLibraryImg,
    columns: [
      {
        heading: 'Surfacing & Courts',
        links: [
          { title: 'Squash & Sports Courts', handle: 'flooring' },
          { title: 'All Collections', handle: 'all' },
        ],
      },
    ],
  },
];

export const COLLECTIONS_SHOWCASE = [
  { title: 'School Furniture', subtitle: 'Grades 1–12 · Desks & Modular Seating', tag: 'Classroom', handle: 'senior', image: heroClassroomImg },
  { title: 'Kindergarten Furniture', subtitle: 'Ages 3–6 · Birch Chairs & Tables', tag: 'Early Years', handle: 'kindergarten-furniture', image: heroPreschoolImg },
  { title: 'Preschool Furniture', subtitle: 'Nursery Wings · Daycare Storage & Cots', tag: 'Preschool', handle: 'day-care', image: ergonomicDeskImg },
  { title: 'Montessori Materials', subtitle: 'Self-Directed Trays & Open Shelving', tag: 'Montessori', handle: 'montessori-material', image: heroPreschoolImg },
  { title: 'Active Play Equipment', subtitle: 'Soft Climbers, Bridges & Foam Sets', tag: 'Indoor Play', handle: 'soft-play-zones', image: heroPreschoolImg },
  { title: 'Sensory Rooms', subtitle: 'Tactile Wall Panels & Calming Corners', tag: 'Sensory', handle: 'sensory-room', image: schoolLibraryImg },
  { title: 'Science Laboratories', subtitle: 'Phenolic Resin Benches & Utility Sinks', tag: 'Lab Series', handle: 'science-lab', image: scienceLabImg },
  { title: 'Computer Laboratories', subtitle: 'Cable-Managed Pods & Teacher Stations', tag: 'Digital Lab', handle: 'computer-lab', image: scienceLabImg },
  { title: 'Art Laboratories', subtitle: 'Easel Stations, Drying Racks & Sinks', tag: 'Creative Studio', handle: 'art-lab', image: schoolLibraryImg },
  { title: 'STEM Learning', subtitle: 'Robotics Islands & Tinkering Benches', tag: 'Innovation', handle: 'stem-lab', image: scienceLabImg },
  { title: 'Outdoor Play Equipment', subtitle: 'Multi-Play Towers, Swings & Parks', tag: 'Playground', handle: 'outdoor-fun-equipment', image: outdoorPlayImg },
  { title: 'School Flooring', subtitle: 'EPDM Safety Mats & Sports Surfaces', tag: 'Surfacing', handle: 'flooring', image: outdoorPlayImg },
];

// Preview sample items demonstrating how Shopify's dynamic Liquid templates render both purchasable and quote-only catalog products
export const PREVIEW_PRODUCTS: (StoreProduct & {
  tabs: ('best-sellers' | 'new-arrivals' | 'featured')[];
})[] = [
  {
    id: 'sd-1',
    handle: 'ergonomic-birch-student-desk',
    title: 'Ergonomic Birch & Steel Student Desk Set',
    category: 'School Furniture',
    collectionHandle: 'senior',
    tabs: ['best-sellers', 'new-arrivals'],
    price: 9450,
    compareAtPrice: 10800,
    available: true,
    quoteOnly: false,
    isCutout: true,
    images: [cutoutStudentDeskImg, ergonomicDeskImg, heroClassroomImg],
    variants: ['Primary (Grades 1–4)', 'Middle (Grades 5–8)', 'Senior (Grades 9–12)'],
    description: 'Posture-supportive single-seater student desk and molded birch chair with under-desk wire book basket and powder-coated charcoal steel legs.',
    dimensions: '600 mm W × 450 mm D × 720 mm H',
    materials: 'Molded European Birch Plywood, 1.6mm Powder-Coated Steel Frame',
    features: ['Rounded waterfall front edge for comfort', 'Integrated wire book rack', 'Non-marking floor levelers'],
  },
  {
    id: 'sd-2',
    handle: 'curved-montessori-classroom-shelving',
    title: 'Curved Montessori Birch Activity Unit',
    category: 'Kindergarten Furniture',
    collectionHandle: 'kindergarten-furniture',
    tabs: ['best-sellers', 'featured'],
    price: 16800,
    available: true,
    quoteOnly: false,
    isCutout: true,
    images: [cutoutMontessoriShelfImg, heroPreschoolImg],
    variants: ['Natural Birch', 'Birch + Sage Green Trim'],
    description: 'Low, child-accessible open display shelving crafted for Montessori classrooms and early-years reading zones.',
    dimensions: '1400 mm W × 380 mm D × 780 mm H',
    materials: 'Zero-VOC Lacquered Birch Plywood',
    features: ['Smooth 20mm radius safety corners', 'Tip-resistant wide base', 'Modular connecting back panels'],
  },
  {
    id: 'sd-3',
    handle: 'soft-rainbow-climber-play-zone',
    title: 'Soft Play Modular Corner & Climber Set',
    category: 'Active Play',
    collectionHandle: 'soft-play-zones',
    tabs: ['best-sellers', 'new-arrivals'],
    price: 24500,
    compareAtPrice: 27900,
    available: true,
    quoteOnly: false,
    isCutout: true,
    images: [cutoutSoftPlayClimberImg, heroPreschoolImg, schoolLibraryImg],
    variants: ['Pastel Earth Palette', 'Forest & Sand Palette'],
    description: 'High-density foam soft-play steps, ramp, and cushioned reading mat upholstered in wipe-clean, phthalate-free antimicrobial vinyl.',
    dimensions: '2400 mm × 1800 mm Modular Footprint',
    materials: 'High-Resilience PU Foam, Wipe-Clean Medical-Grade PVC-Free Vinyl',
    features: ['Hook-and-loop anti-slip base connectors', 'Concealed child-safe zippers', 'Supports gross motor skill development'],
  },
  {
    id: 'sd-4',
    handle: 'modular-science-lab-island',
    title: 'Composite Chemistry & STEM Island Workbench',
    category: 'Laboratory',
    collectionHandle: 'science-lab',
    tabs: ['new-arrivals', 'featured'],
    price: 0,
    available: true,
    quoteOnly: true,
    isCutout: true,
    images: [cutoutScienceLabBenchImg, scienceLabImg, heroClassroomImg],
    variants: ['4-Student Island', '6-Student Island', 'Custom Room Layout'],
    description: 'Chemical-resistant epoxy resin island bench engineered with integrated utility sinks, gas/electrical turrets, and lockable under-bench cabinetry.',
    dimensions: '2400 mm × 1200 mm × 900 mm H (Customizable)',
    materials: '19mm Solid Phenolic / Epoxy Resin Top, Marine-Grade Laminate Cabinetry',
    features: ['Acid and heat resistant worktop', 'Concealed plumbing & electrical service chase', 'Includes ergonomic lab stools option'],
  },
  {
    id: 'sd-5',
    handle: 'outdoor-timber-multi-play-station',
    title: 'Architectural Timber & Steel Multi-Play Climber',
    category: 'Outdoor',
    collectionHandle: 'outdoor-fun-equipment',
    tabs: ['featured'],
    price: 0,
    available: true,
    quoteOnly: true,
    images: [outdoorPlayImg, heroPreschoolImg],
    variants: ['Primary Campus Model', 'Senior Adventure Model'],
    description: 'Multi-deck outdoor play tower featuring dual slides, rope bridge, climbing wall and weather-treated timber posts with UV-stabilized LLDPE chutes.',
    dimensions: '7200 mm × 5400 mm Safe Fall Zone',
    materials: 'Galvanized Powder-Coated Steel, Treated Hardwood, UV-Stabilized LLDPE',
    features: ['Anti-skid platform decks', 'Stainless steel hardware', 'Optional EPDM safety flooring installation'],
  },
  {
    id: 'sd-6',
    handle: 'acoustic-library-tiered-seating',
    title: 'Curved Library Shelving & Reading Step System',
    category: 'School Furniture',
    collectionHandle: 'library',
    tabs: ['new-arrivals'],
    price: 0,
    available: true,
    quoteOnly: true,
    images: [schoolLibraryImg, heroClassroomImg],
    variants: ['Turnkey Library Package'],
    description: 'Custom-configured curved oak-finish double-sided bookcases paired with tiered amphitheater reading steps for collaborative learning commons.',
    dimensions: 'Site-Measured Custom Configuration',
    materials: '25mm E1-Grade Engineered Oak Board, Acoustic Felt Cushions',
    features: ['Integrated bookend channels', 'Soft-close drawer bases', 'Turnkey 2D/3D layout planning'],
  },
  {
    id: 'sd-7',
    handle: 'sensory-interactive-wall-panel-set',
    title: 'Interactive Wall Panel & Sensory Trio',
    category: 'Active Play',
    collectionHandle: 'interactive-wall-panels',
    tabs: ['best-sellers'],
    price: 12900,
    available: true,
    quoteOnly: false,
    images: [heroPreschoolImg, ergonomicDeskImg],
    variants: ['Forest Trail Theme', 'STEM Gear Theme'],
    description: 'Wall-mounted tactile, gear and fine-motor coordination panels freeing floor space in preschool classrooms, corridors and sensory rooms.',
    dimensions: '1800 mm W × 650 mm H (3 Panels)',
    materials: 'Solid Beechwood Tracks, MDF Backing, Non-Toxic Water-Based Paints',
    features: ['Zero loose parts', 'Concealed wall-mount cleats', 'Ideal for corridors and waiting areas'],
  },
  {
    id: 'sd-8',
    handle: 'squash-court-multi-sport-flooring',
    title: 'Cushioned Sports & Squash Court Flooring',
    category: 'Flooring',
    collectionHandle: 'flooring',
    tabs: ['featured'],
    price: 0,
    available: true,
    quoteOnly: true,
    images: [outdoorPlayImg, schoolLibraryImg],
    variants: ['Indoor Maple / PU Court', 'Outdoor EPDM Safety Surface'],
    description: 'Shock-absorbing indoor sports, squash court, and outdoor EPDM playground surfacing engineered for traction, fall protection and low maintenance.',
    dimensions: 'Quoted per Sq. Ft.',
    materials: 'Kiln-Dried Maple / High-Density EPDM Granules / Multi-Layer PU',
    features: ['Slip-resistant top coat', 'Seamless joint installation', 'Custom court line marking'],
  },
];

export const THEME_FILE_TREE = [
  { folder: 'layout/', files: ['theme.liquid'] },
  { folder: 'config/', files: ['settings_schema.json', 'settings_data.json'] },
  { folder: 'locales/', files: ['en.default.json', 'en.default.schema.json'] },
  {
    folder: 'assets/',
    files: [
      'theme.css',
      'theme.js',
      'school-decor-logo.png',
      'sd-hero-classroom.jpg',
      'sd-hero-preschool.jpg',
      'sd-science-lab.jpg',
      'sd-outdoor-play.jpg',
      'sd-school-library.jpg',
      'sd-ergonomic-desk.jpg',
      'sd-cutout-student-desk.png',
      'sd-cutout-hero-desk.png',
      'sd-cutout-hero-chair.png',
      'sd-cutout-montessori-shelf.png',
      'sd-cutout-soft-play-climber.png',
      'sd-cutout-science-lab-bench.png',
    ],
  },
  {
    folder: 'sections/',
    files: [
      'announcement-bar.liquid',
      'header.liquid',
      'hero-slider.liquid',
      'trust-highlights.liquid',
      'kinetic-marquee.liquid',
      'cutout-showcase.liquid',
      'collections-showcase.liquid',
      'featured-products.liquid',
      'wing-packages.liquid',
      'about-split.liquid',
      'process-accordion.liquid',
      'category-editorial.liquid',
      'environment-gallery.liquid',
      'why-choose-us.liquid',
      'featured-projects.liquid',
      'testimonials-slider.liquid',
      'brands-showcase.liquid',
      'campus-map.liquid',
      'cta-banner.liquid',
      'footer.liquid',
      'main-collection.liquid',
      'main-list-collections.liquid',
      'main-product.liquid',
      'main-cart.liquid',
      'main-search.liquid',
      'main-page.liquid',
      'page-about.liquid',
      'page-contact.liquid',
      'page-projects.liquid',
      'page-project-detail.liquid',
      'page-faq.liquid',
      'page-policy.liquid',
      'request-quote-section.liquid',
      'main-blog.liquid',
      'main-article.liquid',
      'main-404.liquid',
    ],
  },
  {
    folder: 'snippets/',
    files: [
      'icon.liquid',
      'meta-tags.liquid',
      'breadcrumbs.liquid',
      'entry-logo-overlay.liquid',
      'product-card.liquid',
      'cart-drawer.liquid',
      'quick-view-modal.liquid',
      'quote-modal.liquid',
      'whatsapp-button.liquid',
    ],
  },
  {
    folder: 'templates/',
    files: [
      'index.json',
      'product.json',
      'collection.json',
      'list-collections.json',
      'cart.json',
      'search.json',
      'blog.json',
      'article.json',
      '404.json',
      'page.json',
      'page.about-us.json',
      'page.contact.json',
      'page.projects.json',
      'page.project-detail.json',
      'page.faq.json',
      'page.request-quote.json',
      'page.privacy-policy.json',
      'page.terms-and-conditions.json',
      'page.shipping-returns.json',
      'customers/login.liquid',
      'customers/register.liquid',
      'customers/account.liquid',
    ],
  },
];
