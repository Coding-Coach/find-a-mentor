export function report(category, action, label) {
  if (isLocal()) {
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

function isLocal() {
  return window.location.host.includes('localhost');
}
