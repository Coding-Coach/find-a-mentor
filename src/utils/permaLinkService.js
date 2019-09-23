export const setPermalinkParams = (param, value) => {
  const permalink = new URLSearchParams(window.location.search);
  if (value) {
    permalink.set(param, value);
  } else {
    permalink.delete(param);
  }
  window.history.pushState({}, null, '?' + permalink.toString());
};

export const getPermalinkParam = () => {};
