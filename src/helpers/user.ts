import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import { Country, User, UserRole } from '../types/models';
import { overwriteProfileDefaults } from '../utils/overwriteProfileDefaults';

type LabelValue<T = string> = {
  label: string;
  value: T;
};

export type UserVM = Omit<
  User,
  'tags' | 'country' | 'spokenLanguages' | 'avatar'
> & {
  tags: LabelValue[];
  country: LabelValue<Country | ''>;
  spokenLanguages: LabelValue[];
};

function userHasRule(role: UserRole, user?: User) {
  return user?.roles.includes(role);
}

export function isMentor(user?: User) {
  return userHasRule('Mentor', user);
}

export function isAdmin(user?: User) {
  return userHasRule('Admin', user);
}

export function fromVMtoM(user: UserVM): User {
  return {
    ...user,
    description: user.description,
    tags: user.tags.map(i => i.value),
    spokenLanguages: user.spokenLanguages.map(i => i.value),
    country: user.country.value as Country,
  };
}

export function fromMtoVM(user: User): UserVM {
  return {
    ...user,
    ...(isMentor(user) ? {} : overwriteProfileDefaults(user)),
    country: user.country
      ? { label: countries[user.country], value: user.country }
      : { label: '', value: '' },
    spokenLanguages: user.spokenLanguages
      ? user.spokenLanguages.map(i => ({
        label: ISO6391.getName(i),
        value: i,
      }))
      : [],
    tags: user.tags ? user.tags.map(i => ({ label: i, value: i })) : [],
    title: user.title ?? '',
  };
}
