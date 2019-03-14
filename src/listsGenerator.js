export function generateLists(mentors) {
  const json = {
    tags: [],
    countries: [],
  }

  for (let i = 0; i < mentors.length; i++) {
    json.tags.push(...(mentors[i].tags || []));
    json.countries.push(mentors[i].country);
  }

  json.tags = [...new Set(json.tags.map(tag => tag.toLowerCase()))]
  json.countries = [...new Set(json.countries)]

  return json;
}