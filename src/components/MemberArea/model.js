import countries from 'svg-country-flags/countries.json';
import { languages } from '../../helpers/languages';
import tags from '../../utils/tags';

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlPattern =
  /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const linkedinPattern = /^[A-Za-z0-9-]{3,100}$/;
const facebookPattern = /^[a-z\d.]{5,50}$/i;
const twitterPattern = /^[A-Za-z0-9_]{1,15}$/;
const githubPattern = /^([a-z\d]+-)*[a-z\d]+$/i;

const emailValidation = (value) => !value || emailPattern.test(value);
const urlValidation = (value) => !value || urlPattern.test(value);
const linkedinValidation = (value) => !value || linkedinPattern.test(value);
const facebookValidation = (value) => !value || facebookPattern.test(value);
const twitterValidation = (value) => !value || twitterPattern.test(value);
const githubValidation = (value) => !value || githubPattern.test(value);
const nameValidation = (value) =>
  value.length > 3 && value.length <= 50 && /^\S+(\s\S+)+$/.test(value);

export default {
  email: {
    label: 'Email',
    type: 'text',
    defaultValue: '',
    disabled: true,
    validate: (value) => !!value && emailValidation(value),
  },
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: '',
    maxLength: 50,
    helpText: 'Please use your real name',
    validate: (value) => !!value && nameValidation(value),
  },
  avatar: {
    label: 'Avatar',
    type: 'file',
    defaultValue: '',
    helpText: 'https public URL to an image file',
    previewImage: true,
    validate: (value) => !!value,
  },
  title: {
    label: 'Title',
    type: 'text',
    maxLength: 50,
    defaultValue: '',
    helpText: 'e.g. Software Developer',
    validate: (value) => !!value && value.length > 3 && value.length <= 50,
  },
  description: {
    label: 'Description',
    type: 'longtext',
    defaultValue: '',
    maxLength: 400,
    validate: (value) => !value || (value.length > 3 && value.length <= 400),
    helpText: 'Up to 400 characters',
    style: {
      width: '100%',
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
    validate: (option) => !!option.value,
  },
  spokenLanguages: {
    label: 'Spoken Languages',
    type: 'tags',
    defaultValue: [],
    options: languages.map((lang) => ({
      value: lang.code,
      label: lang.name,
    })),
    validate: (options) => !!options.length,
  },
  tags: {
    label: 'Tags',
    type: 'tags',
    defaultValue: [],
    maxItems: 10,
    style: {
      width: '100%',
    },
    options: tags.map((tag) => ({ value: tag, label: tag })),
    validate: (options) => !!options.length,
    helpText: 'Up to 10',
  },
  channels: {
    label: 'Channels',
    type: 'keyvalue',
    defaultValue: [],
    options: [
      {
        value: 'email',
        label: 'Email Address',
        prefix: 'mailto:',
        validate: emailValidation,
      },
      {
        value: 'website',
        label: 'Website',
        prefix: 'https://',
        validate: (value) => urlValidation(`https://${value}`),
      },
      {
        value: 'linkedin',
        label: 'LinkedIn',
        prefix: 'https://linkedin.com/in/',
        validate: (value) => linkedinValidation(value),
        helpText: 'Add only your Linkedin username',
      },
      {
        value: 'facebook',
        label: 'Facebook',
        prefix: 'https://facebook.com/',
        validate: (value) => facebookValidation(value),
        helpText: 'Add only your Facebook username',
      },
      {
        value: 'twitter',
        label: 'Twitter',
        prefix: 'https://twitter.com/',
        validate: (value) => twitterValidation(value),
        helpText: 'Add only your Twitter handle',
      },
      {
        value: 'github',
        label: 'Github',
        prefix: 'https://github.com/',
        validate: (value) => githubValidation(value),
        helpText: 'Add only your Github username',
      },
      {
        value: 'slack',
        label: 'Slack',
        prefix: 'https://coding-coach.slack.com/team/',
        helpText: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://medium.com/@moshfeu/how-to-find-my-member-id-in-slack-workspace-d4bba942e38c#88b8"
          >
            How to find SlackId?
          </a>
        ),
      },
    ],
    style: {
      width: '100%',
    },
    helpText: 'Up to 3',
    validate: (options) => options.length > 0,
  },
};
