const fs = require('fs');
const countries = require('svg-country-flags/countries.json');
const mentors = require('../src/mentors.json');

mentors.forEach(mentor => {
  mentor.country = getKeyByValue(mentor.country);
})

fs.writeFileSync('test1/mentors.json', JSON.stringify(mentors, null, 2));
// console.log(mentors.map(m => m.country));

function getKeyByValue(value) {
  const k = Object.keys(countries).find(key => countries[key].includes(value));
  if (!k) {
    console.log(value);
  }
  return k;
}