import { TawkAPI } from './utils/tawk';

export declare global {
  interface Window {
    Tawk_API: TawkAPI;
    gtag(command: 'config', targetId: string, config?: Record<string, any>): void;
    gtag(command: 'event', eventName: string, params?: Record<string, any>): void;
  }
}
