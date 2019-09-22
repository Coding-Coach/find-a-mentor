export function overwriteProfileDefaults({ email, name, avatar }) {
  const [emailName] = email.split('@');

  return {
    name: emailName === name ? '' : name,
    avatar: avatar.indexOf('auth0') > -1 ? '' : avatar,
  };
}
