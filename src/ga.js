export function report(category, action, label) {
  if (isLocal()) {
    // eslint-disable-next-line no-console
    console.log('Fake report: ');
    // eslint-disable-next-line no-console
    console.log({ category, action, label });
    return;
  }
  window.ga('send', 'event', category, action, label);
}

export function reportPageView() {
  if (isLocal()) {
    return;
  }
  window.ga('send', 'pageview');
}

export function reportError(category, label) {
  report(category, 'Error', label);
}

function isLocal() {
  return window.location.host.includes('localhost');
}
