import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  calculateCartSubtotal,
  validateQuoteForm,
  filterAndSortProducts,
  type StoreProduct,
} from './storefrontHelpers';

const SAMPLE: StoreProduct[] = [
  {
    id: 'p1',
    handle: 'ergonomic-desk',
    title: 'Birch & Steel Student Desk',
    category: 'School Furniture',
    collectionHandle: 'senior',
    price: 8900,
    available: true,
    quoteOnly: false,
    images: [],
    variants: ['Standard'],
    description: 'Ergonomic desk',
    dimensions: '600x450mm',
    materials: 'Birch',
    features: [],
  },
  {
    id: 'p2',
    handle: 'chemistry-island',
    title: 'Modular Science Lab Island',
    category: 'Laboratory',
    collectionHandle: 'science-lab',
    price: 0,
    available: true,
    quoteOnly: true,
    images: [],
    variants: ['Custom'],
    description: 'Lab island',
    dimensions: '2400x1200mm',
    materials: 'Epoxy',
    features: [],
  },
];

test('buildWhatsAppUrl encodes product name and URL cleanly', () => {
  const url = buildWhatsAppUrl('+91 98110-12345', 'Birch Desk', 'https://www.schooldecor.in/products/birch-desk');
  assert.ok(url.startsWith('https://wa.me/919811012345?text='));
  assert.ok(decodeURIComponent(url).includes('Birch Desk'));
  assert.ok(decodeURIComponent(url).includes('https://www.schooldecor.in/products/birch-desk'));
});

test('calculateCartSubtotal sums line items accurately', () => {
  const total = calculateCartSubtotal([
    { productId: 'p1', title: 'Desk', variant: 'Std', price: 8900, quantity: 3, image: '' },
    { productId: 'p2', title: 'Chair', variant: 'Std', price: 3200, quantity: 2, image: '' },
  ]);
  assert.equal(total, 33100);
});

test('validateQuoteForm rejects incomplete fields and accepts complete valid data', () => {
  const bad = validateQuoteForm({
    name: '',
    phone: '123',
    email: 'invalid',
    institution: '',
    productName: '',
    quantity: '',
    location: '',
    requirements: '',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.length >= 4);

  const ok = validateQuoteForm({
    name: 'Ananya Sharma',
    phone: '+91 9811012345',
    email: 'principal@greenwood.edu.in',
    institution: 'Greenwood Public School',
    productName: 'Kindergarten Desks',
    quantity: '45',
    location: 'Bengaluru, Karnataka',
    requirements: 'Need 45 toddler desks and shelving for 3 classrooms.',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, []);
});

test('filterAndSortProducts filters by collection, mode, and sorts by price', () => {
  const onlyQuote = filterAndSortProducts(SAMPLE, { quoteOnlyFilter: 'quote' });
  assert.equal(onlyQuote.length, 1);
  assert.equal(onlyQuote[0].handle, 'chemistry-island');

  const sorted = filterAndSortProducts(SAMPLE, { sortBy: 'price-desc' });
  assert.equal(sorted[0].handle, 'ergonomic-desk');
});
