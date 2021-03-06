export function overwriteProfileDefaults({
  email,
  name,
  avatar,
}: {
  email: string,
  name: string,
  avatar: string,
}) {
  const [emailName] = email.split('@');

  return {
    name: emailName === name ? '' : name,
    avatar: avatar && avatar.includes('auth0') ? '' : avatar,
  };
}
