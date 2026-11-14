import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WING_PACKAGES,
  calculateBulkTierPricing,
  calculateWingPackageEstimate,
} from './wingPackages';

test('WING_PACKAGES provides 4 complete campus starter kits with valid items', () => {
  assert.equal(WING_PACKAGES.length, 4);
  for (const pkg of WING_PACKAGES) {
    assert.ok(pkg.items.length >= 2, `${pkg.id} should include multiple furniture items`);
    assert.ok(pkg.safetyStandard.length > 5);
  }
});

test('calculateWingPackageEstimate computes 10% standard bundle savings accurately', () => {
  const est = calculateWingPackageEstimate('prek-montessori', 'standard-pack');
  // 3 * 16800 + 1 * 24500 = 50400 + 24500 = 74900
  assert.equal(est.baseShoppableTotal, 74900);
  assert.equal(est.bundleDiscountRate, 0.1);
  assert.equal(est.bundleSavingsAmount, 7490);
  assert.equal(est.finalShoppableTotal, 67410);
  assert.equal(est.hasCustomQuoteItems, false);
  assert.match(est.quoteSummaryText, /Curved Montessori Birch Activity Unit/);
});

test('calculateWingPackageEstimate handles quote-only items cleanly in hybrid STEM lab kit', () => {
  const est = calculateWingPackageEstimate('stem-science-lab', 'custom-branding');
  assert.equal(est.hasCustomQuoteItems, true);
  // 6 * 9450 = 56700 -> 6% discount = 3402 -> 53298
  assert.equal(est.baseShoppableTotal, 56700);
  assert.equal(est.bundleSavingsAmount, 3402);
  assert.equal(est.finalShoppableTotal, 53298);
});

test('calculateBulkTierPricing applies single, classroom (8%), and campus (14%) institutional tiers', () => {
  const single = calculateBulkTierPricing(10000, 10);
  assert.equal(single.tierId, 'single');
  assert.equal(single.unitPriceAfterDiscount, 10000);
  assert.equal(single.savingsTotal, 0);

  const classroom = calculateBulkTierPricing(10000, 25);
  assert.equal(classroom.tierId, 'classroom');
  assert.equal(classroom.unitPriceAfterDiscount, 9200);
  assert.equal(classroom.batchTotal, 230000);
  assert.equal(classroom.savingsTotal, 20000);

  const campus = calculateBulkTierPricing(10000, 60);
  assert.equal(campus.tierId, 'campus');
  assert.equal(campus.unitPriceAfterDiscount, 8600);
  assert.equal(campus.batchTotal, 516000);
  assert.equal(campus.savingsTotal, 84000);
});
