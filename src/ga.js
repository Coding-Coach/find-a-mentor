export function report(category, action, label) {
  if (!window.location.host.includes('localhost')) {
    window.ga('send', 'event', category, action, label);
  }
}
