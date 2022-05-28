import ISO6391 from 'iso-639-1';
import countries from 'svg-country-flags/countries.json';
import tags from '../../utils/tags.js';

type Option = {
  label: string;
  value: string;
};

type BaseConfig = {
  label: string;
  type: string;
  helpText: string;
  validate?: (...args: any[]) => boolean;
};

type TextBaseConfig = BaseConfig & {
  maxLength: number;
  defaultValue: string;
  placeholder?: string;
  style?: React.CSSProperties;
  validate: (value: string) => boolean;
};

type TextConfig = TextBaseConfig & {
  type: 'text';
};

type LongTextConfig = TextBaseConfig & {
  type: 'longtext';
};

type CheckboxConfig = BaseConfig & {
  type: 'checkbox';
};

type SelectBaseConfig = BaseConfig & {
  options: Option[];
  maxItems: number;
  validate: (options: Option[]) => boolean;
};

type SelectConfig = SelectBaseConfig & {
  type: 'select';
};

type SelectMultiConfig = SelectBaseConfig & {
  type: 'tags';
};

type KeyValueConfig = BaseConfig & {
  type: 'keyvalue';
  options: (TextBaseConfig & {
    value: string;
    prefix?: string;
  })[];
};

export type ModelConfig =
  | TextConfig
  | LongTextConfig
  | CheckboxConfig
  | SelectConfig
  | SelectMultiConfig
  | KeyValueConfig;

const languages = ISO6391.getLanguages(ISO6391.getAllCodes());
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlPattern =
  /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const linkedinPattern = /^\p{Lu}|\p{Ll}|\p{Lt}|\p{Lm}|\p{Lo}|-|[0-9]{1,50}$/u;
const facebookPattern = /^[a-z\d.]{5,50}$/i;
const twitterPattern = /^[A-Za-z0-9_]{1,15}$/;
const githubPattern = /^([a-z\d]+-)*[a-z\d]+$/i;

const emailValidation = (value: string) => !value || emailPattern.test(value);
const urlValidation = (value: string) =>
  !value || urlPattern.test(`https://${value}`);
const linkedinValidation = (value: string) =>
  !value || linkedinPattern.test(value);
const facebookValidation = (value: string) =>
  !value || facebookPattern.test(value);
const twitterValidation = (value: string) =>
  !value || twitterPattern.test(value);
const githubValidation = (value: string) => !value || githubPattern.test(value);
const nameValidation = (value: string) =>
  value.length > 3 && value.length <= 50 && /^\S+(\s\S+)+$/.test(value);

export const userFields = {
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: '',
    maxLength: 50,
    helpText: 'Please use your real name',
    validate: (value: string) => !!value && nameValidation(value),
  },
  title: {
    label: 'Title',
    type: 'text',
    maxLength: 50,
    defaultValue: '',
    helpText: 'e.g. Software Developer',
    validate: (value: string) =>
      !!value && value.length > 3 && value.length <= 50,
  },
  description: {
    label: 'About',
    type: 'longtext',
    defaultValue: '',
    maxLength: 140,
    validate: (value: string) =>
      !value || (value.length > 3 && value.length <= 400),
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
    validate: (option: Option) => !!option.value,
  },
  // we don't need timezone for now, we're not showing it anywhere.
  // timezone: {
  //   label: 'Time Zone',
  //   type: 'select',
  //   defaultValue: '',
  //   options: Object.entries(countries).map(([code, name]) => ({
  //     label: name,
  //     value: code,
  //   })),
  // },
  spokenLanguages: {
    label: 'Spoken Languages',
    type: 'tags',
    defaultValue: [],
    options: languages.map((lang) => ({
      value: lang.code,
      label: lang.name,
    })),
    validate: (options: Option[]) => !!options.length,
  },
  tags: {
    label: 'Skills',
    type: 'tags',
    defaultValue: [],
    maxItems: 10,
    style: {
      width: '100%',
    },
    options: tags.map((tag) => ({ value: tag, label: tag })),
    validate: (options: Option[]) => !!options.length,
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
        validate: (value: string) => urlValidation(value),
        helpText: 'https supported only',
      },
      {
        value: 'linkedin',
        label: 'LinkedIn',
        prefix: 'https://linkedin.com/in/',
        validate: (value: string) => linkedinValidation(value),
        helpText: 'Add only your Linkedin username',
      },
      {
        value: 'facebook',
        label: 'Facebook',
        prefix: 'https://facebook.com/',
        validate: (value: string) => facebookValidation(value),
        helpText: 'Add only your Facebook username',
      },
      {
        value: 'twitter',
        label: 'Twitter',
        prefix: 'https://twitter.com/',
        validate: (value: string) => twitterValidation(value),
        helpText: 'Add only your Twitter handle',
      },
      {
        value: 'github',
        label: 'Github',
        prefix: 'https://github.com/',
        validate: (value: string) => githubValidation(value),
        helpText: 'Add only your Github username',
      },
      {
        value: 'slack',
        label: 'Slack',
        prefix: 'https://codin...ck.com/team/',
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
    helpText:
      'This is how you will communicate with your mentees once you have accepted their mentorship requests, you can set up to three.',
    validate: (options: Option[]) => !!options.length,
  },
  // capacity: {
  //   label: 'Capacity',
  //   type: 'select',
  //   defaultValue: '',
  //   options: [1, 2, 3, 4].map(item => ({
  //     label: item,
  //     value: item,
  //   })),
  // },
};

export const mentorFields = {
  ...userFields,
  available: {
    label: 'Available for new mentees',
    type: 'checkbox',
    defaultValue: 'true',
    // options: [
    //   {
    //     value: '0',
    //     label: (
    //       <span>
    //         Schedule calls for <b>mentoring sessions</b>
    //       </span>
    //     ),
    //   },
    //   {
    //     value: '1',
    //     label: (
    //       <span>
    //         Ping me at <b>any time</b>, I will get back when available
    //       </span>
    //     ),
    //   },
    //   {
    //     value: '2',
    //     label: (
    //       <span>
    //         I'm not available for <b>new</b> mentorships
    //       </span>
    //     ),
    //   },
    //   {
    //     value: '3',
    //     label: (
    //       <span>
    //         I'm <b>not available</b> anymore
    //       </span>
    //     ),
    //   },
    // ],
    helpText:
      'Please define how would you like to drive the mentorship and how many mentees you can take.',
    // validate: (value: string) => value,
  },
};
