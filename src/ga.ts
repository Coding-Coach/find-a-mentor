import { isSsr } from './helpers/ssr';

export function report(category: string, action: string, label?: string) {
  if (!shouldReport()) {
    // eslint-disable-next-line no-console
    console.log('Fake report: ');
    // eslint-disable-next-line no-console
    console.log({ category, action, label });
    return;
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  });
}

export function reportPageView() {
  if (!shouldReport()) {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
  });
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
