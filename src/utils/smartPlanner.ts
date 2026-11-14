export type WingTypeId =
  | 'preschool'
  | 'montessori'
  | 'primary'
  | 'senior'
  | 'stem-lab'
  | 'active-play';

export type FinishPaletteId =
  | 'birch-emerald'
  | 'maple-rose'
  | 'sunlit-gold'
  | 'lab-slate';

export type FlowRating = 'Spacious Flow' | 'Balanced Layout' | 'Compact Fit';

export interface FinishPaletteSpec {
  id: FinishPaletteId;
  name: string;
  woodTone: string;
  accentHex: string;
  accentDarkHex: string;
  surfaceTint: string;
  stageGlow: string;
  borderTint: string;
}

export interface ErgoGradePreset {
  id: string;
  label: string;
  ageRange: string;
  deskHeightMm: number;
  seatHeightMm: number;
  cornerRadius: string;
  collectionHandle: string;
}

export interface PlannerInput {
  wingType: WingTypeId;
  lengthFt: number;
  widthFt: number;
  studentCount: number;
  finishPalette: FinishPaletteId;
}

export interface PlannerBoqItem {
  productHandle: string;
  title: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  quoteOnly: boolean;
  roleLabel: string;
}

export interface CampusPlanResult {
  wingType: WingTypeId;
  wingLabel: string;
  lengthFt: number;
  widthFt: number;
  studentCount: number;
  areaSqFt: number;
  sqFtPerStudent: number;
  flowRating: FlowRating;
  maxSafeCapacity: number;
  recommendedAisleMm: number;
  visualModulesCount: number;
  ergonomicSpec: {
    ageLabel: string;
    deskHeightMm: number;
    seatHeightMm: number;
    cornerRadius: string;
  };
  palette: FinishPaletteSpec;
  items: PlannerBoqItem[];
  estimatedSubtotal: number;
  hasCustomQuoteItems: boolean;
  whatsappSummary: string;
}

export const FINISH_PALETTES: FinishPaletteSpec[] = [
  {
    id: 'birch-emerald',
    name: 'European Birch + Emerald',
    woodTone: 'FSC Natural Birch Veneer',
    accentHex: '#007B36',
    accentDarkHex: '#005D28',
    surfaceTint: '#FAF3EB',
    stageGlow: '#F2E7D8',
    borderTint: '#DFD2BE',
  },
  {
    id: 'maple-rose',
    name: 'Warm Maple + Rose Quartz',
    woodTone: 'Soft Matte Maple Laminate',
    accentHex: '#C22768',
    accentDarkHex: '#9A1D51',
    surfaceTint: '#FDF2F7',
    stageGlow: '#FCE3EE',
    borderTint: '#F4C5D8',
  },
  {
    id: 'sunlit-gold',
    name: 'Sunlit Birch + Ochre Gold',
    woodTone: 'Clear Zero-VOC Birch',
    accentHex: '#9A7200',
    accentDarkHex: '#7A5900',
    surfaceTint: '#FFF9E3',
    stageGlow: '#FFF0BF',
    borderTint: '#EED67E',
  },
  {
    id: 'lab-slate',
    name: 'Slate Ash + Studio Graphite',
    woodTone: 'Ash Grey Phenolic Trim',
    accentHex: '#2C4251',
    accentDarkHex: '#1C2C37',
    surfaceTint: '#EEF3F7',
    stageGlow: '#DCE7F0',
    borderTint: '#C2D2DE',
  },
];

export const ERGO_GRADE_PRESETS: ErgoGradePreset[] = [
  {
    id: 'nursery',
    label: 'Nursery',
    ageRange: 'Ages 2–4 Yrs',
    deskHeightMm: 460,
    seatHeightMm: 260,
    cornerRadius: 'R20 Soft Radius',
    collectionHandle: 'day-care',
  },
  {
    id: 'kg',
    label: 'Kindergarten',
    ageRange: 'Ages 4–6 Yrs',
    deskHeightMm: 520,
    seatHeightMm: 300,
    cornerRadius: 'R20 Soft Radius',
    collectionHandle: 'kindergarten-furniture',
  },
  {
    id: 'primary',
    label: 'Grades 1–3',
    ageRange: 'Ages 6–9 Yrs',
    deskHeightMm: 580,
    seatHeightMm: 340,
    cornerRadius: 'R16 Chamfer',
    collectionHandle: 'senior',
  },
  {
    id: 'middle',
    label: 'Grades 4–7',
    ageRange: 'Ages 9–13 Yrs',
    deskHeightMm: 660,
    seatHeightMm: 390,
    cornerRadius: 'R16 Chamfer',
    collectionHandle: 'senior',
  },
  {
    id: 'senior',
    label: 'Grades 8–12',
    ageRange: 'Ages 13–18 Yrs',
    deskHeightMm: 740,
    seatHeightMm: 440,
    cornerRadius: 'R12 Edge',
    collectionHandle: 'senior',
  },
];

export const WING_PRESETS: Record<
  WingTypeId,
  {
    label: string;
    shortLabel: string;
    defaultLength: number;
    defaultWidth: number;
    defaultStudents: number;
    spaciousMinSqFt: number;
    balancedMinSqFt: number;
    ergoId: string;
    aisleMm: number;
  }
> = {
  preschool: {
    label: 'Preschool & Nursery Room',
    shortLabel: 'Preschool',
    defaultLength: 24,
    defaultWidth: 20,
    defaultStudents: 18,
    spaciousMinSqFt: 26,
    balancedMinSqFt: 18,
    ergoId: 'nursery',
    aisleMm: 1100,
  },
  montessori: {
    label: 'Montessori Activity Wing',
    shortLabel: 'Montessori',
    defaultLength: 28,
    defaultWidth: 22,
    defaultStudents: 22,
    spaciousMinSqFt: 28,
    balancedMinSqFt: 20,
    ergoId: 'kg',
    aisleMm: 1200,
  },
  primary: {
    label: 'Primary Classroom (Grades 1–5)',
    shortLabel: 'Primary K–5',
    defaultLength: 28,
    defaultWidth: 24,
    defaultStudents: 28,
    spaciousMinSqFt: 22,
    balancedMinSqFt: 15,
    ergoId: 'primary',
    aisleMm: 950,
  },
  senior: {
    label: 'Senior Classroom (Grades 6–12)',
    shortLabel: 'Senior 6–12',
    defaultLength: 30,
    defaultWidth: 24,
    defaultStudents: 32,
    spaciousMinSqFt: 22,
    balancedMinSqFt: 15,
    ergoId: 'senior',
    aisleMm: 900,
  },
  'stem-lab': {
    label: 'Science & STEM Laboratory',
    shortLabel: 'STEM Lab',
    defaultLength: 36,
    defaultWidth: 26,
    defaultStudents: 24,
    spaciousMinSqFt: 34,
    balancedMinSqFt: 24,
    ergoId: 'senior',
    aisleMm: 1350,
  },
  'active-play': {
    label: 'Indoor Soft-Play & Sensory Zone',
    shortLabel: 'Active Play',
    defaultLength: 30,
    defaultWidth: 22,
    defaultStudents: 16,
    spaciousMinSqFt: 36,
    balancedMinSqFt: 25,
    ergoId: 'nursery',
    aisleMm: 1400,
  },
};

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function getFinishPalette(id: FinishPaletteId): FinishPaletteSpec {
  return FINISH_PALETTES.find((p) => p.id === id) || FINISH_PALETTES[0];
}

export function calculateCampusPlan(input: PlannerInput): CampusPlanResult {
  const wing = WING_PRESETS[input.wingType] || WING_PRESETS.primary;
  const lengthFt = clamp(input.lengthFt, 14, 48);
  const widthFt = clamp(input.widthFt, 12, 40);
  const studentCount = clamp(input.studentCount, 8, 45);
  const palette = getFinishPalette(input.finishPalette);
  const ergo = ERGO_GRADE_PRESETS.find((e) => e.id === wing.ergoId) || ERGO_GRADE_PRESETS[2];

  const areaSqFt = lengthFt * widthFt;
  const sqFtPerStudent = Number((areaSqFt / studentCount).toFixed(1));
  const maxSafeCapacity = Math.max(8, Math.floor(areaSqFt / wing.balancedMinSqFt));

  let flowRating: FlowRating = 'Compact Fit';
  if (sqFtPerStudent >= wing.spaciousMinSqFt) {
    flowRating = 'Spacious Flow';
  } else if (sqFtPerStudent >= wing.balancedMinSqFt) {
    flowRating = 'Balanced Layout';
  }

  const items: PlannerBoqItem[] = [];

  if (input.wingType === 'preschool') {
    const shelfQty = Math.max(2, Math.ceil(studentCount / 7));
    const wallPanelQty = Math.max(1, Math.floor(lengthFt / 14));
    const playSets = areaSqFt >= 460 ? 1 : 0;
    items.push({
      productHandle: 'curved-montessori-classroom-shelving',
      title: 'Curved Montessori Birch Activity Unit',
      qty: shelfQty,
      unitPrice: 16800,
      lineTotal: shelfQty * 16800,
      quoteOnly: false,
      roleLabel: 'Learning Bays & Toy Storage',
    });
    items.push({
      productHandle: 'sensory-interactive-wall-panel-set',
      title: 'Interactive Wall Panel & Sensory Trio',
      qty: wallPanelQty,
      unitPrice: 12900,
      lineTotal: wallPanelQty * 12900,
      quoteOnly: false,
      roleLabel: 'Fine-Motor Wall Stations',
    });
    if (playSets > 0) {
      items.push({
        productHandle: 'soft-rainbow-climber-play-zone',
        title: 'Soft Play Modular Corner & Climber Set',
        qty: playSets,
        unitPrice: 24500,
        lineTotal: playSets * 24500,
        quoteOnly: false,
        roleLabel: 'Motor Discovery Corner',
      });
    }
  } else if (input.wingType === 'montessori') {
    const shelfQty = Math.max(3, Math.ceil(studentCount / 5));
    const wallPanelQty = Math.max(1, Math.ceil(studentCount / 14));
    items.push({
      productHandle: 'curved-montessori-classroom-shelving',
      title: 'Curved Montessori Birch Activity Unit',
      qty: shelfQty,
      unitPrice: 16800,
      lineTotal: shelfQty * 16800,
      quoteOnly: false,
      roleLabel: 'Open Apparatus Displays',
    });
    items.push({
      productHandle: 'sensory-interactive-wall-panel-set',
      title: 'Interactive Wall Panel & Sensory Trio',
      qty: wallPanelQty,
      unitPrice: 12900,
      lineTotal: wallPanelQty * 12900,
      quoteOnly: false,
      roleLabel: 'Tactile & Sensory Bays',
    });
    items.push({
      productHandle: 'acoustic-library-tiered-seating',
      title: 'Curved Library Shelving & Reading Step System',
      qty: 1,
      unitPrice: 0,
      lineTotal: 0,
      quoteOnly: true,
      roleLabel: 'Circle Time Reading Hub',
    });
  } else if (input.wingType === 'primary' || input.wingType === 'senior') {
    const deskSets = studentCount;
    const shelfQty = Math.max(1, Math.ceil(studentCount / 15));
    items.push({
      productHandle: 'ergonomic-birch-student-desk',
      title: 'Ergonomic Birch & Steel Student Desk Set',
      qty: deskSets,
      unitPrice: 9450,
      lineTotal: deskSets * 9450,
      quoteOnly: false,
      roleLabel: 'Single-Seater Desk & Chair Pairs',
    });
    items.push({
      productHandle: 'curved-montessori-classroom-shelving',
      title: 'Curved Montessori Birch Activity Unit',
      qty: shelfQty,
      unitPrice: 16800,
      lineTotal: shelfQty * 16800,
      quoteOnly: false,
      roleLabel: 'Perimeter Book & Resource Units',
    });
  } else if (input.wingType === 'stem-lab') {
    const islands = Math.max(2, Math.ceil(studentCount / 6));
    const storageUnits = Math.max(2, Math.ceil(islands / 2));
    items.push({
      productHandle: 'modular-science-lab-island',
      title: 'Composite Chemistry & STEM Island Workbench',
      qty: islands,
      unitPrice: 0,
      lineTotal: 0,
      quoteOnly: true,
      roleLabel: '6-Student Wet/Dry Island Workstations',
    });
    items.push({
      productHandle: 'curved-montessori-classroom-shelving',
      title: 'Curved Montessori Birch Activity Unit',
      qty: storageUnits,
      unitPrice: 16800,
      lineTotal: storageUnits * 16800,
      quoteOnly: false,
      roleLabel: 'Instrument & STEM Kit Bays',
    });
  } else {
    // active-play
    const climberQty = Math.max(1, Math.ceil(studentCount / 10));
    const wallPanels = Math.max(2, Math.ceil(lengthFt / 12));
    items.push({
      productHandle: 'soft-rainbow-climber-play-zone',
      title: 'Soft Play Modular Corner & Climber Set',
      qty: climberQty,
      unitPrice: 24500,
      lineTotal: climberQty * 24500,
      quoteOnly: false,
      roleLabel: 'Padded Gross-Motor Climbers',
    });
    items.push({
      productHandle: 'sensory-interactive-wall-panel-set',
      title: 'Interactive Wall Panel & Sensory Trio',
      qty: wallPanels,
      unitPrice: 12900,
      lineTotal: wallPanels * 12900,
      quoteOnly: false,
      roleLabel: 'Tactile Wall Circuit',
    });
    items.push({
      productHandle: 'squash-court-multi-sport-flooring',
      title: 'Cushioned Sports & Squash Court Flooring',
      qty: 1,
      unitPrice: 0,
      lineTotal: 0,
      quoteOnly: true,
      roleLabel: `${areaSqFt} sq.ft Impact-Safe Floor Matting`,
    });
  }

  const estimatedSubtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const hasCustomQuoteItems = items.some((i) => i.quoteOnly);

  const visualModulesCount =
    input.wingType === 'stem-lab'
      ? Math.max(2, Math.min(8, Math.ceil(studentCount / 6)))
      : input.wingType === 'active-play'
        ? Math.max(3, Math.min(10, Math.ceil(studentCount / 3)))
        : Math.min(36, studentCount);

  const boqLines = items
    .map(
      (i) =>
        `• ${i.qty}× ${i.title}${i.quoteOnly ? ' (Custom Quote)' : ` (₹${i.lineTotal.toLocaleString('en-IN')})`}`
    )
    .join('\n');

  const whatsappSummary = [
    `School Decor Smart Campus Brief`,
    `Wing: ${wing.label}`,
    `Dimensions: ${lengthFt} ft × ${widthFt} ft (${areaSqFt} sq.ft) · ${studentCount} Students`,
    `Spatial Rating: ${flowRating} (${sqFtPerStudent} sq.ft/student)`,
    `Finish Palette: ${palette.name}`,
    `Ergonomic Spec: Desk ${ergo.deskHeightMm} mm · Seat ${ergo.seatHeightMm} mm`,
    `Recommended Bill of Quantities:`,
    boqLines,
    `Estimated Hardware Total: ₹${estimatedSubtotal.toLocaleString('en-IN')}${hasCustomQuoteItems ? ' + Custom Lab/Flooring Quote' : ''}`,
  ].join('\n');

  return {
    wingType: input.wingType,
    wingLabel: wing.label,
    lengthFt,
    widthFt,
    studentCount,
    areaSqFt,
    sqFtPerStudent,
    flowRating,
    maxSafeCapacity,
    recommendedAisleMm: wing.aisleMm,
    visualModulesCount,
    ergonomicSpec: {
      ageLabel: ergo.ageRange,
      deskHeightMm: ergo.deskHeightMm,
      seatHeightMm: ergo.seatHeightMm,
      cornerRadius: ergo.cornerRadius,
    },
    palette,
    items,
    estimatedSubtotal,
    hasCustomQuoteItems,
    whatsappSummary,
  };
}
