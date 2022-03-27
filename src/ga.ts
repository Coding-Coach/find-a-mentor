import { isSsr } from './helpers/ssr';

export function report(category: string, action: string, label?: string) {
  if (!shouldReport()) {
    // eslint-disable-next-line no-console
    console.log('Fake report: ');
    // eslint-disable-next-line no-console
    console.log({ category, action, label });
    return;
  }
  window.ga('send', 'event', category, action, label);
}

export function reportPageView() {
  if (!shouldReport()) {
    return;
  }
  window.ga('send', 'pageview');
}

export function reportError(category: string, label: string) {
  report(category, 'Error', label);
}

function shouldReport() {
  if (isSsr()) {
    return false;
  }
  return !window.location.host.includes('localhost');
}
