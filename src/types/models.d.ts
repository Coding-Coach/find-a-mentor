import countries from 'svg-country-flags/countries.json';

type ObjectID = {
  _id: string;
};

type Country = keyof typeof countries;
type UserRole = 'Admin' | 'Mentor' | 'User';
type Channel = {
  id: string;
  type: string;
};

export type User = ObjectID & {
  name: string;
  title: string;
  email: string;
  tags: string[];
  avatar?: string;
  country: Country;
  roles: UserRole[];
  available: boolean;
  description?: string;
  spokenLanguages: string[];
  channels: Channel[];
};
export type Mentor = User & {};
export type Application = ObjectID & {};
