import { User } from '../../../../src/types/models';

const defaults: User = {
  _id: '1',
  title: 'One of the best',
  name: 'Brent M Clark',
  email: 'brentmclark@gmail.com',
  roles: ['Mentor'],
  avatar:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtBAMAAADINP+pAAAAG1BMVEXMzMyWlpa+vr6xsbG3t7fFxcWqqqqjo6OcnJzvcxCxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVQ4jWNgGAUjGDCZpcBJZMBsgiCRgat5M4OJAohEBYlCigzhYBINGCcD1YPIUTCsAADs9gb4p4yG2QAAAABJRU5ErkJggg==',
  spokenLanguages: ['en', 'he'],
  country: 'US',
  tags: ['cypress', 'react', 'typescript'],
  available: false,
  createdAt: '2021-01-01T00:00:00.000Z',
  channels: [
    {
      id: 'email@codingcoach.io',
      type: 'email',
    },
  ],
};

export const userBuilder = (user: Partial<User> = {}) => {
  return {
    ...defaults,
    ...user,
  };
};
