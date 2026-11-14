import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { auditShopifyTheme } from './themeValidator';

test('Shopify OS 2.0 theme passes full JSON, schema, and required files audit', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  const result = auditShopifyTheme(themeRoot);
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.ok(result.jsonFilesChecked.length >= 20);
  assert.ok(result.schemaSectionsChecked.length >= 20);
});

test('Shopify OS 2.0 theme includes entry logo animation overlay and Theme Editor toggle', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  assert.equal(fs.existsSync(path.join(themeRoot, 'snippets', 'entry-logo-overlay.liquid')), true);
  const layout = fs.readFileSync(path.join(themeRoot, 'layout', 'theme.liquid'), 'utf8');
  assert.match(layout, /entry-logo-overlay/);
  const schema = fs.readFileSync(path.join(themeRoot, 'config', 'settings_schema.json'), 'utf8');
  assert.match(schema, /enable_entry_logo_animation/);
});

test('Shopify OS 2.0 theme includes Cutout Product Showcase section and transparent PNG assets', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'cutout-showcase.liquid')), true);
  const assets = [
    'sd-cutout-student-desk.png',
    'sd-cutout-montessori-shelf.png',
    'sd-cutout-soft-play-climber.png',
    'sd-cutout-science-lab-bench.png',
  ];
  for (const asset of assets) {
    assert.equal(fs.existsSync(path.join(themeRoot, 'assets', asset)), true, `Missing cutout asset ${asset}`);
  }
  const indexJson = fs.readFileSync(path.join(themeRoot, 'templates', 'index.json'), 'utf8');
  assert.match(indexJson, /"cutout_showcase"/);
});

test('Shopify OS 2.0 theme includes kinetic marquee and process accordion sections', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'kinetic-marquee.liquid')), true);
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'process-accordion.liquid')), true);
  const indexJson = fs.readFileSync(path.join(themeRoot, 'templates', 'index.json'), 'utf8');
  assert.match(indexJson, /"kinetic_marquee"/);
  assert.match(indexJson, /"process_accordion"/);
});

test('Shopify OS 2.0 theme includes partner brands showcase and regional campus map sections', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'brands-showcase.liquid')), true);
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'campus-map.liquid')), true);
  const indexJson = fs.readFileSync(path.join(themeRoot, 'templates', 'index.json'), 'utf8');
  assert.match(indexJson, /"brands_showcase"/);
  assert.match(indexJson, /"campus_map"/);
  const contactJson = fs.readFileSync(path.join(themeRoot, 'templates', 'page.contact.json'), 'utf8');
  assert.match(contactJson, /"campus_map"/);
});

test('Shopify OS 2.0 hero slider renders 5 architectural banner slides with existing photography assets', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  const indexObj = JSON.parse(fs.readFileSync(path.join(themeRoot, 'templates', 'index.json'), 'utf8'));
  const hero = indexObj.sections?.hero;
  assert.ok(hero, 'index.json should define hero section');
  assert.equal(hero.block_order.length, 5, 'hero should have 5 banner slides');
  for (const slideKey of hero.block_order) {
    const block = hero.blocks[slideKey];
    assert.ok(block, `Missing block ${slideKey}`);
    const fallbackAsset = block.settings?.image_fallback;
    assert.ok(fallbackAsset, `Missing image_fallback on ${slideKey}`);
    assert.equal(
      fs.existsSync(path.join(themeRoot, 'assets', fallbackAsset)),
      true,
      `Missing banner asset ${fallbackAsset}`
    );
  }
});

test('Shopify OS 2.0 index replaces Smart Campus Planner with Wing Starter Kits and uses warm champagne showcase bg', () => {
  const themeRoot = path.resolve(process.cwd(), 'shopify-theme');
  assert.equal(fs.existsSync(path.join(themeRoot, 'sections', 'wing-packages.liquid')), true);
  const indexObj = JSON.parse(fs.readFileSync(path.join(themeRoot, 'templates', 'index.json'), 'utf8'));
  assert.ok(indexObj.sections?.wing_packages, 'index.json should define wing_packages');
  assert.equal(indexObj.sections?.smart_campus_planner, undefined, 'smart_campus_planner should be removed from index.json');
  assert.ok(indexObj.order.includes('wing_packages'), 'order should include wing_packages');
  assert.equal(indexObj.order.includes('smart_campus_planner'), false, 'order should not include smart_campus_planner');
  assert.equal(indexObj.sections?.cutout_showcase?.settings?.bg_color, '#FAF3EB');
});
