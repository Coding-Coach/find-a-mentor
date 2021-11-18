import { TawkAPI } from './utils/tawk';

export declare global {
  interface Window {
    Tawk_API: TawkAPI;
    ga(operation: 'send', event: 'pageview'): void;
    ga(operation: 'send', event: 'event', category: string, action: string, label?: string): void;
  }
}
