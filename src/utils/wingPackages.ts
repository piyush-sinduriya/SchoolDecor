export type WingPackageId =
  | 'prek-montessori'
  | 'primary-classroom'
  | 'stem-science-lab'
  | 'outdoor-play-court';

export type WingEdition = 'standard-pack' | 'custom-branding';

export interface WingIncludedItem {
  productHandle: string;
  title: string;
  qty: number;
  unitPrice: number;
  quoteOnly: boolean;
  role: string;
}

export interface WingPackageSpec {
  id: WingPackageId;
  shortLabel: string;
  title: string;
  ageGroup: string;
  capacityLabel: string;
  dispatchTimeline: string;
  warrantyLabel: string;
  collectionHandle: string;
  safetyStandard: string;
  accentHex: string;
  summary: string;
  items: WingIncludedItem[];
}

export const WING_PACKAGES: WingPackageSpec[] = [
  {
    id: 'prek-montessori',
    shortLabel: 'Pre-K & Montessori',
    title: 'Early Years & Montessori Wing Kit',
    ageGroup: 'Ages 2–6 Years',
    capacityLabel: '20 Children / Room',
    dispatchTimeline: '12–15 Days Pan-India',
    warrantyLabel: '5-Yr Timber Structural Warranty',
    collectionHandle: 'kindergarten-furniture',
    safetyStandard: 'EN-71 Zero-VOC · R20 Rounded Corners',
    accentHex: '#C22768',
    summary:
      'Complete toddler-height birch shelving, curved Montessori activity stations, and soft-play landing zones configured for immediate nursery launch.',
    items: [
      {
        productHandle: 'curved-montessori-classroom-shelving',
        title: 'Curved Montessori Birch Activity Unit',
        qty: 3,
        unitPrice: 16800,
        quoteOnly: false,
        role: 'Open Montessori Tray Bays',
      },
      {
        productHandle: 'soft-rainbow-climber-play-zone',
        title: 'Modular Soft-Play Foam Climber Set',
        qty: 1,
        unitPrice: 24500,
        quoteOnly: false,
        role: 'Gross-Motor Soft-Play Zone',
      },
    ],
  },
  {
    id: 'primary-classroom',
    shortLabel: 'K–5 Classroom',
    title: 'Modern Primary Classroom Pack',
    ageGroup: 'Grades 1–5 (Ages 6–10)',
    capacityLabel: '30 Students + Teacher',
    dispatchTimeline: '10–14 Days Pan-India',
    warrantyLabel: '7-Yr Frame & Weld Warranty',
    collectionHandle: 'senior',
    safetyStandard: 'BIFMA Posture Grade · R16 Waterfall Edge',
    accentHex: '#007B36',
    summary:
      'Uniform batch of posture-tuned 18mm birchwood desks and contoured chairs paired with side storage trays for bright primary sections.',
    items: [
      {
        productHandle: 'ergonomic-birch-student-desk',
        title: 'Ergonomic Birch & Steel Desk Set',
        qty: 30,
        unitPrice: 9450,
        quoteOnly: false,
        role: 'Student Ergonomic Workstations',
      },
      {
        productHandle: 'curved-montessori-classroom-shelving',
        title: 'Classroom Resource Birch Shelf Unit',
        qty: 2,
        unitPrice: 16800,
        quoteOnly: false,
        role: 'Classroom Book & Bag Storage',
      },
    ],
  },
  {
    id: 'stem-science-lab',
    shortLabel: 'STEM & Science Lab',
    title: 'Composite Science & STEM Lab Suite',
    ageGroup: 'Grades 6–12 & Colleges',
    capacityLabel: '24 Workstations',
    dispatchTimeline: '18–24 Days + Site Anchoring',
    warrantyLabel: '10-Yr Phenolic Chemical Resistance',
    collectionHandle: 'science-lab',
    safetyStandard: 'SEFA Chemical Grade 19mm Phenolic · IP44 Utilities',
    accentHex: '#1F4B6E',
    summary:
      'Turnkey chemistry, physics, and robotics workbench islands with integrated brass water/gas turrets and ventilated glassware bays.',
    items: [
      {
        productHandle: 'modular-science-lab-island',
        title: 'Chemistry & STEM Island Workbench (2400mm)',
        qty: 4,
        unitPrice: 0,
        quoteOnly: true,
        role: '4 × 6-Student Experiment Islands',
      },
      {
        productHandle: 'ergonomic-birch-student-desk',
        title: 'Instructor Demonstration & Lab Seating',
        qty: 6,
        unitPrice: 9450,
        quoteOnly: false,
        role: 'Demo Desk & Lab Stools',
      },
    ],
  },
  {
    id: 'outdoor-play-court',
    shortLabel: 'Outdoor Park & Court',
    title: 'Outdoor Multi-Play & Surfacing Package',
    ageGroup: 'All Campus Wings (3–14 Yrs)',
    capacityLabel: '35+ Simultaneous Children',
    dispatchTimeline: '15–21 Days + Ground Civil Spec',
    warrantyLabel: '8-Yr UV-8 & Rust-Shield Frame',
    collectionHandle: 'outdoor-fun-equipment',
    safetyStandard: 'Hot-Dip Galvanized Steel · Shock EPDM Flooring',
    accentHex: '#B86E00',
    summary:
      'Weather-stabilized multi-play climbing towers with impact-absorbing EPDM safety mats and outdoor campus benches installed pan-India.',
    items: [
      {
        productHandle: 'modular-science-lab-island',
        title: 'Outdoor Multi-Play Slide & Climber System',
        qty: 1,
        unitPrice: 0,
        quoteOnly: true,
        role: 'Primary Playground Structure',
      },
      {
        productHandle: 'soft-rainbow-climber-play-zone',
        title: 'Shock-Attenuating Indoor/Outdoor Play Mat Kit',
        qty: 2,
        unitPrice: 24500,
        quoteOnly: false,
        role: 'Impact Landing Perimeter',
      },
    ],
  },
];

export interface WingPackageEstimate {
  pkg: WingPackageSpec;
  edition: WingEdition;
  editionLabel: string;
  baseShoppableTotal: number;
  bundleDiscountRate: number;
  bundleSavingsAmount: number;
  finalShoppableTotal: number;
  hasCustomQuoteItems: boolean;
  totalUnitCount: number;
  quoteSummaryText: string;
}

export function calculateWingPackageEstimate(
  packageId: WingPackageId,
  edition: WingEdition
): WingPackageEstimate {
  const pkg = WING_PACKAGES.find((p) => p.id === packageId) || WING_PACKAGES[0];
  const baseShoppableTotal = pkg.items.reduce(
    (sum, item) => sum + (item.quoteOnly ? 0 : item.qty * item.unitPrice),
    0
  );
  const totalUnitCount = pkg.items.reduce((sum, item) => sum + item.qty, 0);
  const hasCustomQuoteItems = pkg.items.some((item) => item.quoteOnly);

  // Ready-to-ship standard packs earn 10% turnkey bundle savings; custom RAL/branding earns 6% bundle savings with tailored lead time
  const bundleDiscountRate = edition === 'standard-pack' ? 0.1 : 0.06;
  const bundleSavingsAmount = Math.round(baseShoppableTotal * bundleDiscountRate);
  const finalShoppableTotal = Math.max(0, baseShoppableTotal - bundleSavingsAmount);
  const editionLabel =
    edition === 'standard-pack'
      ? 'Ready-to-Ship Standard Pack (10% Wing Bundle Savings)'
      : 'Custom School Branding & RAL Finishes (6% Institutional Savings)';

  const lines = pkg.items.map((item) =>
    item.quoteOnly
      ? `- ${item.title} × ${item.qty} (${item.role}) [Custom Institutional Quote]`
      : `- ${item.title} × ${item.qty} @ ₹${item.unitPrice.toLocaleString('en-IN')} (${item.role})`
  );

  const quoteSummaryText = [
    `Selected Kit: ${pkg.title} (${pkg.capacityLabel})`,
    `Edition: ${editionLabel}`,
    `Safety Spec: ${pkg.safetyStandard}`,
    `Included Items:`,
    ...lines,
    finalShoppableTotal > 0
      ? `Estimated Bundle Total (Direct Items): ₹${finalShoppableTotal.toLocaleString('en-IN')}`
      : 'Custom Institutional BoQ Required',
  ].join('\n');

  return {
    pkg,
    edition,
    editionLabel,
    baseShoppableTotal,
    bundleDiscountRate,
    bundleSavingsAmount,
    finalShoppableTotal,
    hasCustomQuoteItems,
    totalUnitCount,
    quoteSummaryText,
  };
}

export interface BulkTierQuote {
  tierId: 'single' | 'classroom' | 'campus';
  label: string;
  minQty: number;
  discountRate: number;
  unitPriceAfterDiscount: number;
  batchTotal: number;
  savingsTotal: number;
}

export function calculateBulkTierPricing(
  baseUnitPrice: number,
  quantity: number
): BulkTierQuote {
  const safeQty = Math.max(1, Math.round(Number.isFinite(quantity) ? quantity : 1));
  const safePrice = Math.max(0, Number.isFinite(baseUnitPrice) ? baseUnitPrice : 0);

  let tierId: BulkTierQuote['tierId'] = 'single';
  let label = 'Standard Rate (1–19 Units)';
  let minQty = 1;
  let discountRate = 0;

  if (safeQty >= 50) {
    tierId = 'campus';
    label = 'Full Wing Rate (50+ Units · 14% Off)';
    minQty = 50;
    discountRate = 0.14;
  } else if (safeQty >= 20) {
    tierId = 'classroom';
    label = 'Classroom Pack Rate (20–49 Units · 8% Off)';
    minQty = 20;
    discountRate = 0.08;
  }

  const unitPriceAfterDiscount = Math.round(safePrice * (1 - discountRate));
  const batchTotal = unitPriceAfterDiscount * safeQty;
  const savingsTotal = Math.max(0, safePrice * safeQty - batchTotal);

  return {
    tierId,
    label,
    minQty,
    discountRate,
    unitPriceAfterDiscount,
    batchTotal,
    savingsTotal,
  };
}
