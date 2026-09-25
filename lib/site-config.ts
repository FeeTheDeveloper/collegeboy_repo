const demoOrigin = 'https://cbkforever.com';

function validHttpOrigin(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteOrigin = validHttpOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? demoOrigin;
export const siteUrl = new URL(siteOrigin);

export function isAllowedRequestOrigin(origin: string | null) {
  if (!origin) return true;
  const parsed = validHttpOrigin(origin);
  if (!parsed) return false;
  if (parsed === siteOrigin) return true;
  return process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(parsed);
}
