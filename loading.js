import { mondrianEngine, defaultMondrian } from './mondrian-engine.js';

const host = document.querySelector('[data-macsetup-loader]');
const content = document.querySelector('[data-macsetup-content]');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const settings = { ...defaultMondrian, revealMs: 650, rise: 6 };
const runtime = {
  enabled: true, paused: false, reduced: preference.matches, speed: 1,
  loading: true, poster: false, delayMs: 0, durationMs: 3900,
  compositionAspectRatio: 16 / 9, paperColor: '#f1f1f1', flow: true,
  lineWidthSelector: '.search-field', lineWidthScale: 2,
  onComplete: complete,
};

let renderer;
let observer;
let fallbackTimer;
let ready = false;
let finished = false;

function complete() {
  if (finished) return;
  finished = true;
  clearTimeout(fallbackTimer);
  observer?.disconnect();
  preference.removeEventListener('change', preferenceChanged);
  // Restore the original guide's styles and release canvases/listeners entirely.
  renderer?.destroy();
  renderer = null;
  content.inert = false;
  content.removeAttribute('aria-hidden');
  host.dataset.stage = 'complete';
  host.setAttribute('aria-busy', 'false');
  document.documentElement.dataset.macsetupIntro = 'complete';
}

async function checkReady() {
  if (ready || finished) return;
  // Existing app.js signals readiness after data validation and route rendering.
  // Its own error/retry screen must remain accessible when the request fails.
  const errorReady = !document.querySelector('#retry').hidden;
  if (window.demoReady !== true && !errorReady) return;
  ready = true;
  observer.disconnect();
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (finished) return;
  runtime.loading = false;
  renderer.update(settings, runtime);
}

function preferenceChanged() {
  runtime.reduced = preference.matches;
  renderer?.update(settings, runtime);
}

// If the small head-script failsafe has already released the guide, keep it open.
if (document.documentElement.dataset.macsetupIntro !== 'complete') {
  window.__macSetupIntroStarted = true;
  document.documentElement.dataset.macsetupIntro = 'loading';
  content.inert = true;
  content.setAttribute('aria-hidden', 'true');
  renderer = mondrianEngine.mount(host, content, settings, runtime);
  observer = new MutationObserver(checkReady);
  observer.observe(content, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
  preference.addEventListener('change', preferenceChanged);
  fallbackTimer = setTimeout(complete, 10000);
  checkReady();
}
