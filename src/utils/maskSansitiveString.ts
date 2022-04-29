const replaceWithAsterisk = (str: string) => {
  return str.replace(/./g, '*');
}

export const maskEmail = (email: string) => {
  return email.replace(/(.)(.*)(.@.)(.*)(.\..*)/, (...[, g1l1, g1Rest, at, g2Rest, sufix]) => {
    return `${g1l1}${replaceWithAsterisk(g1Rest)}${at}${replaceWithAsterisk(g2Rest)}${sufix}`;
  });
}
