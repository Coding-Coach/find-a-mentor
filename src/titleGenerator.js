import countries from 'svg-country-flags/countries.json';

export const prefix = 'Coding Coach';

export function set({ tag, country, name }) {
  document.title = generate({ tag, country, name });
}

export function generate({ tag, country, name }) {
  let title = prefix;
  if (name || country || tag) {
    title += ' | ';

    if (name) {
      title += name;
    } else {
      if (tag) {
        title += `${tag} `;
      }
      title += 'mentors';
      if (country) {
        title += ` from ${countries[country]}`;
      }
    }
  }
  return title;
}
