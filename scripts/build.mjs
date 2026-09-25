import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('dist');
const output = resolve('build');
const html = await readFile(resolve(source, 'index.html'), 'utf8');

const localReferences = [...html.matchAll(/(?:href|src)="\/(?!\/)([^"?#]+)["?#]?/g)]
  .map(match => match[1]);

for (const reference of localReferences) {
  await readFile(resolve(source, reference));
}

const schedule = JSON.parse(await readFile(resolve(source, 'data/schedule.json'), 'utf8'));
if (!Array.isArray(schedule.stops)) throw new Error('schedule.stops must be an array');

for (const stop of schedule.stops) {
  for (const field of ['stopName', 'streetAddress', 'startsAt', 'endsAt', 'status', 'timeZone']) {
    if (!stop[field]) throw new Error(`Schedule stop is missing ${field}`);
  }
  if (!['confirmed', 'canceled'].includes(stop.status)) {
    throw new Error(`Unsupported schedule status: ${stop.status}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log(`Built ${output} with ${localReferences.length} validated local references.`);
