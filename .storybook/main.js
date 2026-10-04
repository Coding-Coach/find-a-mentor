const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx|json|tsx)'],
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  webpackFinal: async (config) => {
    config.plugins = [
      ...(config.plugins || []),
      new webpack.NormalModuleReplacementPlugin(
        /hooks\/useFaceDetection$/,
        path.resolve(__dirname, '../src/stories/mocks/useFaceDetection.tsx')
      ),
    ];

    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test instanceof RegExp && rule.test.test('.svg')) {
        return {
          ...rule,
          exclude: /\.svg$/i,
        };
      }

      return rule;
    });

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            svgo: false,
          },
        },
        {
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    });

    return config;
  },
};
