document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('open');
}));

const scheduleTitle = document.getElementById('schedule-title');
const scheduleDetail = document.getElementById('schedule-detail');
const scheduleUpdated = document.getElementById('schedule-updated');

function showNoConfirmedStop() {
  scheduleTitle.textContent = 'No confirmed stop posted';
  scheduleDetail.textContent = 'Check the official Instagram before traveling. An old or canceled stop is never shown as current.';
  scheduleUpdated.textContent = '';
}

fetch('/data/schedule.json')
  .then(response => {
    if (!response.ok) throw new Error('Schedule unavailable');
    return response.json();
  })
  .then(schedule => {
    const now = new Date();
    const confirmed = (schedule.stops || [])
      .filter(stop => stop.status === 'confirmed' && new Date(stop.endsAt) >= now)
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))[0];

    if (!confirmed) {
      showNoConfirmedStop();
      return;
    }

    const start = new Date(confirmed.startsAt);
    const end = new Date(confirmed.endsAt);
    const when = new Intl.DateTimeFormat('en-US', {
      timeZone: confirmed.timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(start);
    const endTime = new Intl.DateTimeFormat('en-US', {
      timeZone: confirmed.timeZone,
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(end);

    scheduleTitle.textContent = confirmed.stopName;
    scheduleDetail.textContent = `${confirmed.streetAddress} · ${when}–${endTime}`;
    scheduleUpdated.textContent = schedule.lastUpdatedAt
      ? `Schedule updated ${new Date(schedule.lastUpdatedAt).toLocaleString()}`
      : '';
  })
  .catch(showNoConfirmedStop);
