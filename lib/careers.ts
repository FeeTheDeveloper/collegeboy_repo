export type CareerRole = 'driver' | 'cook';
export type JobBoard = 'indeed' | 'ziprecruiter';

const boardHosts: Record<JobBoard, string> = {
  indeed: 'indeed.com',
  ziprecruiter: 'ziprecruiter.com',
};

export function verifiedJobUrl(raw: string | undefined, board: JobBoard) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = boardHosts[board];
    return url.protocol === 'https:' && (url.hostname === host || url.hostname.endsWith(`.${host}`))
      ? url.toString() : null;
  } catch { return null; }
}

export const careerBoardLinks = {
  driver: {
    indeed: verifiedJobUrl(process.env.INDEED_DRIVER_URL, 'indeed'),
    ziprecruiter: verifiedJobUrl(process.env.ZIPRECRUITER_DRIVER_URL, 'ziprecruiter'),
  },
  cook: {
    indeed: verifiedJobUrl(process.env.INDEED_COOK_URL, 'indeed'),
    ziprecruiter: verifiedJobUrl(process.env.ZIPRECRUITER_COOK_URL, 'ziprecruiter'),
  },
};

export const careersEmailReady = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CAREERS_FROM_EMAIL?.trim());
