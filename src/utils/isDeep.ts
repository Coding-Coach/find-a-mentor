export const isDeep = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return new URLSearchParams(window.location.search).get('deep') === 'deep';
}
