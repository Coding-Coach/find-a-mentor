export function report(category, action, label) {
  if (isLocal()) {
    console.log('Fake report: ');
    console.log({ category, action, label });
    return;
  }
  window.ga('send', 'event', category, action, label);
}

export function reportPageView() {
  if (isLocal()) {
    return;
  }
  const { location, ga } = window;
  ga('set', 'page', location.href);
  ga('send', 'pageview');
}

export function reportError(category, label) {
  report(category, 'Error', label);
}

function isLocal() {
  return window.location.host.includes('localhost');
}
