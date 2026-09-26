/**
 * Renders the College Boy home-screen icons and the social share image.
 *
 * The mark is drawn as SVG shapes (no installed fonts required) so Android,
 * iOS, and browser tabs all get the same red truck. Run it after a brand
 * change; the generated files are committed.
 *
 *   node scripts/generate-app-icons.mjs
 *
 * Uses the sharp that ships with the Next.js image optimizer.
 */
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const red = '#e51b2b';
const cream = '#f8efdf';
const ink = '#130f0f';
const butter = '#ffcc45';

/**
 * The step-van mark on a red field, centred in a 512 box.
 * `scale` shrinks the art for the Android maskable safe zone (inner 80%).
 */
function markSvg(scale) {
  const shift = 256 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${red}"/>
  <g transform="translate(${shift} ${shift - 27 * scale}) scale(${scale})">
    <path d="M44 266 L96 190 L156 190 L156 168 L462 168 L462 332 L44 332 Z" fill="${cream}"/>
    <rect x="62" y="214" width="62" height="44" rx="8" fill="${ink}"/>
    <rect x="186" y="204" width="246" height="40" fill="${red}"/>
    <rect x="186" y="258" width="170" height="26" fill="${red}"/>
    <rect x="44" y="332" width="418" height="18" fill="${ink}"/>
    <rect x="36" y="360" width="440" height="16" fill="${butter}"/>
    <g fill="${ink}"><circle cx="150" cy="356" r="42"/><circle cx="404" cy="356" r="42"/></g>
    <g fill="${cream}"><circle cx="150" cy="356" r="16"/><circle cx="404" cy="356" r="16"/></g>
  </g>
</svg>`;
}

async function png(svg, size, target) {
  const file = resolve(root, target);
  await mkdir(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log(`wrote ${target} (${size}×${size})`);
}

const standard = markSvg(0.94);

await png(standard, 96, 'app/icon.png');
await png(markSvg(0.9), 180, 'app/apple-icon.png');
await png(standard, 192, 'public/icons/icon-192.png');
await png(standard, 512, 'public/icons/icon-512.png');
await png(markSvg(0.74), 512, 'public/icons/icon-maskable-512.png');

/* Share card: the food first, the wordmark bar underneath. */
const shareHeight = 630;
const shareWidth = 1200;
const bandHeight = 132;
const photo = await sharp(resolve(root, 'public/media/college-boy-cheesesteak-feast-enhanced.png'))
  .resize(shareWidth, shareHeight - bandHeight, { fit: 'cover', position: 'attention' })
  .toBuffer();
const band = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${shareWidth}" height="${bandHeight}">
  <rect width="${shareWidth}" height="${bandHeight}" fill="${ink}"/>
  <rect y="${bandHeight - 10}" width="${shareWidth}" height="10" fill="${red}"/>
</svg>`);
const wordmark = await sharp(resolve(root, 'public/media/college-boy-truck-logo-v2.png'))
  .resize({ height: 96, fit: 'inside' })
  .toBuffer();
const shareFile = resolve(root, 'app/opengraph-image.jpg');
await sharp({ create: { width: shareWidth, height: shareHeight, channels: 4, background: ink } })
  .composite([
    { input: photo, top: 0, left: 0 },
    { input: band, top: shareHeight - bandHeight, left: 0 },
    { input: wordmark, top: shareHeight - bandHeight + 14, left: 56 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(shareFile);
console.log(`wrote app/opengraph-image.jpg (${shareWidth}×${shareHeight})`);
