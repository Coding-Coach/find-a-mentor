import mentors from '../mentors.json';
import Ajv from 'ajv';
import { get as getPath } from 'object-path';
import countries from 'svg-country-flags/countries.json';
import _ from 'lodash';

expect.extend({
  toBeValid(isValid, errorMessage) {
    return {
      message: () => (isValid ? '' : errorMessage),
      pass: isValid,
    };
  },
});

var ajv = new Ajv({ removeAdditional: false });

const validateSecuredUrl = function(schema, uri) {
  validateSecuredUrl.errors = [
    {
      keyword: 'secured',
      message: 'avatar url must be "https" schema',
      params: { keyword: 'secured' },
    },
  ];
  return uri.indexOf('https://') === 0;
};

const synonymsTags = {
  '(node|node.js)': 'nodejs',
  '(react|React.js)': 'reactjs',
  vue: 'vuejs',
  'react-native': 'react native',
  csharp: 'c#',
  'front end': 'frontend',
  expressjs: 'express',
  'full stack': 'fullstack',
};

const validateSynonymsTags = function(schema, tag) {
  let isValid = true;
  let message = '';
  Object.keys(synonymsTags).forEach(synonym => {
    if (new RegExp(`^${synonym}$`, 'i').exec(tag)) {
      message = `should NOT use "${tag}", should use the conventional name: "${
        synonymsTags[synonym]
      }"`;
      isValid = false;
    }
  });

  validateSynonymsTags.errors = [
    { keyword: 'synonymsTags', message, params: { keyword: 'synonymsTags' } },
  ];
  return isValid;
};

const validateDescription = function(schema, description) {
  const minLength = 5;
  const maxLength = 80;

  let isValid = true;
  let message = '';
  if (description) {
    if (description.length < minLength) {
      isValid = false;
      message = `should NOT be shorter than ${minLength} characters`;
    } else if (description.length > maxLength) {
      isValid = false;
      message = `should NOT be longer than ${maxLength} characters`;
    }
  }
  validateDescription.errors = [
    { keyword: 'description', message, params: { keyword: 'description' } },
  ];
  return isValid;
};

ajv.addKeyword('securedUrl', {
  validate: validateSecuredUrl,
  errors: true,
});

ajv.addKeyword('suitableDescription', {
  validate: validateDescription,
  errors: true,
});

ajv.addKeyword('synonymsTags', {
  validate: validateSynonymsTags,
  errors: true,
});

const mentorSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'email',
      },
      name: {
        type: 'string',
        minLength: 2,
      },
      avatar: {
        type: 'string',
        format: 'uri',
        securedUrl: true,
      },
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 35,
      },
      description: {
        type: 'string',
        suitableDescription: true,
      },
      country: {
        type: 'string',
        enum: Object.keys(countries),
      },
      tags: {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 15,
          pattern: '^[^A-Z]*$',
          synonymsTags: true,
        },
      },
      channels: {
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                'slack',
                'email',
                'linkedin',
                'facebook',
                'twitter',
                'github',
                'website',
              ],
            },
          },
          required: ['type', 'id'],
        },
      },
    },
    required: ['id', 'name', 'avatar', 'title', 'country', 'tags', 'channels'],
  },
};

it('should not have duplicated Id', () => {
  const mentorsId = _.map(mentors, 'id');
  const duplicatedEmails = _.transform(
    _.countBy(mentorsId),
    (result, count, value) => {
      if (count > 1) result.push(value);
    },
    []
  );
  const errorMessage = `Duplicated mentor ID ${duplicatedEmails}`;
  const valid = duplicatedEmails.length > 0 ? false : true;
  expect(valid).toBeValid(errorMessage);
});

it('should mentors schema be valid', () => {
  const valid = ajv.validate(mentorSchema, mentors);
  const errorMessage = (ajv.errors || [])
    .map(error => {
      try {
        const [, index, fieldName] = /\[(.*)\].(.*)/.exec(error.dataPath);
        const mentor = mentors[index];
        const fieldValue = getPath(
          mentor,
          fieldName.replace('[', '.').replace(']', '')
        );

        return [
          `error with mentor "${
            mentor.id
          }"'s (#${index}) field "${fieldName}"!`,
          `  VALUE: ${fieldValue}`,
          `  ERROR: ${error.message}`,
        ].join('\n');
      } catch (error) {
        return error.message;
      }
    })
    .join('\n');
  expect(valid).toBeValid(errorMessage);
});
