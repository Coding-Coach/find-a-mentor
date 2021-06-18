module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx|json|tsx)'],
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
};
