// @ts-check
/**
 * @typedef {'newBackoffice'} Experiments
 */

localStorage.setItem('experiments', JSON.stringify([
  ...(process.env.REACT_EXPERIMENTS || '').split(','),
  ...(new URLSearchParams(window.location.search).get('experiments') || '').split(',')
]));

/**
 * @param {Experiments} name
 */
export const isOpen = name => {
  const openExperiments = JSON.parse(localStorage.getItem('experiments') || '[]');
  return openExperiments.includes(name);
}