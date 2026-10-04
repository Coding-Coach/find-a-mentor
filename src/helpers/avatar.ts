const AUTH0_AVATAR_HOST = 'cdn.auth0.com';
const AUTH0_AVATAR_PATH_SEGMENT = '/avatars/';

const isWordPressImageProxyHost = (hostname: string) => /^i\d+\.wp\.com$/i.test(hostname);

export const isKnownNonFaceAvatar = (avatarUrl?: string): boolean => {
  if (!avatarUrl) {
    return false;
  }

  try {
    const url = new URL(avatarUrl);
    const hostname = url.hostname.toLowerCase();

    if (
      hostname === AUTH0_AVATAR_HOST &&
      url.pathname.includes(AUTH0_AVATAR_PATH_SEGMENT)
    ) {
      return true;
    }

    if (
      isWordPressImageProxyHost(hostname) &&
      url.pathname.includes(`${AUTH0_AVATAR_HOST}${AUTH0_AVATAR_PATH_SEGMENT}`)
    ) {
      return true;
    }

    const gravatarFallback = url.searchParams.get('d');

    if (!gravatarFallback) {
      return false;
    }

    const fallbackUrl = new URL(decodeURIComponent(gravatarFallback));

    return (
      fallbackUrl.hostname.toLowerCase() === AUTH0_AVATAR_HOST &&
      fallbackUrl.pathname.includes(AUTH0_AVATAR_PATH_SEGMENT)
    );
  } catch {
    return false;
  }
};
