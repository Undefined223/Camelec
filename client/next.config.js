/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // optional but recommended
    experimental: {
        // Add the experimental feature flag to disable the warning
        disableOptimizedLoading: true,
        missingSuspenseWithCSRBailout: false,
        appDir: true,
    },
    server: {
    port: 3000,
    host: '0.0.0.0',
  },
};

module.exports = nextConfig;
