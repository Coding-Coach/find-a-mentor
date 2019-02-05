import mentors from './mentors.json';
import Ajv from 'ajv';

it('should mentors json contains all fields', () => {
  var ajv = new Ajv({ removeAdditional: false });
  const valid = ajv.validate({
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
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
          "maxLength": 45
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
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": ["slack", "email"]
              }
            },
            "required": ["type", "id"]
          }
        }
      },
      "required": ["name", "avatar", "title", "country", "tags", "channels"]
    }
  }, mentors);
  if (ajv.errors) {
    console.log(ajv.errors);
  }
  expect(valid).toBeTruthy();
});
