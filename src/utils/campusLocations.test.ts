import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REGIONAL_CAMPUS_HUBS,
  MATERIAL_BRANDS,
  filterCampusHubs,
  findBrandByCollection,
} from './campusLocations.ts';

test('REGIONAL_CAMPUS_HUBS provides valid Indian campus coordinates and specialties', () => {
  assert.ok(REGIONAL_CAMPUS_HUBS.length >= 5);
  for (const hub of REGIONAL_CAMPUS_HUBS) {
    assert.ok(hub.lat > 8 && hub.lat < 36, `lat out of India range for ${hub.city}`);
    assert.ok(hub.lng > 68 && hub.lng < 97, `lng out of India range for ${hub.city}`);
    assert.ok(hub.specialties.length >= 2);
  }
});

test('filterCampusHubs filters accurately by hub category and city search text', () => {
  const all = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'all', '');
  assert.equal(all.length, REGIONAL_CAMPUS_HUBS.length);

  const studios = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'studio', '');
  assert.ok(studios.every((h) => h.category === 'studio'));
  assert.equal(studios.length, 2);

  const bengaluru = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'all', 'phenolic');
  assert.equal(bengaluru.length, 1);
  assert.equal(bengaluru[0].id, 'bengaluru-south');
});

test('MATERIAL_BRANDS contains unique brands mapped cleanly to storefront collections', () => {
  assert.equal(MATERIAL_BRANDS.length, 6);
  const lab = findBrandByCollection('science-lab');
  assert.ok(lab);
  assert.equal(lab?.name, 'LabGuard Phenolic');
  assert.equal(findBrandByCollection('nonexistent-handle'), undefined);
});
