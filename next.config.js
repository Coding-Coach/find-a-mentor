/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
    typescript: {
        tsconfigPath: './tsconfig.json',
        ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false,
            os: false,
            module: false,
        };

        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },
  }

  module.exports = nextConfig
