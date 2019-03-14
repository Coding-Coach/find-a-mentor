'use strict';
const inquirer = require('inquirer');

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
  validate: validateEmail
};

function validateName(value) {
  const pass = value.match(
    /^[A-Za-z].{1,}$/
  );
  if (pass) {
    return true;
  }
  return 'Please enter a valid name. Minimum 2 characters.';
}
const questionName = {
  type: 'input',
  name: 'name',
  message: 'Please add your name:',
  validate: validateName
};

function validateAvatar(value) {
  const pass = value.match(
    /^(https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  )
  if (pass) {
    return true;
  }
  return 'Please enter a valid avatar url. Must start with "https://"';
}
const questionAvatar = {
  type: 'input',
  name: 'avatar',
  message: 'Please add your avatar url:',
  validate: validateAvatar   
};

function validateTitle(value) {
  const pass = value.match(
    /^[A-Za-z].{1,30}$/
  )
  if (pass) {
    return true;
  }
  return 'Please enter a valid title. Between 2 and 30 characters.';
}
const questionTitle = {
  type: 'input',
  name: 'title',
  message: 'Please add your title:',
  validate: validateTitle
};

function validateDescription(value) {
  if (value) {
    const pass = value.match(
      /^[A-Za-z].{4,80}$/
    )
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
  message: 'Please add your description: (optional)',
  validate: validateDescription
};

function validateCountry(value) {
  const pass = value.match(
    /^[A-Za-z].{3,}$/
  )
  if (pass) {
    return true;
  }
  return 'Please enter a valid country. Minimum 4 characters.';
}
const questionCountry = {
  type: 'input',
  name: 'country',
  message: 'Please add your country:',
  validate: validateCountry
};

function validateTags(value) {
  if (value) {
    const array = value.split(',');
    if (array.length > 0 && array.length < 6) {
      return true;
    }
  }
  return 'Please enter valid tags. Between 1 and 5 tags.';
}
const questionTags = {
  type: 'input',
  name: 'tags',
  message: 'Please add your tags: (Separate by commas)',
  validate: validateTags
};

function validateChannels(answer) {
  if (answer.length < 1) {
    return 'You must choose at least one option.';
  } else if (answer.length > 3) {
    return 'You must choose maximum three options'
  }
  return true;
}
const questionChannels = {
  type: 'checkbox',
  name: 'channels',
  message: 'Please add your channels:',
  choices: [
    {
      name: 'Email'
    },
    {
      name: 'Slack'
    },
    {
      name: 'Linkedin'
    },
    {
      name: 'Facebook'
    },
    {
      name: 'Twitter'
    }
  ],
  validate: validateChannels
};

const questionByChannel = {
  email: {
    type: 'input',
    name: 'Email',
    message: 'Please add your contact email:',
    validate: validateEmail,
    when: (answers) => answers.channels.find((channel) => channel === 'Email')
  },
  slack: {
    type: 'input',
    name: 'Slack',
    message: 'Please add your Slack member id:',
    when: (answers) => answers.channels.find((channel) => channel === 'Slack')
  },
  linkedin: {
    type: 'input',
    name: 'Linkedin',
    message: 'Please add your Linkedin user id:',
    when: (answers) => answers.channels.find((channel) => channel === 'Linkedin')
  },
  facebook: {
    type: 'input',
    name: 'Facebook',
    message: 'Please add your Facebook user id:',
    when: (answers) => answers.channels.find((channel) => channel === 'Facebook')
  },
  twitter: {
    type: 'input',
    name: 'Twitter',
    message: 'Please add your Twitter user id:',
    when: (answers) => answers.channels.find((channel) => channel === 'Twitter')
  }
}

const questions = [
  questionEmail,
  questionName,
  questionAvatar,
  questionTitle,
  questionDescription,
  questionCountry,
  questionTags,
  questionChannels,
  questionByChannel.email,
  questionByChannel.slack,
  questionByChannel.linkedin,
  questionByChannel.facebook,
  questionByChannel.twitter
];

function convertAnswersToSchema(answers) {
  const choices = ['Email', 'Slack', 'Linkedin', 'Facebook', 'Twitter'];
  for (let answer in answers) {
    if (answer === 'tags') {
      answers[answer] = answers[answer].split(',');
    } else if (choices.includes(answer)) {
      answers.channels.forEach((element, index) => {
        if (element === answer) {
          answers.channels[index] = {
            type: answer.toLowerCase(),
            id: answers[answer]
          }
        }
      })
      delete answers[answer];
    }
  }
  return answers;
}

async function main() {
  console.log('Hi, Welcome aboard! Please answer the following questions');
  const answers = await inquirer.prompt(questions);
  const schema = convertAnswersToSchema(answers);
  return schema;
}

module.exports = main;
