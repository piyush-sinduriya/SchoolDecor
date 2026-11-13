import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCampusPlan,
  ERGO_GRADE_PRESETS,
  FINISH_PALETTES,
} from './smartPlanner.ts';

test('calculates spacious primary classroom layout and priced BOQ accurately', () => {
  const plan = calculateCampusPlan({
    wingType: 'primary',
    lengthFt: 30,
    widthFt: 25,
    studentCount: 25,
    finishPalette: 'birch-emerald',
  });

  assert.equal(plan.areaSqFt, 750);
  assert.equal(plan.sqFtPerStudent, 30);
  assert.equal(plan.flowRating, 'Spacious Flow');
  assert.equal(plan.hasCustomQuoteItems, false);

  const deskItem = plan.items.find((i) => i.productHandle === 'ergonomic-birch-student-desk');
  assert.ok(deskItem);
  assert.equal(deskItem.qty, 25);
  assert.equal(deskItem.lineTotal, 25 * 9450);

  const shelfItem = plan.items.find(
    (i) => i.productHandle === 'curved-montessori-classroom-shelving'
  );
  assert.ok(shelfItem);
  assert.equal(shelfItem.qty, 2);
  assert.equal(plan.estimatedSubtotal, 25 * 9450 + 2 * 16800);
});

test('flags compact fit and computes STEM lab quote items correctly', () => {
  const plan = calculateCampusPlan({
    wingType: 'stem-lab',
    lengthFt: 20,
    widthFt: 18,
    studentCount: 24,
    finishPalette: 'lab-slate',
  });

  assert.equal(plan.areaSqFt, 360);
  assert.equal(plan.sqFtPerStudent, 15);
  assert.equal(plan.flowRating, 'Compact Fit');
  assert.equal(plan.hasCustomQuoteItems, true);
  assert.equal(plan.palette.id, 'lab-slate');

  const labIsland = plan.items.find((i) => i.productHandle === 'modular-science-lab-island');
  assert.ok(labIsland);
  assert.equal(labIsland.qty, 4);
  assert.equal(labIsland.quoteOnly, true);
});

test('clamps out-of-range dimensions and student counts safely', () => {
  const plan = calculateCampusPlan({
    wingType: 'active-play',
    lengthFt: 5,
    widthFt: 99,
    studentCount: 200,
    finishPalette: 'maple-rose',
  });

  assert.equal(plan.lengthFt, 14);
  assert.equal(plan.widthFt, 40);
  assert.equal(plan.studentCount, 45);
  assert.equal(plan.areaSqFt, 560);
  assert.ok(plan.whatsappSummary.includes('Indoor Soft-Play & Sensory Zone'));
  assert.ok(plan.whatsappSummary.includes('14 ft × 40 ft'));
});

test('ergonomic grade presets and finish palettes stay monotonic and complete', () => {
  assert.equal(FINISH_PALETTES.length, 4);
  assert.equal(ERGO_GRADE_PRESETS.length, 5);
  for (let i = 1; i < ERGO_GRADE_PRESETS.length; i++) {
    assert.ok(ERGO_GRADE_PRESETS[i].deskHeightMm > ERGO_GRADE_PRESETS[i - 1].deskHeightMm);
    assert.ok(ERGO_GRADE_PRESETS[i].seatHeightMm > ERGO_GRADE_PRESETS[i - 1].seatHeightMm);
  }
});
