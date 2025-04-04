import { isSsr } from '../helpers/ssr';

export const isDeep = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  console.log(11111, process.env.NEXT_PUBLIC_GREETING, new URLSearchParams(window.location.search).get('deep'))
  return new URLSearchParams(window.location.search).get('deep') === process.env.NEXT_PUBLIC_GREETING;
}