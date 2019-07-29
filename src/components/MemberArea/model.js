import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';

const languages = ISO6391.getLanguages(ISO6391.getAllCodes());

export default {
  email: {
    type: 'text',
    defaultValue: '',
  },
  name: {
    type: 'text',
    defaultValue: '',
  },
  avatar: {
    type: 'text',
    defaultValue: '',
  },
  title: {
    type: 'text',
    defaultValue: '',
  },
  description: {
    type: 'longtext',
    defaultValue: '',
    style: {
      width: '100%'
    }
  },
  country: {
    type: 'select',
    defaultValue: '',
    options: Object.entries(countries).map(([code, name]) => ({
      label: name,
      value: code,
    }))
  },
  spokenLanguages: {
    type: 'tags',
    defaultValue: [],
    options: languages.map(lang => ({
      value: lang.code,
      label: lang.name,
    }))
  },
  tags: {
    type: 'tags',
    defaultValue: [],
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ],
  },
};
