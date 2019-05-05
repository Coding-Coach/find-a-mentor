'use strict';
const inquirer = require('inquirer');
const countries = require('svg-country-flags/countries.json');
const ISO6391 = require('iso-639-1');
const checkSynonyms = require('../src/checkSynonymsTags');
const https = require('https');
var imageType = require('image-type');

// Added for the country list filtering
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

inquirer.registerPrompt(
  'checkbox-plus',
  require('inquirer-checkbox-plus-prompt')
);

function validateEmail(value) {
  const pass = value.match(
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );
  if (pass) {
    return true;
  }
  return 'Please enter a valid email';
}
const questionEmail = {
  type: 'input',
  name: 'id',
  message: 'Please add your email:',
  validate: validateEmail,
};

function validateName(value) {
  const pass = value.match(/^[A-Za-z].{1,}$/);
  if (pass) {
    return true;
  }
  return 'Please enter a valid name. Minimum 2 characters.';
}
const questionName = {
  type: 'input',
  name: 'name',
  message: 'Please add your name:',
  validate: validateName,
};

async function validateAvatar(value) {
  const pass = value.match(
    /^(https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/
  );
  if (pass) {
    let isImage = null;
    await new Promise(function(resolve, reject) {
      https.get(value, function(request) {
        request.once('data', function(chunk) {
          isImage = imageType(chunk) ? true : false;
          request.destroy();
          resolve();
        });
        request.on('error', function(err) {
          reject();
        });
      });
    });
    if (isImage) {
      return true;
    }
    return 'Please enter a valid avatar url. Must return a valid image';
  }
  return 'Please enter a valid avatar url. Must start with "https://"';
}
const questionAvatar = {
  type: 'input',
  name: 'avatar',
  message: 'Please add your avatar url (must be secure):',
  validate: validateAvatar,
};

function validateTitle(value) {
  const pass = value.match(/^[A-Za-z].{1,30}$/);
  if (pass) {
    return true;
  }
  return 'Please enter a valid title. Between 2 and 30 characters.';
}
const questionTitle = {
  type: 'input',
  name: 'title',
  message: 'Please add your title (2 - 30 characters):',
  validate: validateTitle,
};

function validateDescription(value) {
  if (value) {
    const pass = value.match(/^[A-Za-z].{4,80}$/);
    if (pass) {
      return true;
    }
    return 'Please enter a valid description. Between 5 and 80 characters.';
  }
  return true;
}
const questionDescription = {
  type: 'input',
  name: 'description',
  message: 'Please add your description: (5 - 80 characters, optional)',
  validate: validateDescription,
};

const questionCountry = {
  type: 'autocomplete',
  name: 'country',
  message: 'Please add your country:',
  source: async (answers, input = '') =>
    Object.values(countries)
      .filter(country => country.toLowerCase().startsWith(input.toLowerCase()))
      .sort(),
};

const questionSpokenLanguages = {
  type: 'checkbox-plus',
  name: 'spokenLanguages',
  message:
    'Please add your spoken languages: (type to search, use space to select multiple languages, enter to submit)',
  pageSize: 10,
  highlight: true,
  searchable: true,
  default: ['English'],
  source: async (answers, input) => {
    input = input || '';
    var data = ISO6391.getAllNames();
    var results = data.filter(language =>
      language.toLowerCase().startsWith(input.toLowerCase())
    );
    return results;
  },
};

function validateTags(value) {
  const hasSynonymsErrors = tags => {
    const tagsArray = tags.split(',');
    let errors = [];
    tagsArray.forEach(tag => {
      const synonymError = checkSynonyms(tag);
      if (synonymError) {
        errors.push(synonymError);
      }
    });
    return errors;
  };

  const hasLessThanOneOrMoreThanFiveTags = tags => {
    const count = tags.split(',').length;

    return !tags || count > 5;
  };
  const hasUppercaseCharacters = tags => /[A-Z]/.test(tags);

  let errors = [];

  const synonymErrors = hasSynonymsErrors(value);
  if (synonymErrors.length) {
    errors = [...errors, ...synonymErrors];
  }
  if (hasLessThanOneOrMoreThanFiveTags(value)) {
    errors.push('between 1 and 5 tags');
  }

  if (hasUppercaseCharacters(value)) {
    errors.push('only lowercase characters');
  }

  if (errors.length > 0) {
    return `Please enter valid tags:\n- ${errors.join(';\n- ')}.`;
  }

  return true;
}
const questionTags = {
  type: 'input',
  name: 'tags',
  message: 'Please add your tags: (1 - 5 tags, separate by commas)',
  validate: validateTags,
};

function validateChannels(answer) {
  if (answer.length < 1) {
    return 'You must choose at least one option.';
  } else if (answer.length > 3) {
    return 'You must choose maximum three options';
  }
  return true;
}
const questionChannels = {
  type: 'checkbox',
  name: 'channels',
  message: 'Please add your channels (1 - 3 choices):',
  choices: [
    {
      name: 'Email',
    },
    {
      name: 'Slack',
    },
    {
      name: 'Linkedin',
    },
    {
      name: 'Facebook',
    },
    {
      name: 'Twitter',
    },
    {
      name: 'Github',
    },
    {
      name: 'Website',
    },
  ],
  validate: validateChannels,
};

const questionByChannel = {
  email: {
    type: 'input',
    name: 'Email',
    message: 'Please add your contact email:',
    validate: validateEmail,
    when: answers => answers.channels.find(channel => channel === 'Email'),
  },
  slack: {
    type: 'input',
    name: 'Slack',
    message: 'Please add your Slack member id:',
    when: answers => answers.channels.find(channel => channel === 'Slack'),
  },
  linkedin: {
    type: 'input',
    name: 'Linkedin',
    message: 'Please add your Linkedin user id:',
    when: answers => answers.channels.find(channel => channel === 'Linkedin'),
  },
  facebook: {
    type: 'input',
    name: 'Facebook',
    message: 'Please add your Facebook user id:',
    when: answers => answers.channels.find(channel => channel === 'Facebook'),
  },
  twitter: {
    type: 'input',
    name: 'Twitter',
    message: 'Please add your Twitter user id:',
    when: answers => answers.channels.find(channel => channel === 'Twitter'),
  },
  github: {
    type: 'input',
    name: 'Github',
    message: 'Please add your Github user id:',
    when: answers => answers.channels.find(channel => channel === 'Github'),
  },
  website: {
    type: 'input',
    name: 'Website',
    message: 'Please add link to your personal website without https',
    when: answers => answers.channels.find(channel => channel === 'Website'),
  },
};

const questions = [
  questionEmail,
  questionName,
  questionAvatar,
  questionTitle,
  questionDescription,
  questionCountry,
  questionSpokenLanguages,
  questionTags,
  questionChannels,
  questionByChannel.email,
  questionByChannel.slack,
  questionByChannel.linkedin,
  questionByChannel.facebook,
  questionByChannel.twitter,
  questionByChannel.github,
  questionByChannel.website,
];

function getCountryCodeByName(country) {
  return Object.keys(countries).find(key => countries[key].includes(country));
}

function convertAnswersToSchema(answers) {
  const choices = [
    'Email',
    'Slack',
    'Linkedin',
    'Facebook',
    'Twitter',
    'Github',
    'Website',
  ];
  for (let answer in answers) {
    if (answer === 'tags') {
      answers[answer] = answers[answer].split(',').map(t => t.trim());
    } else if (answer === 'country') {
      answers[answer] = getCountryCodeByName(answers[answer]);
    } else if (choices.includes(answer)) {
      answers.channels.forEach((element, index) => {
        if (element === answer) {
          answers.channels[index] = {
            type: answer.toLowerCase(),
            id: answers[answer],
          };
        }
      });
      delete answers[answer];
    } else if (answer === 'spokenLanguages') {
      answers[answer] = answers[answer].map(answer => ISO6391.getCode(answer));
    }
  }
  return answers;
}

async function main() {
  console.log(
    '\x1b[36m%s\x1b[0m',
    '\nHi, Welcome aboard!\nPlease answer the following questions\n'
  );
  const answers = await inquirer.prompt(questions);
  const schema = convertAnswersToSchema(answers);
  return schema;
}

module.exports = main;
