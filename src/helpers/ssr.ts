export function isSsr() {
  return typeof window === 'undefined';
}