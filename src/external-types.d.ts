import { TawkAPI } from './utils/tawk';

export declare global {
  interface Window {
    Tawk_API: TawkAPI;
    ga(...args: string[]): void;
    ssrModel: any;
  }
}
