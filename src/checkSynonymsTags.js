const synonymsTags = {
  '(node|node.js)': 'nodejs',
  '(react|React.js)': 'reactjs',
  vue: 'vuejs',
  'react-native': 'react native',
  csharp: 'c#',
  'front end': 'frontend',
  expressjs: 'express',
  'full stack': 'fullstack',
};

module.exports = function(tag) {
  let message = null;
  Object.keys(synonymsTags).forEach(synonym => {
    if (new RegExp(`^${synonym}$`, 'i').exec(tag)) {
      message = `should NOT use "${tag}", should use the conventional name: "${
        synonymsTags[synonym]
      }"`;
    }
  });
  return message;
};
