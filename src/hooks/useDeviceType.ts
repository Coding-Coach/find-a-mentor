import { useEffect, useState } from 'react';
import { desktop } from '../Me/styles/shared/devices';

export function useDeviceType() {
  // Default isDesktop to true because we don't know the device dimensions on the server
  // TODO: Detect device dimensions on server
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
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
