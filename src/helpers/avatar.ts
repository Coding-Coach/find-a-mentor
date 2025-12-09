import md5 from 'blueimp-md5';
import type { User } from '../types/models';

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
}

export const getAvatarUrl = (user: User) => {
  if (user.avatar === 'gravatar') {
    return getGravatarUrl(user.email);
  }

  return user.auth0Picture;
};
