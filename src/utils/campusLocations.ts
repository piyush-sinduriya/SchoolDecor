export type HubCategory = 'all' | 'studio' | 'stem' | 'dispatch';

export interface CampusHub {
  id: string;
  city: string;
  regionLabel: string;
  title: string;
  category: Exclude<HubCategory, 'all'>;
  address: string;
  hours: string;
  specialties: string[];
  lat: number;
  lng: number;
}

export interface MaterialBrand {
  id: string;
  name: string;
  markCode: string;
  specialty: string;
  standard: string;
  accentHex: string;
  surfaceTint: string;
  collectionHandle: string;
}

export const REGIONAL_CAMPUS_HUBS: CampusHub[] = [
  {
    id: 'delhi-ncr',
    city: 'New Delhi NCR',
    regionLabel: 'North India HQ & Studio',
    title: 'School Decor Experience Studio & NCR Dispatch',
    category: 'studio',
    address: 'Okhla Industrial Estate Phase III, New Delhi 110020',
    hours: 'Mon–Sat · 9:30 AM – 6:30 PM',
    specialties: ['Ergonomic Classroom Mockups', 'Montessori Birch Bays', 'Bulk School Despatch'],
    lat: 28.5494,
    lng: 77.2722,
  },
  {
    id: 'mumbai-west',
    city: 'Mumbai',
    regionLabel: 'West Zone Showroom',
    title: 'West Zone Preschool & Active Play Studio',
    category: 'studio',
    address: 'Andheri East Institutional Corridor, Mumbai 400093',
    hours: 'Mon–Sat · 10:00 AM – 6:30 PM',
    specialties: ['Soft-Play Foam Trials', 'Sensory Room Wall Panels', 'Turnkey Flooring Samples'],
    lat: 19.1136,
    lng: 72.8697,
  },
  {
    id: 'bengaluru-south',
    city: 'Bengaluru',
    regionLabel: 'South Zone STEM Hub',
    title: 'STEM, Robotics & Sports Court Center',
    category: 'stem',
    address: 'Peenya & Hebbal Innovation Belt, Bengaluru 560058',
    hours: 'Mon–Sat · 9:30 AM – 6:00 PM',
    specialties: ['Phenolic Lab Benches', 'Robotics & TinkerPods', 'Squash & EPDM Surfacing'],
    lat: 13.0285,
    lng: 77.5197,
  },
  {
    id: 'hyderabad-hub',
    city: 'Hyderabad',
    regionLabel: 'Deccan Regional Logistics',
    title: 'Institutional Lab & K-12 Supply Hub',
    category: 'dispatch',
    address: 'Balanagar Educational Warehousing Park, Hyderabad 500037',
    hours: 'Mon–Sat · 9:00 AM – 6:00 PM',
    specialties: ['Composite K-12 Wing Staging', 'Steel Powder-Coat QC', 'South Corridor Delivery'],
    lat: 17.4694,
    lng: 78.4488,
  },
  {
    id: 'jaipur-park',
    city: 'Jaipur',
    regionLabel: 'Outdoor & Play Engineering',
    title: 'Outdoor Multi-Play & Park Assembly Wing',
    category: 'dispatch',
    address: 'Sitapura Industrial Area Phase II, Jaipur 302022',
    hours: 'Mon–Sat · 9:30 AM – 6:00 PM',
    specialties: ['Galvanized Multi-Play Towers', 'UV LLDPE Chutes', 'Open-Air Math & Science Parks'],
    lat: 26.7745,
    lng: 75.8473,
  },
];

export const MATERIAL_BRANDS: MaterialBrand[] = [
  {
    id: 'birchcraft',
    name: 'BirchCraft Europe',
    markCode: 'BC·18',
    specialty: 'FSC-Certified 18mm Beech & Birchwood',
    standard: 'EN-71 Child-Safe Finish',
    accentHex: '#007B36',
    surfaceTint: '#EFF7F2',
    collectionHandle: 'kindergarten-furniture',
  },
  {
    id: 'posturemetric',
    name: 'PostureMetric India',
    markCode: 'PM·K12',
    specialty: 'Height-Graded Classroom Ergonomics',
    standard: 'BIFMA & NCERT Ratios',
    accentHex: '#C22768',
    surfaceTint: '#FDF2F7',
    collectionHandle: 'senior',
  },
  {
    id: 'kiddosafe',
    name: 'KiddoSafe HR',
    markCode: 'KS·28',
    specialty: '28-Density Soft-Play & Sensory Cores',
    standard: 'Phthalate-Free Antimicrobial',
    accentHex: '#B88900',
    surfaceTint: '#FFF9E3',
    collectionHandle: 'soft-play-zones',
  },
  {
    id: 'labguard',
    name: 'LabGuard Phenolic',
    markCode: 'LG·19',
    specialty: '19mm Acid & Thermal-Shock Worktops',
    standard: 'SEFA Chemical Grade',
    accentHex: '#334B5C',
    surfaceTint: '#EEF3F7',
    collectionHandle: 'science-lab',
  },
  {
    id: 'sunshield',
    name: 'SunShield LLDPE',
    markCode: 'SS·UV8',
    specialty: 'Galvanized Steel & Outdoor Play Chutes',
    standard: 'UV-8 Weather Stabilized',
    accentHex: '#D91B22',
    surfaceTint: '#FEF2F2',
    collectionHandle: 'outdoor-fun-equipment',
  },
  {
    id: 'courtgrip',
    name: 'CourtGrip Pro',
    markCode: 'CG·PU',
    specialty: 'Shock-Attenuating EPDM & Court Floors',
    standard: 'EN-14904 Sports Bounce',
    accentHex: '#007B36',
    surfaceTint: '#EFF7F2',
    collectionHandle: 'flooring',
  },
];

export function filterCampusHubs(
  hubs: CampusHub[],
  category: HubCategory,
  searchQuery = ''
): CampusHub[] {
  const q = searchQuery.trim().toLowerCase();
  return hubs.filter((hub) => {
    const matchesCategory = category === 'all' || hub.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    const haystack = `${hub.city} ${hub.regionLabel} ${hub.title} ${hub.address} ${hub.specialties.join(' ')}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function findBrandByCollection(collectionHandle: string): MaterialBrand | undefined {
  return MATERIAL_BRANDS.find((b) => b.collectionHandle === collectionHandle);
}
