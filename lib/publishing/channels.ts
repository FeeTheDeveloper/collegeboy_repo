/**
 * Channels College Boy may publish to. Every channel starts in manual mode:
 * the system drafts, a person approves, a person posts. Direct publishing is
 * switched on per channel only with the owner's written authorization and an
 * official API connection — never a stored password or a personal profile.
 */
export type ChannelId = 'website' | 'instagram-feed' | 'instagram-story' | 'facebook-page' | 'google-business-profile';

export type Channel = {
  id: ChannelId;
  label: string;
  /** Caption length ceiling we hold ourselves to, below the platform limit. */
  captionLimit: number;
  aspectRatios: readonly string[];
  /** Null until the owner authorizes direct publishing for this one channel. */
  directPublish: null | { api: string; authorizedBy: string; authorizedAt: string };
};

export const channels: Record<ChannelId, Channel> = {
  website: { id: 'website', label: 'Website “Find the truck”', captionLimit: 400, aspectRatios: [], directPublish: null },
  'instagram-feed': { id: 'instagram-feed', label: 'Instagram feed', captionLimit: 2000, aspectRatios: ['4:5', '1:1'], directPublish: null },
  'instagram-story': { id: 'instagram-story', label: 'Instagram story', captionLimit: 250, aspectRatios: ['9:16'], directPublish: null },
  'facebook-page': { id: 'facebook-page', label: 'Facebook Page (business page only)', captionLimit: 1500, aspectRatios: ['4:5', '1.91:1'], directPublish: null },
  'google-business-profile': { id: 'google-business-profile', label: 'Google Business Profile update', captionLimit: 1400, aspectRatios: ['4:3'], directPublish: null },
};

export function publishMode(channel: Channel): 'manual' | 'direct' {
  return channel.directPublish ? 'direct' : 'manual';
}
