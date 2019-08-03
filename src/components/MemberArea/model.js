import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import tags from './tags';

const languages = ISO6391.getLanguages(ISO6391.getAllCodes());
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlPattern = /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const emailValidation = value => !value || emailPattern.test(value);
const urlValidation = value => !value || urlPattern.test(value);

export default {
  email: {
    label: 'Email',
    type: 'text',
    defaultValue: '',
    validate: value => !!value && emailValidation(value),
  },
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: '',
    validate: value => !!value,
  },
  avatar: {
    label: 'Avatar',
    type: 'text',
    defaultValue: '',
    validate: value => !!value && urlValidation(value),
    helpText: 'https public URL to an image file'
  },
  title: {
    label: 'Title',
    type: 'text',
    defaultValue: '',
    validate: value => !!value,
  },
  description: {
    label: 'Description',
    type: 'longtext',
    defaultValue: '',
    style: {
      width: '100%'
    },
  },
  country: {
    label: 'Country',
    type: 'select',
    defaultValue: '',
    options: Object.entries(countries).map(([code, name]) => ({
      label: name,
      value: code,
    })),
    validate: option => !!option.value
  },
  spokenLanguages: {
    label: 'Spoken Languages',
    type: 'tags',
    defaultValue: [],
    options: languages.map(lang => ({
      value: lang.code,
      label: lang.name,
    })),
    validate: options => !!options.length
  },
  tags: {
    label: 'Tags',
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
    label: 'Channels',
    type: 'keyvalue',
    defaultValue: {},
    options: [
      { value: 'email', label: 'Email Address', prefix: 'mailto:', validate: emailValidation },
      { value: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
      { value: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/' },
      { value: 'twitter', label: 'Twitter', prefix: 'https://twitter.com/@' },
      { value: 'github', label: 'Github', prefix: 'https://github.com/' },
      { value: 'website', label: 'Website', placeholder: 'https://...', validate: urlValidation },
      { value: 'slack', label: 'Slack', prefix: 'https://coding-coach.slack.com/team/' },
    ],
    style: {
      width: '100%'
    },
    helpText: 'Up to 3',
  }
};