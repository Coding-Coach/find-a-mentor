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
  channels: {
    type: 'keyvalue',
    defaultValue: {},
    options: [
      { value: 'email', label: 'Email Address', prefix: 'mailto:' },
      { value: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
      { value: 'facebook', label: 'Facebook', prefix: 'http://facebook.com/' },
      { value: 'twitter', label: 'Twitter', prefix: 'https://twitter.com/@' },
      { value: 'github', label: 'Github', prefix: 'http://github.com/' },
      { value: 'website', label: 'Website', prefix: 'https://' },
      { value: 'slack', label: 'Slack', prefix: 'https://coding-coach.slack.com/team/' },
    ],
    style: {
      width: '100%'
    }
  }
};
