import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';

export function isMentor(user) {
  try {
    return user.roles.includes('MENTOR');
  } catch {
    return;
  }
}

export function fromVMtoM(user) {
  return {
    ...user,
    tags: user.tags.map(i => i.value),
    spokenLanguages: user.spokenLanguages.map(i => i.value),
    country: user.country.value,
  };
}

export function fromMtoVM(user) {
  return {
    ...user,
    country: { label: countries[user.country], value: user.country },
    spokenLanguages: user.spokenLanguages
      ? user.spokenLanguages.map(i => ({
          label: ISO6391.getName(i),
          value: i,
        }))
      : [],
    tags: user.tags ? user.tags.map(i => ({ label: i, value: i })) : [],
  };
}
