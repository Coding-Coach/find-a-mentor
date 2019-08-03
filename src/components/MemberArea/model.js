import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import tags from './tags';

const languages = ISO6391.getLanguages(ISO6391.getAllCodes());
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlPattern = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

export default {
  email: {
    type: 'text',
    defaultValue: '',
    validate: value => !!value && emailPattern.test(value),
  },
  name: {
    type: 'text',
    defaultValue: '',
    validate: value => !!value
  },
  avatar: {
    type: 'text',
    defaultValue: '',
    validate: value => !!value && urlPattern.test(value),
    helpText: 'A public URL to an image file'
  },
  title: {
    type: 'text',
    defaultValue: '',
    validate: value => !!value,
  },
  description: {
    type: 'longtext',
    defaultValue: '',
    style: {
      width: '100%'
    },
  },
  country: {
    type: 'select',
    defaultValue: '',
    options: Object.entries(countries).map(([code, name]) => ({
      label: name,
      value: code,
    })),
    validate: option => !!option.value
  },
  spokenLanguages: {
    type: 'tags',
    defaultValue: [],
    options: languages.map(lang => ({
      value: lang.code,
      label: lang.name,
    })),
    validate: options => !!options.length
  },
  tags: {
    type: 'tags',
    defaultValue: [],
    maxItems: 5,
    style: {
      width: '100%'
    },
    options: tags.map(tag => ({value: tag, label: tag})),
    validate: options => !!options.length,
    helpText: 'Up tp 5'
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
    },
    validate: options => !!options.length,
    helpText: 'Up to 3',
  }
};