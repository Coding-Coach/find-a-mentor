const getPath = (key?: string, value?: string) => {
  if (!key) {
    return '';
  }
  if (key === 'id') {
    return `u/${value}`;
  }
  return `?${key}=${encodeURIComponent(value)}`;
};

const createUrl = (key?: string, value?: string) => {
  return `<url><loc>https://mentors.codingcoach.io/${getPath(
    key,
    value
  )}</loc></url>`;
};

export const buildSitemap = async () => {
  const mentors = await fetch(`https://api.codingcoach.io/mentors?limit=1400`)
    .then((data) => data.json())
    .then((res) => res.data);

  const json = {
    technology: [],
    country: [],
    id: [],
    language: [],
  };

  for (let i = 0; i < mentors.length; i++) {
    json.technology.push(...(mentors[i].tags || []));
    json.country.push(mentors[i].country);
    json.id.push(mentors[i]._id);
    json.language.push(...(mentors[i].spokenLanguages || []));
  }

  json.technology = [...new Set(json.technology)];
  json.country = [...new Set(json.country)];
  json.language = [...new Set(json.language)];

  const lineBreak = '\n\t';
  const URLs = Object.keys(json)
    .map((key) => [...json[key]].map((value) => createUrl(key, value)))
    .flat();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${createUrl()}
  ${URLs.join(lineBreak)}
</urlset>
`;
  return xml;
};
