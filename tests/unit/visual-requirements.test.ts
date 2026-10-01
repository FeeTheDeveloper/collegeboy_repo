import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { menuCards } from '@/components/menu-showcase';
import { orderOptions, isLive } from '@/lib/order-options';
import { navLinks } from '@/lib/nav-links';
import { business, story, storyApproved } from '@/lib/content/business';

const shippedSource = execSync('git ls-files app components lib content', { encoding: 'utf8' }).trim().split('\n')
  .filter(file => /\.(tsx?|json|css|svg)$/.test(file) && existsSync(file)).map(file => [file, readFileSync(file, 'utf8')] as const);

describe('food accuracy (Josette)', () => {
  it('no longer ships or references the seeded-roll or cup-lemonade images', () => {
    for (const retired of ['college-boy-menu-chicken-veggie.png', 'college-boy-menu-fries-drinks.png', 'college-boy-menu-cheesesteak.png']) {
      expect(existsSync(`public/media/${retired}`)).toBe(false);
      for (const [file, text] of shippedSource) expect(text.includes(retired), `${file} references ${retired}`).toBe(false);
    }
  });

  it('shows every supplied official item with a real local image and description', () => {
    expect(menuCards.map(card => card.title)).toEqual(['Alumni', 'Bachelor', "Master's", 'Doctorate', 'Hoagie', 'Cheese Fries']);
    for (const card of menuCards) {
      expect(existsSync(`public${card.image}`)).toBe(true);
      expect(card.copy.length).toBeGreaterThan(20);
    }
    expect(menuCards.every(card => card.alt.length > 20)).toBe(true);
  });

  it('uses "cheesesteak" wording and invents no prices', () => {
    const page = readFileSync('app/page.tsx', 'utf8');
    expect(page).toMatch(/Real Philly cheesesteaks/);
    expect(page).not.toMatch(/Philly thing/i);
    for (const [file, text] of shippedSource) if (/\.(tsx|json)$/.test(file)) expect(text, file).not.toMatch(/\$\d+(\.\d{2})?/);
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

  it('labels the original-site office and mobile contacts separately', () => {
    expect(business.officePhone.value).toBe('833-310-5296');
    expect(business.mobilePhone.value).toBe('267-248-8904');
    expect(business.generalEmail.value).toBe('info@collegeboysteaks.com');
    expect(business.serviceArea.value).toBe('Los Angeles, California');
    const footer = readFileSync('components/site-footer.tsx', 'utf8');
    expect(footer).toContain('Office:');
    expect(footer).toContain('Mobile:');
  });

  it('exposes the customer paths and careers', () => {
    expect(navLinks.map(link => link.label)).toEqual(['Home', 'Menu', 'Find the truck', 'Story', 'Catering', 'Careers']);
  });
});

describe('story approval gate', () => {
  it('shows the approved story after the user confirmed approvals', () => {
    expect(story.familyApprovedAt).toBe('2026-09-30');
    expect(story.approvedParagraphs.length).toBeGreaterThan(0);
    expect(storyApproved()).toBe(true);
  });
});
