export type HubCategory = 'studio' | 'stem' | 'dispatch';

export interface CampusHub {
  id: string;
  city: string;
  regionLabel: string;
  title: string;
  category: HubCategory;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
  lat: number;
  lng: number;
  mapQuery?: string;
  googleMapsUrl?: string;
}

export interface MaterialBrand {
  id: string;
  name: string;
  markCode: string;
  standard: string;
  specialty: string;
  accentHex: string;
  surfaceTint: string;
  collectionHandle: string;
}

export const MATERIAL_BRANDS: MaterialBrand[] = [
  {
    id: 'nordic-birch',
    name: 'NordicBirch™ FSC Timber',
    markCode: 'NB-18',
    standard: 'FSC® C128490 · EN-71',
    specialty:
      '18mm multi-ply European birch veneer with R16/R20 child-safe radius chamfers and zero-VOC waterborne PU finish.',
    accentHex: '#007B36',
    surfaceTint: '#EAF7EF',
    collectionHandle: 'kindergarten-furniture',
  },
  {
    id: 'ergo-frame',
    name: 'ErgoFrame™ BIFMA Steel',
    markCode: 'EF-16',
    standard: 'ANSI/BIFMA X6.1',
    specialty:
      '1.6mm cold-rolled tubular steel classroom frames with anti-chip epoxy powder coat and non-marking acoustic glides.',
    accentHex: '#C22768',
    surfaceTint: '#FDF2F7',
    collectionHandle: 'senior',
  },
  {
    id: 'play-foam',
    name: 'SensoryCore™ Soft-Play',
    markCode: 'SC-28',
    standard: 'REACH Phthalate-Free',
    specialty:
      '28-density high-resilience PU foam blocks wrapped in antimicrobial, tear-resistant matte PVC vinyl.',
    accentHex: '#B88900',
    surfaceTint: '#FFF9E5',
    collectionHandle: 'soft-play-zones',
  },
  {
    id: 'chem-shield',
    name: 'ChemShield™ Lab Phenolic',
    markCode: 'CS-19',
    standard: 'SEFA-8M Certified',
    specialty:
      '19mm solid phenolic resin worktops engineered for acid, alkali, reagent, and 180°C thermal shock resistance.',
    accentHex: '#007B36',
    surfaceTint: '#EAF7EF',
    collectionHandle: 'science-lab',
  },
  {
    id: 'dura-play',
    name: 'DuraPlay™ UV-8 Outdoor',
    markCode: 'DP-UV8',
    standard: 'EN-1176 Playground',
    specialty:
      'Hot-dip galvanized steel posts and UV-8 stabilized LLDPE roto-moulded slides built for tropical sun and monsoon cycles.',
    accentHex: '#D91B22',
    surfaceTint: '#FDECEC',
    collectionHandle: 'outdoor-fun-equipment',
  },
  {
    id: 'acousti-floor',
    name: 'AcoustiFloor™ EPDM & Vinyl',
    markCode: 'AF-EN',
    standard: 'EN-1177 Critical Fall',
    specialty:
      'Impact-absorbing EPDM wet-pour safety surfacing and 2mm heterogeneous anti-slip classroom PVC flooring.',
    accentHex: '#C22768',
    surfaceTint: '#FDF2F7',
    collectionHandle: 'flooring',
  },
];

export const REGIONAL_CAMPUS_HUBS: CampusHub[] = [
  {
    id: 'delhi-ncr',
    city: 'Laxmi Nagar, New Delhi',
    regionLabel: 'Registered Head Office & Showroom',
    title: 'School Decor — Head Office & Experience Center (Lalita Park)',
    category: 'studio',
    address:
      'No. 1/26A, 2nd Floor, Lalita Park (Near Gurudwara, Opp. Metro Pillar No. 24, Vikas Marg), Laxmi Nagar, New Delhi - 110092',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 9:30 AM – 7:00 PM',
    specialties: [
      'Montessori & Preschool Sample Studio',
      'K–12 Ergonomic Desk & Chair Display',
      'Direct Institutional Quotations (Mr. Manish Gupta)',
    ],
    lat: 28.6304,
    lng: 77.2773,
    mapQuery: 'School Decor, 1/26A, Lalita Park, Laxmi Nagar, New Delhi, Delhi 110092',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=School+Decor+1%2F26A+Lalita+Park+Laxmi+Nagar+New+Delhi+110092',
  },
  {
    id: 'delhi-factory',
    city: 'School Decor Factory',
    regionLabel: 'Official Manufacturing & Dispatch Unit',
    title: 'School Decor Factory — Production & Institutional Dispatch Hub',
    category: 'dispatch',
    address:
      'School Decor Factory, Manufacturing & Dispatch Unit, New Delhi / Delhi NCR',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 9:00 AM – 6:30 PM',
    specialties: [
      '18mm FSC Birch Ply CNC Joinery',
      'Powder-Coated Steel & Soft-Play Production',
      'Pan-India Institutional Factory Dispatch',
    ],
    lat: 28.6692,
    lng: 77.3154,
    mapQuery: 'School Decor Factory Delhi',
    googleMapsUrl: 'https://share.google/Hae3hZvBg7ArvS5dc',
  },
];

export function filterCampusHubs(
  hubs: CampusHub[],
  category: 'all' | HubCategory,
  searchQuery = ''
): CampusHub[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return hubs.filter((hub) => {
    const matchesCategory = category === 'all' || hub.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      hub.city.toLowerCase().includes(normalizedQuery) ||
      hub.title.toLowerCase().includes(normalizedQuery) ||
      hub.address.toLowerCase().includes(normalizedQuery) ||
      hub.specialties.some((s) => s.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function getCampusHubById(hubs: CampusHub[], id: string): CampusHub {
  return hubs.find((h) => h.id === id) || hubs[0];
}

export function findBrandByCollection(collectionHandle: string): MaterialBrand {
  return (
    MATERIAL_BRANDS.find((b) => b.collectionHandle === collectionHandle) ||
    MATERIAL_BRANDS[0]
  );
}

