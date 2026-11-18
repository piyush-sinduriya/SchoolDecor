import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  REGIONAL_CAMPUS_HUBS,
  filterCampusHubs,
  getCampusHubById,
} from './campusLocations';

describe('campusLocations utilities', () => {
  it('contains the 2 official School Decor locations: Laxmi Nagar Head Office and School Decor Factory', () => {
    assert.equal(REGIONAL_CAMPUS_HUBS.length, 2);
    assert.equal(REGIONAL_CAMPUS_HUBS[0].id, 'delhi-ncr');
    assert.ok(REGIONAL_CAMPUS_HUBS[0].address.includes('Lalita Park'));
    assert.ok(REGIONAL_CAMPUS_HUBS[0].address.includes('110092'));
    assert.equal(REGIONAL_CAMPUS_HUBS[1].id, 'delhi-factory');
    assert.equal(REGIONAL_CAMPUS_HUBS[1].category, 'dispatch');
    assert.equal(REGIONAL_CAMPUS_HUBS[1].googleMapsUrl, 'https://share.google/Hae3hZvBg7ArvS5dc');

    for (const hub of REGIONAL_CAMPUS_HUBS) {
      assert.ok(hub.lat > 8 && hub.lat < 36, `Invalid lat for ${hub.city}`);
      assert.ok(hub.lng > 68 && hub.lng < 95, `Invalid lng for ${hub.city}`);
      assert.ok(hub.specialties.length >= 2);
      assert.ok(hub.mapQuery && hub.mapQuery.length > 5);
    }
  });

  it('filters hubs by category accurately', () => {
    const studios = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'studio');
    assert.equal(studios.length, 1);
    assert.equal(studios[0].id, 'delhi-ncr');

    const dispatch = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'dispatch');
    assert.equal(dispatch.length, 1);
    assert.equal(dispatch[0].id, 'delhi-factory');
  });

  it('filters hubs by search query across city, address, and specialty', () => {
    const lalitaMatch = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'all', 'Lalita Park');
    assert.equal(lalitaMatch.length, 1);
    assert.equal(lalitaMatch[0].id, 'delhi-ncr');

    const factoryMatch = filterCampusHubs(REGIONAL_CAMPUS_HUBS, 'all', 'Factory');
    assert.equal(factoryMatch.length, 1);
    assert.equal(factoryMatch[0].id, 'delhi-factory');
  });

  it('returns first hub as fallback when id is not found', () => {
    const hub = getCampusHubById(REGIONAL_CAMPUS_HUBS, 'unknown-city');
    assert.equal(hub.id, REGIONAL_CAMPUS_HUBS[0].id);
  });
});
