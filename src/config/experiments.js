// @ts-check
/**
 * @typedef {'newBackoffice'} Experiments
 */

import { getPersistData, setPersistData } from '../persistData';

/** @type {Record<string, boolean>} */
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
  setPersistData('experiments', experiments);
}

/**
 * @param {Experiments} name
 */
export const isOpen = (name) => {
  const openExperiments = getPersistData('experiments') || {};
  return openExperiments[name];
};
