/**
 * This is a file of helper functions that we can expose and use in our templating function
 *  */

// This is used to generate a uuid for the mentor card
exports.generateMentorId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
