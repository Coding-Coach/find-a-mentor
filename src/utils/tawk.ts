import { UserRole } from '../types/models';

type Visitor = {
  name: string;
  email: string;
  roles: UserRole[];
};

export type TawkAPI = {
  visitor: Visitor;
  onLoad(): void;
  addTags(tags: UserRole[], callback?: () => void): void;
};

function init() {
  (function() {
    var s1 = document.createElement('script'),
      s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60a117b2185beb22b30dae86/1f5qk953t';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);
  })();

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = function() {
    window.Tawk_API.addTags(['Mentor', 'User']);
  };
}

export function setVisitor(visitor: Visitor): void {
  window.Tawk_API.visitor = visitor;
}

init();
