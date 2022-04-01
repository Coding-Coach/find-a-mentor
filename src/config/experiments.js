// @ts-check
/**
 * @typedef {'newBackoffice'} Experiments
 */

const experiments = {};

/**
 * @param  {string} source
 */
function addSource(source) {
  if (source && source.length) {
    source.split(',').forEach((exp) => {
      experiments[exp] = true;
    });
  }
}

addSource(process.env.NEXT_PUBLIC_EXPERIMENTS);
addSource(new URLSearchParams(window.location.search).get('experiments'));

if (Object.keys(experiments).length) {
  localStorage.setItem('experiments', JSON.stringify(experiments));
}

/**
 * @param {Experiments} name
 */
export const isOpen = (name) => {
  const openExperiments = JSON.parse(
    localStorage.getItem('experiments') || '{}'
  );
  return openExperiments[name];
};
