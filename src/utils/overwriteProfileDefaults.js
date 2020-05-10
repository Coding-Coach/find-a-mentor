export function overwriteProfileDefaults({ email, name, avatar }) {
  const [emailName] = email.split('@');

  return {
    name: emailName === name ? '' : name,
    avatar: avatar && avatar.includes('auth0') ? '' : avatar,
  };
}
