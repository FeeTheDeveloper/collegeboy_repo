import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { menuCards } from '@/components/menu-showcase';
import { orderOptions, isLive } from '@/lib/order-options';
import { navLinks } from '@/lib/nav-links';
import { business, story, storyApproved } from '@/lib/content/business';

const scene = readFileSync('public/media/illustrations/truck-scene.svg', 'utf8');
const shippedSource = execSync('git ls-files app components lib content public/media/illustrations', { encoding: 'utf8' }).trim().split('\n')
  .filter(file => /\.(tsx?|json|css|svg)$/.test(file)).map(file => [file, readFileSync(file, 'utf8')] as const);

describe('truck scene', () => {
  it('shows exactly two people: an owner-lead woman and a worker', () => {
    const people = [...scene.matchAll(/data-person="([^"]+)"/g)].map(match => match[1]);
    expect(people.sort()).toEqual(['owner', 'worker']);
    expect(scene).toContain('data-people="2"');
    expect(scene).toMatch(/No one else is in the scene/);
  });

  it('is labelled as an illustration and stops animating for reduced motion', () => {
    expect(scene).toMatch(/<title[^>]*>Illustration/);
    expect(scene).toMatch(/prefers-reduced-motion: reduce\)\{\.steam\{animation:none/);
  });

  it('has no prices on its menu board', () => {
    expect(scene).not.toMatch(/\$\s?\d/);
  });
});

describe('food accuracy (Josette)', () => {
  it('no longer ships or references the seeded-roll or cup-lemonade images', () => {
    for (const retired of ['college-boy-menu-chicken-veggie.png', 'college-boy-menu-fries-drinks.png', 'college-boy-menu-cheesesteak.png']) {
      expect(existsSync(`public/media/${retired}`)).toBe(false);
      for (const [file, text] of shippedSource) expect(text.includes(retired), `${file} references ${retired}`).toBe(false);
    }
  });

  it('features a mushroom cheesesteak and bottled lemonade, labelled as illustrations', () => {
    const mushroom = menuCards.find(card => /mushroom/i.test(card.title));
    const lemonade = menuCards.find(card => /lemonade/i.test(card.title));
    expect(mushroom?.kind).toBe('Illustration');
    expect(readFileSync(`public${lemonade!.image}`, 'utf8')).toContain('data-lemonade="bottle"');
    expect(readFileSync(`public${mushroom!.image}`, 'utf8')).toContain('data-roll="plain"');
    expect(menuCards.every(card => card.alt.length > 20)).toBe(true);
  });

  it('uses "cheesesteak" wording and invents no prices', () => {
    const page = readFileSync('app/page.tsx', 'utf8');
    expect(page).toMatch(/Real Philly cheesesteaks/);
    expect(page).not.toMatch(/Philly thing/i);
    for (const [file, text] of shippedSource) if (/\.(tsx|json)$/.test(file)) expect(text, file).not.toMatch(/\$\d+(\.\d{2})?/);
  });

  it('graduation-cap illustration has a blue tassel and 2015', () => {
    const cap = readFileSync('public/media/illustrations/graduation-cap-2015.svg', 'utf8');
    expect(cap).toContain('data-tassel="blue"');
    expect(cap).toContain('>2015<');
  });
});

describe('ordering and contact details', () => {
  it('has no Square pickup route and no Grubhub', () => {
    for (const [file, text] of shippedSource) {
      expect(text, file).not.toMatch(/square\.site/i);
      expect(text, file).not.toMatch(/grubhub\.com/i);
    }
  });

  it('only verified ordering links render as live links', () => {
    expect(orderOptions.map(option => option.id)).toEqual(['uber', 'doordash']);
    for (const option of orderOptions) expect(isLive(option)).toBe(Boolean(option.verifiedAt && option.verifiedBy && option.status === 'verified'));
  });

  it('publishes no phone number, street address or unconfirmed email', () => {
    expect(business.phone.value).toBeNull();
    expect(business.mailingAddress.value).toBeNull();
    for (const [file, text] of shippedSource) {
      expect(text, file).not.toMatch(/tel:|833-?310|JAWN\b/);
      expect(text, file).not.toMatch(/info@collegeboy/i);
    }
  });

  it('exposes the five customer paths', () => {
    expect(navLinks.map(link => link.label)).toEqual(['Find the truck', 'Menu', 'Order', 'Catering', 'Story']);
  });
});

describe('story approval gate', () => {
  it('stays draft-only until the family signs off', () => {
    expect(story.familyApprovedAt).toBeNull();
    expect(storyApproved()).toBe(false);
  });
});
