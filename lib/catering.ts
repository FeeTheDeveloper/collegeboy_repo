import { business, shown } from '@/lib/content/business';

// The destination is fixed to College Boy's supplied address. A verified
// College Boy sender and explicit inbox confirmation are required to enable it.
export const cateringEmail = shown(business.cateringEmail);
export const cateringFormReady = Boolean(
  cateringEmail && business.cateringInboxMonitored &&
  process.env.RESEND_API_KEY?.trim() && process.env.CATERING_FROM_EMAIL?.trim()
);

export type CateringInquiry = {
  name: string; phone: string; email: string; location: string;
  date: string; startTime: string; endTime: string; guestCount: string; details: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function validDate(value: string) {
  if (!datePattern.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateCateringInquiry(data: CateringInquiry) {
  const errors: Partial<Record<keyof CateringInquiry, string>> = {};
  if (!data.name || data.name.length > 120) errors.name = 'Enter your name.';
  if (!data.phone || data.phone.length > 40 || data.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number.';
  if (!emailPattern.test(data.email) || data.email.length > 254) errors.email = 'Enter a valid email address.';
  if (!data.location || data.location.length > 200) errors.location = 'Enter the event location.';
  if (!validDate(data.date)) errors.date = 'Enter an event date.';
  if (!timePattern.test(data.startTime)) errors.startTime = 'Enter a start time.';
  if (!timePattern.test(data.endTime)) errors.endTime = 'Enter an end time.';
  if (!/^\d{1,5}$/.test(data.guestCount) || Number(data.guestCount) < 1) errors.guestCount = 'Enter an estimated guest count.';
  if (data.details.length > 2000) errors.details = 'Keep details under 2,000 characters.';
  return errors;
}
