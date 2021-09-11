import { useEffect, useState } from 'react';
import { desktop } from '../Me/styles/shared/devices';

export function useDeviceType() {
  const [isDesktop, setIsDesktop] = useState<boolean>();
  const handleMatcher = ({ matches }: { matches: boolean }) => setIsDesktop(matches);

  useEffect(() => {
    if (typeof window !== 'object') {
      return;
    }
    const matcher = window.matchMedia(desktop);
    handleMatcher(matcher);

    matcher.addEventListener('change', handleMatcher);
  }, []);

  return { isDesktop, isMobile: !isDesktop };
}
