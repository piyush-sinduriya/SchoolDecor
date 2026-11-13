import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp01,
  computeHeroScrollState,
  getHeroScrollRatioForSet,
} from './heroScrollChoreography';

test('clamp01 bounds non-finite and out-of-range values', () => {
  assert.equal(clamp01(-0.5), 0);
  assert.equal(clamp01(1.8), 1);
  assert.equal(clamp01(Number.NaN), 0);
  assert.equal(clamp01(0.42), 0.42);
});

test('Stage 0 starts with Desk left and Chair right separated then converges toward center', () => {
  const start = computeHeroScrollState(0, 4);
  assert.equal(start.activeIndex, 0);
  assert.equal(start.deskTranslateX, -56);
  assert.equal(start.chairTranslateX, 56);
  assert.equal(start.deskRotateDeg, -2.5);
  assert.equal(start.chairRotateDeg, 2.5);

  const mid = computeHeroScrollState(0.14, 4);
  assert.equal(mid.activeIndex, 0);
  assert.ok(mid.deskTranslateX < 0 && mid.deskTranslateX > -5);
  assert.ok(mid.chairTranslateX > 0 && mid.chairTranslateX < 5);
  assert.equal(mid.deskRotateDeg, 0);
  assert.equal(mid.chairRotateDeg, 0);
  assert.ok(mid.splitConvergence > 0.99);
});

test('Progressive scroll transitions smoothly across all 4 furniture sets', () => {
  assert.equal(computeHeroScrollState(0.10, 4).activeIndex, 0);
  assert.equal(computeHeroScrollState(0.32, 4).activeIndex, 1);
  assert.equal(computeHeroScrollState(0.56, 4).activeIndex, 2);
  assert.equal(computeHeroScrollState(0.85, 4).activeIndex, 3);
  assert.equal(computeHeroScrollState(1.0, 4).activeIndex, 3);
});

test('getHeroScrollRatioForSet maps each index back into its corresponding scroll stage', () => {
  for (let i = 0; i < 4; i++) {
    const ratio = getHeroScrollRatioForSet(i, 4);
    const resolved = computeHeroScrollState(ratio, 4);
    assert.equal(resolved.activeIndex, i);
  }
});
