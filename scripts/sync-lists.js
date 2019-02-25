const { writeFileSync } = require('fs');

function generateLists() {
  const mentors = require('../src/mentors.json');
  const json = {
    tags: [],
    countries: [],
  }

  for (let i = 0; i < mentors.length; i++) {
    json.tags.push(...(mentors[i].tags || []));
    json.countries.push(mentors[i].country);
  }

  json.tags = [...new Set(json.tags)]
  json.countries = [...new Set(json.countries)]

  return json;
}

writeFileSync('src/lists.json', JSON.stringify(generateLists()));

module.exports = generateLists;
