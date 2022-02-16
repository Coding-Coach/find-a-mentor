/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
        tsconfigPath: './tsconfig.json'
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
