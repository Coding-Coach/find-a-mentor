import mentors from '../mentors.json';
import Ajv from 'ajv';
import lists from '../lists.json';

import generateLists from '../../scripts/generate-lists';

it('should mentors json contains all fields', () => {
  var ajv = new Ajv({ removeAdditional: false });
  const valid = ajv.validate({
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
          "format": "uri"
        },
        "title": {
          "type": "string",
          "minLength": 2
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
            "maxLength": 10
          }
        },
        "channels": {
          "type": "array",
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
  }, mentors);
  if (ajv.errors) {
    console.log(ajv.errors);
  }
  expect(valid).toBeTruthy();
});

it('should lists be synced with the mentors details', () => {
  const json = generateLists();
  expect(lists).toEqual(json);
});
