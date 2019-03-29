import countries from 'svg-country-flags/countries.json';

function mapToItem(label, value) {
  return {
    label,
    value: (typeof(value) === 'string' && value) || label
  }
}

function sortByLabel(a, b) {
  return a.label < b.label ? -1 : 1;
}

export function generateLists(mentors) {
  const json = {
    tags: [],
    countries: [],
    names: [],
  }

  for (let i = 0; i < mentors.length; i++) {
    json.tags.push(...(mentors[i].tags || []));
    json.countries.push(mentors[i].country);
    json.names.push(mentors[i].name);
  }

  json.names = [...new Set(json.names)].map(mapToItem).sort(sortByLabel);
  json.tags = [...new Set(json.tags.map(tag => tag.toLowerCase()))].map(mapToItem).sort(sortByLabel);
  json.countries = [...new Set(json.countries)].map(country => mapToItem(countries[country], country)).sort(sortByLabel);

  return json;
}