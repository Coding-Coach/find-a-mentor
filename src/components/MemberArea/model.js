import React from 'react';
import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import tags from './tags';

const languages = ISO6391.getLanguages(ISO6391.getAllCodes());
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlPattern = /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const linkedinPattern = /^[A-Za-z0-9-]{3,100}$/;

const emailValidation = value => !value || emailPattern.test(value);
const urlValidation = value => !value || urlPattern.test(value);
const linkedinValidation = value => !value || linkedinPattern.test(value);

export default {
  email: {
    label: 'Email',
    type: 'text',
    defaultValue: '',
    disabled: true,
    validate: value => !!value && emailValidation(value),
  },
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: '',
    maxLength: 50,
    helpText: 'Please use your real name',
    validate: value => !!value && (value.length > 3 && value.length <= 50),
  },
  avatar: {
    label: 'Avatar',
    type: 'text',
    defaultValue: '',
    validate: value => !!value && urlValidation(value),
    helpText: 'https public URL to an image file',
    previewImage: true,
  },
  title: {
    label: 'Title',
    type: 'text',
    maxLength: 50,
    defaultValue: '',
    validate: value => !!value && (value.length > 3 && value.length <= 50),
  },
  description: {
    label: 'Description',
    type: 'longtext',
    defaultValue: '',
    maxLength: 140,
    validate: value => !value || (value.length > 3 && value.length <= 140),
    helpText: 'Empty or 3-140 characters',
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
    validate: option => !!option.value,
  },
  spokenLanguages: {
    label: 'Spoken Languages',
    type: 'tags',
    defaultValue: [],
    options: languages.map(lang => ({
      value: lang.code,
      label: lang.name,
    })),
    validate: options => !!options.length,
  },
  tags: {
    label: 'Tags',
    type: 'tags',
    defaultValue: [],
    maxItems: 5,
    style: {
      width: '100%',
    },
    options: tags.map(tag => ({ value: tag, label: tag })),
    validate: options => !!options.length,
    helpText: 'Up to 5',
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
        value: 'linkedin',
        label: 'LinkedIn',
        prefix: 'https://linkedin.com/in/',
        validate: value => linkedinValidation(value),
      },
      { value: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/' },
      { value: 'twitter', label: 'Twitter', prefix: 'https://twitter.com/@' },
      { value: 'github', label: 'Github', prefix: 'https://github.com/' },
      {
        value: 'website',
        label: 'Website',
        prefix: 'https://',
        validate: value => urlValidation(`https://${value}`),
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
    validate: options => options.length > 0,
  },
};
