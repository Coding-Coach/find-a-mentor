import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import { overwriteProfileDefaults } from '../utils/overwriteProfileDefaults';

export function isMentor(user) {
  return user && user.roles.includes('Mentor');
}

export function isAdmin(user) {
  return user && user.roles.includes('Admin');
}

export function fromVMtoM(user) {
  return {
    ...user,
    description: user.description || undefined,
    tags: user.tags.map(i => i.value),
    spokenLanguages: user.spokenLanguages.map(i => i.value),
    country: user.country.value,
  };
}

export function fromMtoVM(user) {
  return {
    ...user,
    ...(isMentor(user) ? {} : overwriteProfileDefaults(user)),
    country: user.country
      ? { label: countries[user.country], value: user.country }
      : { value: '' },
    spokenLanguages: user.spokenLanguages
      ? user.spokenLanguages.map(i => ({
          label: ISO6391.getName(i),
          value: i,
        }))
      : [],
    tags: user.tags ? user.tags.map(i => ({ label: i, value: i })) : [],
  };
}
