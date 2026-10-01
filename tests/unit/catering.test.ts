import { describe, expect, it } from 'vitest';
import { validateCateringInquiry, type CateringInquiry } from '@/lib/catering';

const valid: CateringInquiry = {
  name: 'Event organizer', phone: '323-555-0123', email: 'organizer@example.com',
  location: 'Los Angeles, CA', date: '2026-11-12', startTime: '12:00',
  endTime: '14:00', guestCount: '80', details: 'Office lunch',
};

describe('catering inquiry validation', () => {
  it('accepts a complete inquiry', () => expect(validateCateringInquiry(valid)).toEqual({}));
  it('rejects invalid contact and event details', () => {
    const errors = validateCateringInquiry({ ...valid, name: '', phone: '12', email: 'bad', location: '', date: 'tomorrow', startTime: '25:00', endTime: '', guestCount: '0' });
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'endTime', 'guestCount', 'location', 'name', 'phone', 'startTime']);
  });
});
