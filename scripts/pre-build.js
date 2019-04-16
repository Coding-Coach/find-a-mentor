const fs = require('fs');

const mentors = require('../src/mentors.json');
const json = {
  language: [],
  country: [],
  name: []
}

for (let i = 0; i < mentors.length; i++) {
  json.language.push(...(mentors[i].tags || []));
  json.country.push(mentors[i].country);
  json.name.push(mentors[i].name);
}

json.language = [...new Set(json.language)]
json.country = [...new Set(json.country)]

const breaklink = '\n\t';
const createUrl = (key, value) => `<url><loc>https://mentors.codingcoach.io/${key ? `?${key}=${encodeURIComponent(value)}`: ''}</loc></url>`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${createUrl()}
  ${
    Object.keys(json)
      .map(key => (
        [...json[key]]
          .map(value => createUrl(key, value)))
          .join(breaklink)
      ).join(breaklink)
  }
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);