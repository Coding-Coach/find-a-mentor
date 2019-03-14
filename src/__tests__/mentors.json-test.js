import mentors from '../mentors.json';
import Ajv from 'ajv';

expect.extend({
  toBeValid(isValid, errorMessage) {
    return {
      message: () => isValid ? '' : errorMessage,
      pass: isValid
    }
  }
});

var ajv = new Ajv({ removeAdditional: false });

const validate = function (schema, uri) {
  validate.errors = [{keyword: 'secured', message: 'avatar url must be "https" schema', params: {keyword: 'secured'}}];
  return uri.indexOf('https://') === 0;
};

ajv.addKeyword('securedUrl', {
  validate,
  errors: true
});

const mentorSchema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "format": "email"
      },
      "name": {
        "type": "string",
        "minLength": 2
      },
      "avatar": {
        "type": "string",
        "format": "uri",
        "securedUrl": true,
      },
      "title": {
        "type": "string",
        "minLength": 2,
        "maxLength": 35
      },
      "description": {
        "type": "string",
        "minLength": 5,
        "maxLength": 80
      },
      "country": {
        "type": "string",
      },
      "tags": {
        "type": "array",
        "minItems": 1,
        "maxItems": 5,
        "items": {
          "type": "string",
          "minLength": 1,
          "maxLength": 15
        }
      },
      "channels": {
        "type": "array",
        "minItems": 1,
        "maxItems": 3,
        "items": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": ["slack", "email", "linkedin", "facebook", "twitter"]
            }
          },
          "required": ["type", "id"]
        }
      }
    },
    "required": ["id", "name", "avatar", "title", "country", "tags", "channels"]
  }
}

it('should mentors shema be valid', () => {
  const valid = ajv.validate(mentorSchema, mentors);
  const errorMessage = (ajv.errors || []).map(error => {
    try {
      const [, index, fieldName] = /\[(.*)\].(.*)/.exec(error.dataPath);
      return `error with item #${index}'s field "${fieldName}". The error is: ${error.message}`;
    } catch (error) {
      return error.message;
    }
  }).join('\n');
  expect(valid).toBeValid(errorMessage);
});
