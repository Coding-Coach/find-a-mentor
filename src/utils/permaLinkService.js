export const setPermalinkParams = (param, value) => {
  const permalink = new URLSearchParams(window.location.search);
  if (value) {
    if (permalink.get(param) !== value) {
      permalink.set(param, value);
      window.history.pushState({}, null, '?' + permalink.toString());
    }
  } else if (permalink.get(param)) {
    permalink.delete(param);
    window.history.pushState({}, null, '?' + permalink.toString());
  }
};

export const getPermalinkParamsValues = () => {
  const permalink = new URLSearchParams(window.location.search);
  return {
    tag: permalink.get('technology') || '',
    country: permalink.get('country') || '',
    name: permalink.get('name') || '',
    language: permalink.get('language') || '',
  };
};
