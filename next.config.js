/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['pages', 'src'],
  },
  webpack5: true,
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test instanceof RegExp && rule.test.test('.svg')
    );

    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      module: false,
    };

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
          },
        },
        {
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
