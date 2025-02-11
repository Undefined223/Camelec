/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // optional but recommended
  experimental: {
    disableOptimizedLoading: true,
    missingSuspenseWithCSRBailout: false,
    appDir: true,
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  webpack: (config) => {
    // Add a rule to handle .geojson files
    config.module.rules.push({
      test: /\.geojson$/,
      type: "json", // Use the built-in JSON parser
    });

    return config;
  },
};

module.exports = nextConfig;