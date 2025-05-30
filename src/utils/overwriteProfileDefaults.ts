import type { User } from '../types/models';

export function overwriteProfileDefaults({
  email,
  name,
  avatar,
}: Pick<User, 'email' | 'name' | 'avatar'>) {
  const [emailName] = email.split('@');

  return {
    name: emailName === name ? '' : name,
  };
}
