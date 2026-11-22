const backdrop = document.querySelector('.backdrop');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobilePositions = ['42%', '61%', '65%', '71%', '52%', '53%'];
const interval = 8000;
const fadeDuration = 900;

let current = backdrop.querySelector('img');
let index = 0;
let timer;
let scheduleVersion = 0;

function schedule() {
  clearTimeout(timer);
  const version = ++scheduleVersion;
  if (reducedMotion.matches || document.hidden) return;
  timer = setTimeout(() => advance(version), interval);
}

async function advance(version) {
  const nextIndex = (index + 1) % mobilePositions.length;
  const next = new Image();
  next.className = 'backdrop-image';
  next.alt = '';
  next.src = `leonida-${nextIndex + 1}.webp`;
  try {
    await next.decode();
  } catch {
    if (version !== scheduleVersion) return;
    index = nextIndex;
    schedule();
    return;
  }
  if (version !== scheduleVersion) return;

  next.style.setProperty('--mobile-position', mobilePositions[nextIndex]);
  backdrop.append(next);
  // Establish the transparent style before starting the crossfade.
  next.getBoundingClientRect();
  next.classList.add('is-visible');
  const previous = current;
  setTimeout(() => previous.remove(), fadeDuration);
  current = next;
  index = nextIndex;
  schedule();
}

reducedMotion.addEventListener('change', schedule);
document.addEventListener('visibilitychange', schedule);
schedule();
