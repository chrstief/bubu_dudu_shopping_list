/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};
const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  nextConfig,
});
