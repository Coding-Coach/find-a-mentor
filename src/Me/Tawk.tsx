import { useEffect } from 'react';
const Tawk = ({ tawkShowing }: { tawkShowing: boolean }) => {
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development' || isSsr()) {
    //   return;
    // }
    const s1 = document.createElement('script');
    s1.async = true;
    s1.id = 'tawk_script_head';
    s1.src = 'https://embed.tawk.to/60a117b2185beb22b30dae86/1f5qk953t';
    s1.setAttribute('crossorigin', '*');
    if (!tawkShowing) {
      if (document.getElementById('tawk_script_head')) {
        s1.parentNode.removeChild(s1);
      }
      return;
    }
    document.head.prepend(s1);
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.addTags(['Mentor', 'User']);
    };
  }, [tawkShowing]);
  return <></>;
};

export default Tawk;
