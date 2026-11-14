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
    city: 'Delhi NCR (Factory Unit)',
    regionLabel: 'School Decor Factory & Production Works',
    title: 'School Decor Manufacturing Factory & Dispatch Hub',
    category: 'dispatch',
    address:
      'School Decor Manufacturing & Industrial Works, Bawana–Patparganj Industrial Corridor, New Delhi - 110039',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 9:00 AM – 6:30 PM',
    specialties: [
      '18mm FSC Birch Ply CNC Joinery',
      'Powder-Coated Steel & Roto-Moulding',
      'Pan-India Institutional Factory Dispatch',
    ],
    lat: 28.7982,
    lng: 77.0462,
    mapQuery: 'Bawana Industrial Area, New Delhi, Delhi 110039',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Bawana+Industrial+Area+New+Delhi+110039',
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    regionLabel: 'West India Hub',
    title: 'Early-Years & Sensory Architecture Center',
    category: 'studio',
    address: 'Lower Parel Institutional Corridor, Mumbai, Maharashtra 400013',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 10:00 AM – 6:30 PM',
    specialties: ['Soft-Play Foam Systems', 'Library Reading Nooks', 'Bespoke Acoustic Wall Panels'],
    lat: 18.9953,
    lng: 72.8295,
    mapQuery: 'Lower Parel, Mumbai, Maharashtra 400013',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Lower+Parel+Mumbai+Maharashtra+400013',
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    regionLabel: 'South India Hub',
    title: 'STEM, Robotics & Modular Classroom Studio',
    category: 'stem',
    address: 'Indiranagar Institutional Design District, Bengaluru, Karnataka 560038',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 9:30 AM – 6:30 PM',
    specialties: ['Anti-Static Robotics Benches', 'Collaborative Hex Tables', 'Outdoor Play Structures'],
    lat: 12.9784,
    lng: 77.6408,
    mapQuery: 'Indiranagar, Bengaluru, Karnataka 560038',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Indiranagar+Bengaluru+Karnataka+560038',
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    regionLabel: 'Deccan Hub',
    title: 'Turnkey K-12 Campus Logistics & Lounge',
    category: 'stem',
    address: 'Jubilee Hills Road No. 36, Hyderabad, Telangana 500033',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 10:00 AM – 6:00 PM',
    specialties: ['K-12 Ergonomic Seating', 'Cafeteria & Hostel Fit-Outs', 'Custom Color Laminates'],
    lat: 17.4326,
    lng: 78.4071,
    mapQuery: 'Jubilee Hills Road No 36, Hyderabad, Telangana 500033',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Jubilee+Hills+Road+No+36+Hyderabad+500033',
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    regionLabel: 'Timber & Craft Hub',
    title: 'FSC Birch Woodwork & Finishing Facility',
    category: 'dispatch',
    address: 'Sitapura Institutional Craft Zone, Jaipur, Rajasthan 302022',
    phone: '+91 93122 54660',
    hours: 'Mon–Sat · 9:00 AM – 5:30 PM',
    specialties: ['Kiln-Dried Birch Joinery', 'Zero-VOC Water Lacquer Line', 'Bulk Institutional Dispatch'],
    lat: 26.7769,
    lng: 75.8473,
    mapQuery: 'Sitapura Industrial Area, Jaipur, Rajasthan 302022',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Sitapura+Industrial+Area+Jaipur+Rajasthan+302022',
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

